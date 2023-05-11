import React,{ useState, useEffect } from 'react';
import { View, Button, Pressable, SafeAreaView, StyleSheet } from 'react-native';
import { Avatar, Title, Modal, Caption, Text, TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import app from '../RealmKey'
import { ObjectId } from 'bson';

const ProfileScreen = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const mongodb = app.currentUser.mongoClient("mongodb-atlas");
  const plants = mongodb.db("OderFood").collection("shippers");
  const DaG = mongodb.db("OderFood").collection("donhangs");

  const [TT, getTT] = useState('')
  const [TK, setTK] = useState([])
  const [DH, setDH] = useState([])
  async function getDH() {
      const Dem = await DaG.count({id_Shipper: ObjectId('628cf1e55745e698ecb8c7bd'), TrangThai: 4 });
      setDH(Dem)
  }
  async function getTK() {
    const Tien = await DaG.find({id_Shipper: ObjectId('628cf1e55745e698ecb8c7bd'), TrangThai: 4 });
    setTK(Tien)
}
  function sumArray(TK){
    let sum = 0;
    for (let i = 0; i < TK.length; i++){
        sum += TK[i].TongCong;
    }
    return sum;
}
  const GetTT = async () => {
    try {
      const Shipper = await plants.findOne({ Email: "honggam@gmail.com" });
        getTT(Shipper)
    } catch (error) {
      alert(`Lỗi: ${error.message}`);
    }ho
  }
useEffect(() => {
    GetTT();
    getDH()
    getTK()
}, [])

  return (
    <LinearGradient colors={['#FFEB32', '#E74B3C']} style={styles.container}>
      <View style={styles.userInfoSection}>
        <View style={{ flexDirection: 'row', marginTop: 15, marginBottom:10}}>
          <Avatar.Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/5087/5087579.png' }}
            size={80} style={{backgroundColor: null}}
          />
          <View style={{ marginLeft: 20 }}>
            <Title style={[styles.title, { marginTop: 15, marginBottom: 5, }]}>{TT.HoTen}</Title>
            <Caption style={styles.caption}>@Shipper</Caption>
          </View>
        </View>
        <View style={styles.userInfoSection}>
          <View style={styles.row}>
            <Icon name="map-marker-radius" color="#000000" size={20} />
            <Text style={{ color: "#000000", marginLeft: 20, }}>{TT.DiaChiHienTai}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="phone" color="#000000" size={20} />
            <Text style={{ color: "#000000", marginLeft: 20 }}>{TT.SDT}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="email" color="#000000" size={20} />
            <Text style={{ color: "#000000", marginLeft: 20 }}>{TT.Email}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="calendar" color="#000000" size={20} />
            <Text style={{ color: "#000000", marginLeft: 20 }}>{TT.NgaySinh}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="gender-male-female" color="#000000" size={20} />
            <Text style={{ color: "#000000", marginLeft: 20 }}>{TT.GioiTinh == 0 ? 'Nam' : 'Nữ'}</Text>
          </View>
        </View>
      </View>
      <View style={styles.infoBoxWrapper}>
        <View style={[styles.infoBox, {
          borderRightColor: '#000000',
          borderRightWidth: 1
        }]}>
          <Title>{sumArray(TK)} VND</Title>
          <Caption>Tổng Tiền</Caption>
        </View>
        <View style={styles.infoBox}>
          <Title>{DH}</Title>
          <Caption>Đã Giao</Caption>
        </View>
      </View>
      <View style={styles.menuWrapper}>
        <TouchableRipple onPress={() => { }}>
          <View style={[styles.menuItem]}>
            <Icon name="heart-outline" color="#000000" size={25} />
            <Text style={styles.menuItemText}>Your Favorites</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => { }}>
          <View style={[styles.menuItem]}>
            <Icon name="credit-card-outline" color="#000000" size={25} />
            <Text style={styles.menuItemText}>Payment</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => { }}>
          <View style={[styles.menuItem]}>
            <Icon name="share-outline" color="#000000" size={25} />
            <Text style={styles.menuItemText}>Tell Tour Friends</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => { }}>
          <View style={[styles.menuItem]}>
            <Icon name="account-check-outline" color="#000000" size={25} />
            <Text style={styles.menuItemText}>Support</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => { }}>
          <View style={[styles.menuItem]}>
            <Icon name="cog-outline" color="#000000" size={25} />
            <Text style={styles.menuItemText}>Settings</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => [setModalVisible(true)]}>
          <View style={[styles.menuItem]}>
            <MaterialCommunityIcons name="exit-to-app" color={'#000000'} size={25} />
            <Text style={styles.menuItemText}>Log Out</Text>
          </View>
        </TouchableRipple>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Bạn có muốn đăng xuất? </Text>
          <View style={{ flexDirection: 'row' }}>
            <Pressable onPress={() => navigation.navigate('Login')}
              style={[styles.button, styles.buttonOk]}>
              <Text style={styles.textStyle}>Xác Nhận</Text>
            </Pressable>
            <Pressable onPress={() => [setModalVisible(false)]}
              style={[styles.button, styles.buttonCancel]}>
              <Text style={styles.textCancel}>Hủy</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 5
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
    borderTopColor: '#000000',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 100,
  },
  infoBox: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  menuWrapper: {
    marginTop: 10
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: '#000000',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26
  },
  modalView: {
    margin: 20,
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

export default ProfileScreen;