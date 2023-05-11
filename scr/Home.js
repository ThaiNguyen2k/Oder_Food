import React, { useState, useEffect, Component   } from 'react';
import { SafeAreaView, Image, Modal, LogBox, VirtualizedList, Alert, Pressable, ScrollView, RefreshControl, View, FlatList, StyleSheet, Button, Text, StatusBar, TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import app from '../RealmKey'
import Realm from "realm";
import { ObjectId } from 'bson';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
function Home({ navigation, route}){
    //! chuỗi kết nối csdl
    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const plants = mongodb.db("OderFood").collection("shippers");
    const [TT, getTT] = useState('')
    //! lấy thông tin từ bảng shiper 
    const GetTT = async () => {
        try {
            //? lấy thông tin theo email
          const Shipper = await plants.findOne({ Email: "honggam@gmail.com"});
            getTT(Shipper)
        } catch (error) {
          alert(`Lỗi: ${error.message}`);
        }
      }
    useEffect(() => {
        GetTT();
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        LogBox.ignoreLogs(['Possible Unhandled Promise Rejection']);
    }, [])

    return (
        <LinearGradient colors={['#FFEB32', '#E74B3C']} style={styles.container}>
            <View style={{flexDirection: 'row'}}>
            <Text style={styles.welcome}>Xin Chào {TT.HoTen}</Text>
            </View>
            <View style={[styles.eye,{marginTop: 130}]}>
                    <TouchableOpacity style={styles.cusButton} onPress={() => {navigation.navigate('DangGiao')}}>
                        <Image source={require('../scr/img/DangGiao.png')} style={{width:'50%', height:'50%'}} />
                        <Text style={styles.text}>Đang Giao</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {navigation.navigate('XuLy')}}
                    style={styles.cusButton}>
                        <Image source={require('../scr/img/ChuaXuLy.png')} style={{width:'50%', height:'50%'}} />
                        <Text style={styles.text}>Chưa Xử Lý</Text>
                    </TouchableOpacity>                  
            </View>
            <View style={styles.eye}>
            <TouchableOpacity style={styles.cusButton} onPress={() => {navigation.navigate('DaGiao')}}>
                        <Image source={require('../scr/img/DaGiao.png')} style={{width:'50%', height:'50%'}} />
                        <Text style={styles.text}>Đã Giao</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cusButton} onPress={() => {navigation.navigate('DaHuy')}}>
                        <Image source={require('../scr/img/DaHuy.png')} style={{width:'50%', height:'50%'}} />
                        <Text style={styles.text}>Đã Hủy</Text>
                    </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    item: {
        backgroundColor: 'white',
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10
    },
    welcome:{
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
        marginTop: 10,
    },
    text:{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',

    },
    cusButton: {
      width: 120,
      height: 120,
      borderRadius: 50 / 2,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
      marginHorizontal: 10,
  },
  eye: {
    flexDirection: 'row',
},
    title: {
        fontSize: 16,
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

export default Home;