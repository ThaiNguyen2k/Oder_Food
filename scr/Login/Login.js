import React, { useEffect, useState } from "react";
import {
  SafeAreaView, TextInput,
  View,
  StyleSheet,
  Text, Image,
  TouchableOpacity, Alert, Button
} from 'react-native';
// import {ObjectId} from 'bson';
import Feather from 'react-native-vector-icons/Feather'
//! Gọi khóa từ realmkey
import app from '../../RealmKey'
// gọi thư viện realm
import Realm from "realm"
import LinearGradient from 'react-native-linear-gradient';
// import bcrypt from 'bcrypt'

export const ConText = React.createContext()
const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  //! Hàm đăng nhập kn mongo
  const onPressSignIn = async () => {
    try {
      const creds = Realm.Credentials.emailPassword(email, password);
      const newUser = await app.logIn(creds);
      setUser(newUser);
      navigation.navigate('Home')
      Alert.alert('Thông Báo', 'Đăng nhập thành công')
    } catch (error) {
      Alert.alert('Thông Báo', `Lỗi: ${error.message}`);
    }
  }
  return (
    <LinearGradient colors={['#FFEB32', '#E74B3C']} style={{ flex: 1 }}>
      <SafeAreaView style={{ alignItems: 'center' }}>
        <Image style={styles.cusImage} source={require('../img/order-food.png')} />
        <Text style={styles.text}>MEMBER LOGIN</Text>
      </SafeAreaView>
      <View style={{ marginTop: -40, alignItems: 'center' }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.viewIcon}>
            <Feather name="mail" size={40} color='gray' style={{ marginTop: 5 }} />
          </View>
          <View style={styles.viewText}>
            <TextInput
              onChangeText={setEmail}
              value={email} autoComplete='email'
              placeholder="Email" style={{ marginLeft: 10, marginTop: 10 }} />
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.viewIcon2}>
            <Feather name="lock" size={40} color='gray' style={{ marginTop: 5 }} />
          </View>
          <View style={styles.viewText2}>
            <TextInput
              onChangeText={(text) => setPassword(text)}
              value={password}
              placeholder="Password" secureTextEntry={true} style={{ marginLeft: 10, marginTop: 0 }} />
            {/* <Feather name="eye" size={30} color='black' style={{ marginLeft: 140 }} /> */}
          </View>
        </View>
        <Text style={{
          marginTop: 10,
          color: 'blue', marginLeft: -80
        }}>Forget password?</Text>
        <TouchableOpacity onPress={onPressSignIn} style={styles.button}>
          <Text style={styles.textButton}>Login</Text>
        </TouchableOpacity>
        <Text style={{
          marginTop: 80,
          color: 'black'
        }}>Don't have an account??</Text>
        <View style={{
          width: 100,
          height: 50,
          borderRadius: 25,
          marginTop: 20,
        }}>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={{ fontWeight: 'bold' }}>Create account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  cusImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 0.4,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
    backgroundColor: '#ffe021',
    width: 200,
    height: 50,
    borderRadius: 25,
  },
  textButton: {
    fontSize: 20,
    marginTop: 10,
    color: 'green',
  },
  viewIcon: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 50,
    width: 50,
    height: 50,
    alignItems: 'center',
  },
  viewText: {
    width: 260,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 50,
    marginLeft: 10
  },
  viewIcon2: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 10,
    width: 50,
    height: 50,
    alignItems: 'center'
  },
  viewText2: {
    width: 260,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 10,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'serif'
  }
})
export default Login;