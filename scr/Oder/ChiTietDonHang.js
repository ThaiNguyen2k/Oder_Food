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
const ChiTietDonHang = ({ navigation, route }, info) => {
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
            const { id_DH } = route.params;
            console.log(id_DH)
            const Lay = await plants.aggregate(
                [
                    { 
                        "$project" : { 
                            "_id" : 0, 
                            "donhangs" : "$$ROOT"
                        }
                    }, 
                    { 
                        "$lookup" : { 
                            "localField" : "donhangs.id_DH", 
                            "from" : "chitietdonhangs", 
                            "foreignField" : "id_DH", 
                            "as" : "chitietdonhangs"
                        }
                    }, 
                    { 
                        "$unwind" : { 
                            "path" : "$chitietdonhangs", 
                            "preserveNullAndEmptyArrays" : false
                        }
                    }, 
                    { 
                        "$lookup" : { 
                            "localField" : "chitietdonhangs.id_MonAn", 
                            "from" : "menus", 
                            "foreignField" : "_id", 
                            "as" : "menus"
                        }
                    }, 
                    { 
                        "$unwind" : { 
                            "path" : "$menus", 
                            "preserveNullAndEmptyArrays" : false
                        }
                    }, 
                    { 
                        "$match" : { 
                            "donhangs.id_DH" : id_DH
                        }
                    }, 
                    { 
                        "$project" : { 
                            "id_DH" : "$donhangs.id_DH", 
                            "TenMonAn" : "$menus.TenMonAn", 
                            "GiaBan" : "$menus.GiaBan", 
                            "SoLuong" : "$chitietdonhangs.SoLuong", 
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

    async function Ok(DonHang) {
        const MaDH = DonHang
        SetMaDH(MaDH)
    }
    async function onPressOk() {
        try {
            //! cập nhật trạng thái từ 1 thành 2 nếu nhận đơn
            await plants.updateMany(
                { id_DH: MaDH },
                { $set: {TrangThai: 2 } }
            ),
            await dsyeucau.updateMany(
                { id_DH: MaDH },
                { $set: {TrangThai: 2 } }
            );
            console.log(Ok);
            Alert.alert('Thông Báo',"Nhận đơn thành công, vui lòng kiểm tra tại mục Đang Giao")
            navigation.navigate('Home')
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
                { $set: { TrangThai: 0 } }
            ),
            await dsyeucau.updateMany(
                { id_DH: MaDH },
                { $set: {TrangThai: 0 } }
            );
            Alert.alert('Thông Báo',"Hủy Thành Công")
            navigation.navigate('Home')
            setModalVisible(false)
            onRefresh();
        } catch (error) {
            Alert.alert('Thông Báo',"Vui lòng thử lại")
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
        <Item   key = {item.id_DH}
                DonHang={item.id_DH} 
                TenMonAn = {item.TenMonAn}
                Gia={item.GiaBan}
                SoLuong = {item.SoLuong}
        />
    );
    const Item = ({ DonHang, Gia, TenMonAn, SoLuong }) => (
        <TouchableOpacity>
            <View style={styles.item}>
                <Text style={styles.title}>Đơn Hàng: {DonHang}</Text>
                <Text style={styles.title}>Chi tiết:</Text>
                <Text style={styles.title}>{TenMonAn} x {SoLuong}</Text>
                <Text style={styles.title}>Giá: {Gia} VND</Text>
            </View>
        </TouchableOpacity>
    );
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
        fontSize: 16,
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

export default ChiTietDonHang;