import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screen/HomeScreen/HomeScreen';
import FavouriteScreen from '../Screen/FavouriteScreen/FavouriteScreen';
import ProfileScreen from '../Screen/ProfileScreen/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../Utils/Colors';
import { FontAwesome } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
export default function TabNagivation() {
  return (
   <Tab.Navigator screenOptions={{
    headerShown:false,
   }}
   >
    <Tab.Screen name='home' component={HomeScreen}
    options={{
        tabBarLabel:'Home',
        tabBarActiveTintColor:Colors.PRIMARY,
        tabBarIcon:({color,size})=>(
            <Ionicons name="home" size={size} color={color} />
        )
    }}/>
    <Tab.Screen name='favourite' component={FavouriteScreen}
    options={{
        tabBarLabel:'Favourite',
        tabBarActiveTintColor:Colors.PRIMARY,
        tabBarIcon:({color,size})=>(
            <Ionicons name="heart" size={size} color={color} />
        )
    }}
    />
    <Tab.Screen name='profile' component={ProfileScreen}
    options={{
        tabBarLabel:'Profile',
        tabBarActiveTintColor:Colors.PRIMARY,
        tabBarIcon:({color,size})=>(
            <FontAwesome name="user-circle" size={size} color={color} />
        )
    }}
    />

    </Tab.Navigator>
  )
}