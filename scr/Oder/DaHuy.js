import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, RefreshControl, View, FlatList, StyleSheet, Button, Text, StatusBar, TouchableOpacity } from 'react-native';
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
const DaHuy = ({ navigation }) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const mongodb = app.currentUser.mongoClient("mongodb-atlas");
  const plants = mongodb.db("OderFood").collection("donhangs");
  const onRefresh = React.useCallback(() => {
    getAllData();
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);
  const [data, setData] = useState([])
  async function getAllData() {
    // const Lay = await plants.find({id_Shipper: ObjectId('628cf1e55745e698ecb8c7bd'), TrangThai: 0 })
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
                          "donhangs.TrangThai" : 0
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
  }

  useEffect(() => {
    getAllData();
  }, [])

  const ListEmptyComponent = () => {
    return (
      <View style={{
        alignItems: 'center',
        marginHorizontal: 50,
        marginTop: 20
      }}>
        <Text style={styles.null}>
          Không có đơn hàng bị từ chối
        </Text>
      </View>
    )
  }
  const renderItem = ({ item }) => (
    <Item       DonHang={item.id_DH} 
                DiaChi ={item.DiaChi}
                Email={item.Email} 
                TrangThai={item.TrangThai}
                SDT = {item.SDT} 
                TongCong = {item.TongCong}
                NgayGiao = {item.NgayDat}
        />
  );
  const Item = ({ DonHang, DiaChi , Email, TrangThai, SDT, TongCong, NgayGiao }) => (
    <TouchableOpacity>
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
  );
  return (
    <LinearGradient colors={['#FFEB32', '#E74B3C']} style={styles.container}>
      <ScrollView refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }>
        <FlatList
          ListEmptyComponent={ListEmptyComponent}
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item._id}
        />
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
    height: 1,
    backgroundColor: '#F98404',
  },
  app: {
    height: 150,
    backgroundColor: 'green',
    fontSize: 50,
    textAlign: 'center',
  }
});

export default DaHuy;