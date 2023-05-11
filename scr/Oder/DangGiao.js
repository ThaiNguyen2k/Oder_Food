import React, { useState, useEffect } from 'react';
import { SafeAreaView, Modal, VirtualizedList, Alert, Pressable, ScrollView, RefreshControl, View, FlatList, StyleSheet, Button, Text, StatusBar, TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import app from '../../RealmKey'
import Realm from "realm";
import { ObjectId } from 'bson';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';


const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}
const DangGiao = ({ navigation }) => {
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

    const getAllData = async () => {
        try {
            // const Lay = await plants.find({ id_Shipper: ObjectId('628cf1e55745e698ecb8c7bd'), TrangThai: 2 })
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
                          "localField" : "donhangs.Email", 
                          "from" : "thongtins", 
                          "foreignField" : "Email", 
                          "as" : "thongtins"
                      }
                  }, 
                  { 
                      "$unwind" : { 
                          "path" : "$thongtins", 
                          "preserveNullAndEmptyArrays" : false
                      }
                  },
                    { 
                        "$match" : { 
                            "$and" : [
                                { 
                                    "donhangs.TrangThai" : 2
                                }, 
                                { 
                                    "donhangs.id_Shipper" : ObjectId("628cf1e55745e698ecb8c7bd")
                                }
                            ]
                        }
                    }, 
                    { 
                        "$project" : { 
                            "id_DH" : "$donhangs.id_DH", 
                            "Email" : "$thongtins.Email", 
                            "SDT" : "$thongtins.SDT", 
                            "DiaChi" : "$donhangs.DiaChi",
                            "TongCong" : "$donhangs.TongCong",
                            "TrangThai" : "$donhangs.TrangThai",
                            "NgayDat" : "$donhangs.NgayDat",
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
            await plants.updateMany(
                { id_DH: MaDH },
                { $set: { TrangThai: 3 } }
            );
            await dsyeucau.findOneAndDelete(
                { id_DH: MaDH },
                { $set: { TrangThai: 1 } }
            );
            console.log(Ok);
            Alert.alert('Thông Báo',"Bạn đã hoàn thành đơn hàng!")
            setModalVisible(false)
            onRefresh();
        } catch (error) {
            Alert.alert('Thông Báo',`Lỗi: ${error.message}`)
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
                    Không có đơn hàng đang giao
                </Text>
            </View>
        )
    }
    const renderItem = ({ item }) => (
        <Item key={item.id_DH}      
        DonHang={item.id_DH} 
        DiaChi ={item.DiaChi}
        Email={item.Email} 
        TrangThai={item.TrangThai}
        SDT = {item.SDT} 
        TongCong = {item.TongCong}
        NgayGiao = {item.NgayDat}
/>
    )
    const Item = ({ DonHang, Gia, DiaChi , Email, TrangThai, TenMonAn, SoLuong, SDT, TongCong, NgayGiao }) => (

        <View>
            <TouchableOpacity onPress={() => [setModalVisible(true), Ok(DonHang)]}>
                <View style={styles.item}>
                <Text style={styles.title}>Đơn Hàng: {DonHang}</Text>
                <Text style={styles.title}>Ngày đặt: {moment(NgayGiao).format('DD-MM-YYYY')}</Text> 
                <Text style={styles.title}>Email: {Email}</Text>
                <Text style={styles.title}>Điện thoại nhận hàng: {SDT}</Text>
                <Text style={styles.title}>Giao đến: {DiaChi}</Text>   
                <Text style={styles.title}>Tổng cộng: {TongCong} VND</Text>
                <Text style={styles.title}>Trạng Thái: {TrangThai == 1 ? 'Đang xử lý' : (TrangThai == 2 ? 'Đang giao' : (TrangThai == 3 ? 'Đã giao' : 'Đã hủy'))}</Text>
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
                        <Text style={styles.modalText}>Bạn đã hoàn thành đơn hàng? </Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Pressable
                                style={[styles.button, styles.buttonOk]}
                                onPress={onPressOk}>
                                <Text style={styles.textStyle}>Xác Nhận</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.buttonCancel]}
                                onPress={() => setModalVisible(false)}>
                                <Text style={styles.textCancel}>Từ chối</Text>
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
    title: {
        fontSize: 14,
        color: '#000000',
        fontWeight: 'bold',
    },
    null: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
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

export default DangGiao;