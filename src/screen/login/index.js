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
  const [images, setImage] = useState();
  const send = async() => {
    const c = await Image.compress('file:///storage/emulated/0/Pictures/splash.png', {
      compressionMethod: 'auto',
      returnableOutputType:'base64'
      });
    setImage(`data:image/jpeg;base64,${c}`);
    console.log(c)
  }
  return (
    <View style={styles.container}>
      <LoginHeader/>
      <LoginInputForm navigation= {navigation}/>
      {/* <ImageBackground style={{height:100, width:100}} source={{uri: images}}></ImageBackground> */}
      {/* <ImageGallery choose={a} setChoose={setA}/> */}
      {/* <TouchableOpacity onPress={() => send()}><Text>Send</Text></TouchableOpacity> */}
      {/* <TouchableOpacity onPress={() => accept()}><Text>Accpet</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => refuse()}><Text>Refuse</Text></TouchableOpacity>
      <FlatList
      inverted={true}
      data={list}
      renderItem={({item}) => <Text style={{fontSize:50}}>{item?.content}</Text>}
      ></FlatList> */}
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