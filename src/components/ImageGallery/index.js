import { StyleSheet, Text, View, PermissionsAndroid, FlatList, Image, TouchableOpacity, TouchableWithoutFeedback, Alert, ImageBackground, TextInput, ImageStore } from 'react-native'
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import React, { useEffect, useState } from 'react'
import { colors, WIDTH } from '../../utility';
import { useDispatch, useSelector } from 'react-redux';
import { allImagesSelector, selectedImageSelector, selectedImagesSelector } from '../../redux/selector';
import chatRoomSlice, { getAllImages } from '../../screen/chatRoom/chatRoomSlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const RNFS = require('react-native-fs');

const ImageGallery = ({
    multipleSelect
}) => {
    const allImages = useSelector(allImagesSelector);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getAllImages());
    }, [])
    const ImageItem = ({item})=> { 
        const selectedImages = useSelector(selectedImagesSelector);
        const selectedImage = useSelector(selectedImageSelector)
        const handleSelect= (item) =>{
            if(multipleSelect == true){
                dispatch(chatRoomSlice.actions.setSelectedImages(item));
            } else {
                const image = selectedImage == item ? {} : item
                dispatch(chatRoomSlice.actions.setSelectedImage(image));
                
            }
        }
        return multipleSelect == true ? 
        (
            <View style={{width:WIDTH /3, aspectRatio:1, borderWidth:1, borderColor:colors.WHITE, justifyContent:'center', alignItems:'center'}}>
                <TouchableWithoutFeedback onPress={() => {handleSelect(item?.node.image)}}>
                <ImageBackground style={[{height:'100%', width:'100%' },
                selectedImages.some(e => e.uri == item?.node.image.uri)?{opacity : 0.7, backgroundColor: 'white'} :{} ]} source={{uri:item?.node.image.uri}} >
                </ImageBackground>
                </TouchableWithoutFeedback>
                {
                    selectedImages.some(e => e.uri == item?.node.image.uri) ? 
                    <View style={{height:'30%',aspectRatio:1, borderRadius:100, position:'absolute', backgroundColor:colors.BLUE_DARK}}>
                        <TouchableWithoutFeedback
                        onPress={() => {handleSelect(item?.node.image)}}>
                            <View style={{height:'100%', width:'100%',justifyContent:'center', alignItems:'center'}}>
                            <Text style={{fontSize:16, fontWeight:'500', color:colors.WHITE, alignSelf:'center'}}>{selectedImages.findIndex(e => e.uri == item?.node.image.uri)+1}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View> :
                    <></>
                }
            </View>)
            :
            (
            <View style={{width:WIDTH /3, aspectRatio:1, borderWidth:1, borderColor:colors.WHITE, justifyContent:'center', alignItems:'center'}}>
                <TouchableWithoutFeedback onPress={() => {handleSelect(item?.node.image)}}>
                <ImageBackground style={[{height:'100%', width:'100%' },
                selectedImage.uri == item?.node.image.uri?{opacity : 0.7, backgroundColor: 'white'} :{} ]} source={{uri:item?.node.image.uri}} >
                </ImageBackground>
                </TouchableWithoutFeedback>
                {
                    selectedImage.uri == item?.node.image.uri ? 
                    <View style={{height:'30%',aspectRatio:1, borderRadius:100, position:'absolute', backgroundColor:colors.BLUE_DARK}}>
                        <TouchableWithoutFeedback
                        onPress={() => {handleSelect(item?.node.image)}}>
                            <View style={{height:'100%', width:'100%',justifyContent:'center', alignItems:'center'}}>
                            <Icon  name='check-bold' size={25} color={colors.WHITE}></Icon>
                            </View>
                        </TouchableWithoutFeedback>
                    </View> :
                    <></>
                }
            </View>)
    }
//   const handleSend = () => {
//     new Promise((res, rej) => {
//         res(setListSend([]))
//     })
//     .then(()=> {
//         choose.map(e=> {
//             RNFS.readFile(e.uri, 'base64')
//             .then(base64 => {
//                 setListSend(pre => {
//                     return [...pre, {
//                     data : "data:image/png;base64,"+base64,
//                     height: e.height,
//                     width: e.width
//                 }]})
//             })
//             .catch(err => Alert.alert(err.message))
//         })
//     })
//     .then(()=> {
//         console.log('success');
//         setChoose([]);
//     })
//   }
return (
<View style={{height:'100%', width:'100%', backgroundColor:'white'}}>
    <FlatList
    style={{flexGrow:0}}
    numColumns={3}
    data={allImages}
    renderItem={({item}) => <ImageItem item={item}/>}
    ></FlatList>
</View>
)
}

export default ImageGallery

const styles = StyleSheet.create({})