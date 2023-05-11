import * as React from 'react';
import { Text, View, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../scr/Home'
import Login from '../scr/Login/Login'
import Profile from '../scr/Profile'
import XuLy from '../scr/Oder/XuLy'
import DaHuy from '../scr/Oder/DaHuy'
import DaGiao from '../scr/Oder/DaGiao'
import DangGiao from '../scr/Oder/DangGiao'
import ChiTietDonHang from '../scr/Oder/ChiTietDonHang'

// import Map from '../scr/Map'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUp from '../scr/Login/SignUp'
import RealmApp from '../scr/RealmApp'
import { Title } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const Tab = createBottomTabNavigator()
function MyTabs() {
  return (
    <Tab.Navigator screenOptions={{ tabBarStyle: { backgroundColor: '#E74B3C' }, tabBarActiveTintColor: 'white', tabBarActiveBackgroundColor: '#FFCD38', tabBarShowLabel: false }}>
      <Tab.Screen name="Home" component={Home} options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="home" color={'white'} size={40} />),

      }} />
      <Tab.Screen name="Profile" component={Profile} options={{
        headerShown: false, tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="smart-card" color={'white'} size={40} />),
        tabBarColor: '#d02860'
      }} />
      {/* <Tab.Screen name="Map" component={Map} options={{
        headerShown: false, tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="google-maps" color={'white'} size={40} />),
        tabBarColor: '#d02860'
      }} /> */}
    </Tab.Navigator>
  );
}

const TabTops = createMaterialTopTabNavigator();
// function TabTop() {

//   return (

//     <TabTops.Navigator screenOptions={{tabBarStyle: { backgroundColor: '#F98404', fontWeight: 'bold' }}}>
//       <TabTops.Screen name="Đang Giao" component={Home} />
//       <TabTops.Screen name="Xử Lý" component={XuLy} />
//       <TabTops.Screen name="Đã Giao" component={DaGiao} />
//       <TabTops.Screen name="Đã Hủy" component={DaHuy}/>
//     </TabTops.Navigator>
//   );
// }

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerStyle: { backgroundColor: '#FFEB32' }, headerTitleAlign: 'center', headerTintColor: '#000000' }} /*screenOptions={{headerShown: false}}*/>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={MyTabs} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
        <Stack.Screen name="RealmApp" component={RealmApp} options={{ headerShown: false }} />
        <Stack.Screen name="XuLy" component={XuLy} options={{ title: 'Đơn Chưa Xử Lý' }} />
        <Stack.Screen name="DaHuy" component={DaHuy} options={{ title: 'Đơn Đã Hủy' }} />
        <Stack.Screen name="DaGiao" component={DaGiao} options={{ title: 'Đơn Hàng Đã Giao' }} />
        <Stack.Screen name="DangGiao" component={DangGiao} options={{ title: 'Đơn Hàng Đang Giao' }} />
        {/* <Stack.Screen name="Map" component={Map} options={{  headerShown: false}} /> */}
        <Stack.Screen name="ChiTietDonHang" component={ChiTietDonHang} options={{ title: 'Đơn Hàng Đang Giao' }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}