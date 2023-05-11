import React, { useState, useEffect } from 'react';
import { SafeAreaView, Modal, VirtualizedList, Alert, Pressable, ScrollView, RefreshControl, View, FlatList, StyleSheet, Button, Text, StatusBar, TouchableOpacity } from 'react-native';
import app from '../../RealmKey'
import Realm from "realm";
import { ObjectId } from 'bson';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';


const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}
const XuLy = ({ navigation }, info) => {
    const [refreshing, setRefreshing] = React.useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    //! chuổi kết nối
    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const plants = mongodb.db("OderFood").collection("donhangs");
    const dsyeucau = mongodb.db("OderFood").collection("danhsachyeucaus");

    const onRefresh = React.useCallback(() => {
        getAllData();
        setRefreshing(true);
        wait(1000).then(() => setRefreshing(false));
    }, []);
    const [data, setData] = useState([])

    //! lấy id object JSON.parse (JSON.stringify (object))
    const getAllData = async () => {
        try {
            //! lấy dữ liệu về theo id_Shipper
            const Lay = await dsyeucau.aggregate(
                [
                    { 
                        "$project" : { 
                            "_id" : 0, 
                            "danhsachyeucaus" : "$$ROOT"
                        }
                    }, 
                    { 
                        "$lookup" : { 
                            "localField" : "danhsachyeucaus.id_DH", 
                            "from" : "donhangs", 
                            "foreignField" : "id_DH", 
                            "as" : "donhangs"
                        }
                    }, 
                    { 
                        "$unwind" : { 
                            "path" : "$donhangs", 
                            "preserveNullAndEmptyArrays" : false
                        }
                    }, 
                    { 
                        "$lookup" : { 
                            "localField" : "donhangs.id_CH", 
                            "from" : "cuahangs", 
                            "foreignField" : "_id", 
                            "as" : "cuahangs"
                        }
                    }, 
                    { 
                        "$unwind" : { 
                            "path" : "$cuahangs", 
                            "preserveNullAndEmptyArrays" : false
                        }
                    }, 
                    { 
                        "$match" : { 
                            "$and" : [
                                { 
                                    "danhsachyeucaus.TrangThai" : 0
                                },
                            ]
                        }
                    }, 
                    { 
                        "$project" : { 
                            "id_DH" : "$donhangs.id_DH", 
                            "NgayDat" : "$donhangs.NgayDat", 
                            "TenCH" : "$cuahangs.TenCH", 
                            "SDT" : "$cuahangs.SDT", 
                            "DiaChi_CH" : "$cuahangs.DiaChi", 
                            "DiaChi_NH" : "$donhangs.DiaChi", 
                            "TongCong" : "$donhangs.TongCong", 
                            "TrangThai" : "$danhsachyeucaus.TrangThai", 
                            "id_Shipper" : "$danhsachyeucaus.id_Shipper",
                            "_id" : 0
                        }
                    }
                ], 
                { 
                    "allowDiskUse" : true
                }
            );
            setData(Lay)
        } catch (error) {
            Alert.alert('Thông Báo',`Lỗi: ${error.message}`);
        }
    }
    useEffect(() => {
        getAllData();
    }, [])
    const [MaDH, SetMaDH] = useState('')
    const [id, Setid] = useState('')

    async function Ok(DonHang, id_Shipper) {
        const MaDH = DonHang
        SetMaDH(MaDH)
        const ID = id_Shipper
        Setid(ID)

    }
    async function onPressOk() {
        try {
            //! cập nhật trạng thái từ 1 thành 2 nếu nhận đơn
            await plants.updateMany(
                { id_DH: MaDH },
                { $set: {TrangThai: 2, id_Shipper: ObjectId(id) } },
            ),
            await dsyeucau.updateMany(
                { id_DH: MaDH },
                { $set: {TrangThai: 1 } }
            );
            console.log(Ok);
            Alert.alert('Thông Báo',"Nhận đơn thành công, vui lòng kiểm tra tại mục Đang Giao")
            setModalVisible(false)
            onRefresh();
        } catch (error) {
            console.log(`Lỗi: ${error.message}`)
            setModalVisible(false)
        }
    }
    async function onPressCancel() {
        try {
            //! cập nhật trạng thái từ 1 thành 0 nếu từ chối đơn
            await plants.updateOne(
                { id_DH: MaDH },
                { $set: { TrangThai: 1 } }
            ),
            await dsyeucau.findOneAndDelete(
                { id_DH: MaDH }
            );
            Alert.alert('Thông Báo',"Hủy Thành Công")
            setModalVisible(false)
            onRefresh();
        } catch (error) {
            console.log(`Lỗi: ${error.message}`)
            setModalVisible(false)
        }
    }
    const ListEmptyComponent = () => {
        return (
            <View style={{
                alignItems: 'center',
                marginHorizontal: 50,
                marginTop: 20
            }}>
                <Text style={styles.null}>
                    Không có đơn hàng chờ xử lý
                </Text>
            </View>
        )
    }
    const renderItem = ({ item }) => (
        <Item key={item.id_DH}      
                DonHang={item.id_DH}
                NgayDat = {item.NgayDat}
                TenCH = {item.TenCH} 
                DiaChi_CH ={item.DiaChi_CH}
                SDT = {item.SDT} 
                TrangThai={item.TrangThai}               
                TongCong = {item.TongCong}
                i_d = {item.id_Shipper}
                DiaChi_NH ={item.DiaChi_NH}
        />
    )
    const Item = ({ DonHang, NgayDat, TenCH, DiaChi_CH, TrangThai, SDT, TongCong, i_d, DiaChi_NH }) => (

        <View>
            <TouchableOpacity onPress={() => [setModalVisible(true), Ok(DonHang, i_d)]}>
                <View style={styles.item}>
                    <Text style={styles.title}>{TrangThai == 0 ? 'Đang chờ xác nhận' : "Đã nhận"}</Text>
                    <Text style={styles.title}>Đơn Hàng: {DonHang}</Text>
                    <Text style={styles.title}>Ngày yêu cầu: {moment(NgayDat).format('DD-MM-YYYY')}</Text>
                    <Text style={styles.title}>Tổng cộng: {TongCong} VND</Text>
                    <Text style={styles.title}>Từ: {DiaChi_CH} </Text>
                    <Text style={styles.title}>{TenCH} </Text>
                    <Text style={styles.title}>Điện thoại: {SDT} </Text>
                    <Text style={styles.title}>Đến: {DiaChi_NH}</Text>
                    
                    {/* <Text style={styles.title}>Địa Chỉ: {DiaChi}</Text> */}
                    {/* <Text style={styles.title}>Email: {Email}</Text> */}
                    <Button title="Xem chi tiết" onPress={()=>{navigation.navigate('ChiTietDonHang', {id_DH: DonHang})}}></Button>
                </View>
            </TouchableOpacity>
        </View>
    )
    return (
        <LinearGradient colors={['#FFEB32', '#E74B3C']} style={styles.container}>
            <ScrollView refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh} />}>
                <FlatList
                    ListEmptyComponent={ListEmptyComponent}
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item._id} />
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Bạn có muốn nhận đơn hàng? </Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Pressable
                                style={[styles.button, styles.buttonOk]}
                                onPress={onPressOk}>
                                <Text style={styles.textStyle}>Xác Nhận</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.buttonCancel]}
                                onPress={onPressCancel}>
                                <Text style={styles.textCancel}>Từ Chối</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        backgroundColor: 'white',
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10


    },
    null: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
    },
    line: {
        height: 1.5,
        backgroundColor: '#F98404',
    },
    app: {
        height: 150,
        backgroundColor: 'green',
        fontSize: 50,
        textAlign: 'center',
    },
    modalView: {
        margin: 20,
        marginTop: 250,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        border: 3,
        width: 120,
        marginHorizontal: 10,
        alignItems: "center",
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonOk: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
    },
    textCancel: {
        color: "black",
        fontWeight: "bold",
    },
    buttonCancel: {
        backgroundColor: "white",

    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});

export default XuLy;