import { Button, Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { initializeApp, getApp, getApps } from "firebase/app";
import firestore from "@react-native-firebase/firestore";
import { app } from './src/firebase/firebase-config';
import auth from "@react-native-firebase/auth";
import Index from './src/navigations';
import store from './src/redux/store'
import { Provider, useSelector } from 'react-redux';
import ImageGallery from './src/components/ImageGallery';
import { selectedImagesSelector } from './src/redux/selector';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAsyncStorage, setAsyncStorage } from './src/asyncStorage';
import { useEffect } from 'react';
import { useState } from 'react';
import {  Image as im } from "react-native-compressor";
const AppChild = () => {
const imageList = useSelector(selectedImagesSelector)
const [lastImage, setLastImage] = useState([]);
const handleSend = async() => {
  console.log(imageList.length)
  console.log(imageList[0])
  // const image = await AsyncStorage.getItem('image');
  // return JSON.parse(image)
  const imageCompressor = await im.compress(imageList[0].uri, {
    compressionMethod: 'auto',
    returnableOutputType:'base64'
  });
  // console.log(imageCompressor.length)
  // setLastImage(imageCompressor)
  let arrr = [];
  for(let i = 0; i<10; i++) {
    arrr.push(imageCompressor)
  }
  // console.log(arrr.length)
  setAsyncStorage('List', JSON.stringify(arrr)).then((data) => {
    console.log('Ok')
  })
  .catch(err => {
    console.log('ERROR', err.message);
  })
  // console.log(lastImage)
  // await AsyncStorage.setItem('image', arrr);
}
// useEffect(() => {
//   (async() => {
//     const image = await AsyncStorage.getItem('List');
//     // return JSON.parse(image)
//     // console.log(typeof JSON.parse(image))
//     // image = JSON.parse(image);
//     console.log(Array.isArray(image))
//   })()
//   // setLastImage(async() => {
//   //   const image = await AsyncStorage.getItem('image');
//   //   return JSON.parse(image)
//   // })
// }, [])
// var x = 'data:image/png;base64,'+lastImage;
const handleGet = async() => {
  getAsyncStorage('List').then(data => {
    console.log('get success')
    // console.log(data)
    setLastImage(JSON.parse(data))
  }).catch(err => {
    console.log('get Errr', err.message)
  })
}
console.log(`data:image/png;base64,${lastImage[0]}`)
  return <View>
    <View style = {{height: 400}}>
    <ImageGallery></ImageGallery>
    </View>
    <Button
    title='ok'
    onPress={handleSend}
    ></Button>
    <Button
    title='get'
    onPress={handleGet}
    ></Button>
    {
      lastImage?.map(e =>  <Image style= {{height : 100, width:100, borderWidth:1}}
        source={{uri : 'data:image/png;base64,'+e}}
        ></Image>)
    }
    <Image style= {{height : 100, width:100, borderWidth:3}}
        source={{uri : `data:image/png;base64,${lastImage[0]}`}}
        ></Image>
  </View>
}
const App = () => {
  
  return (
    <Provider store={store}>
      <Index/>
      {/* <AppChild/> */}
      
    </Provider>
  )
}

export default App

const styles = StyleSheet.create({})