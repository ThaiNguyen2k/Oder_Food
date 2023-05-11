import React, { useEffect, useState } from "react";
import {
  SafeAreaView, TextInput,
  Button,
  View,
  StyleSheet,
  Text, StatusBar, Image,
  TouchableOpacity,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather'
import app from '../../RealmKey'
import LinearGradient from 'react-native-linear-gradient';
// import bcrypt from 'bcrypt';

const SignUp = ({ navigation}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const onPressSignIn = async () => {
      console.log("Press sign up");
      try {
        await signUp(email, password);
        // bcrypt.hash(password1, rounds, (err, hash) => {
        //   if (err) {
        //     console.error(err)
        //     return
        //   }
        //   console.log(hash)
        // })
        alert('Đăng ký thành công')
        navigation.navigate('Login')
      } catch (error) {
       alert(`Lỗi: ${error.message}`);
      }
    };
    const signUp = async (email, password) => {
      await app.emailPasswordAuth.registerUser({ email, password });
    };
    const password1 = 'oe3im3io2r3o2'
    const rounds = 10
    
    

  return (
    <LinearGradient colors={['#79D70F', 'green']} style={{ flex: 1}}>
      <SafeAreaView style={{ alignItems: 'center' }}>
        <Image style={styles.cusImage} source={require('../img/user.png')} />
        <Text style={styles.text}>MEMBER SIGNUP</Text>
      </SafeAreaView>
      <View style={{ marginTop: -40, alignItems: 'center' }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.viewIcon}>
            <Feather name="mail" size={40} color='gray' style={{ marginTop: 5 }} />
          </View>
          <View style={styles.viewText}>
            <TextInput
              onChangeText={setEmail}
              value={email}
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
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
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
export default SignUp;