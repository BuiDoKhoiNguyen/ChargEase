import { View, Text, StyleSheet, SafeAreaView } from 'react-native'
import MapComponent from './MapComponent'
import React from 'react'

export default function HomeScreen() {
  return (
    <View style={{flex: 1}}>
      <MapComponent/>
    </View>
  )
}