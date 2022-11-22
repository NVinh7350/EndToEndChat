import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { initializeApp, getApp, getApps } from "firebase/app";
import firestore from "@react-native-firebase/firestore";
import { app } from './src/firebase/firebase-config';
import auth from "@react-native-firebase/auth";
import Index from './src/navigations';
import store from './src/redux/store'
import { Provider } from 'react-redux';
const App = () => {
  return (
    <Provider store={store}>
      <Index/>
    </Provider>
  )
}

export default App

const styles = StyleSheet.create({})