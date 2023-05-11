import Realm from 'realm';
import React from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Button, Text, StatusBar,TouchableOpacity  } from 'react-native';
import app from '../RealmKey'


async function openRealm() {
    const realm = await Realm.open({
        inMemory: true,
      });
      alert('1')

    realm.write(() => {
        realm.create(schema, {
          _id: '123',
          name: "go grocery shopping",
          status: "Open",
        })
        alert('1')
      })
}
const RealmApp = ({navigation}) => {
    // const signOut = () => {
    //     console.log(user)
    //     if (user == null) {
    //       console.warn("Not logged in, can't log out!");
    //       return;
    //     }
    //     user.logOut();
    //     alert('Đã đăng xuất khỏi trái đất!!')
    //     setUser(null);
    //   };
    return(
        <View>
            <TouchableOpacity onPress={openRealm}>
                <Text style={{alignItems: 'center', marginTop: 50}}>Add</Text>
            </TouchableOpacity>
            <Button title='SignOut'
            onPress={signOut}
            ></Button>
        </View>
    )
}
export default RealmApp;