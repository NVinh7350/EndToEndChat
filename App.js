import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { initializeApp, getApp, getApps } from "firebase/app";
import firestore from "@react-native-firebase/firestore";
import { app } from './src/firebase/firebase-config';
import auth from "@react-native-firebase/auth";
const App = () => {
  return (
    <View>
      <Text>App</Text>
    </View>
  )
}

export default App

const styles = StyleSheet.create({})