import { FlatList, StyleSheet, Text, TouchableOpacity, View, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import InputField from '../../components/InputField'
import LoginInputForm from './loginInputForm'
import LoginHeader from './loginHeader'
import fireStore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import {app} from '../../firebase/firebase-config'
import ImageGallery from '../../components/ImageGallery'
import { caculatorPublicKey } from '../../encryption/DiffieHellman'
import { ca } from '../../../test'
import { Image } from 'react-native-compressor'
const Login = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <LoginHeader/>
      <LoginInputForm navigation= {navigation}/>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center'
    }
})