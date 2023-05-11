import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,Alert
} from 'react-native';
import app from './RealmKey'
import Realm from "realm"
import Login from './scr/Login/Login';
import HomeScreen from './Navigation/index';

const App=() => {

  const [user, setUser] = useState("");

  const signIn = async () => {
    const creds = Realm.Credentials.emailPassword("nguyendragon2000@gmail.com", "thainguyen");
    const newUser = await app.logIn(creds);
    setUser(newUser);
  }
  useEffect(() => {
    signIn()
}, [])
  return (
      <HomeScreen/>
  );
};

export default App;
