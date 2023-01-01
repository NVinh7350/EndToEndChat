import { View, Text, StyleSheet, Animated, TouchableWithoutFeedback, Image, FlatList, Alert } from 'react-native'
import React, { useState , useRef, useEffect} from 'react'
import { colors, HEIGHT, WIDTH } from '../../utility';
import { getTime } from '../../utility/time';
import { getAsyncStorage } from '../../asyncStorage';
import { caculatorEncryptkey, caculatorPublicKey } from '../../encryption/DiffieHellman';
import { AES_Decrypt } from '../../encryption/AES';
let numColumns;
let numRows;
let key ;
let width;
let height;
let lengthList;
let navigations;

const ImageItem = ({item}) => {
    return (
        <TouchableWithoutFeedback onPress={()=>{navigations.navigate('ImageDetail',{item:item})}}>
                <Image  style={{width:250, height: 150, margin:1
                    , borderRadius:  15 
                    , borderWidth:1}} 
                source={{uri: item?.uri }}
                ></Image>
        </TouchableWithoutFeedback>
    )
}

export default MessageCard = (
    {
        messageContent,
        senderBy,
        messageTime,
        imageList,
        decrypt,
        publicKey,
        navigation
    }
) => {
    navigations = navigation;
    const beginMotion = useRef(new Animated.Value(0)).current;
    const animatedShowTime = (motion, value, duration) => {
        Animated.timing(
            motion,
            {
                toValue:value,
                duration: duration,
                useNativeDriver:false
            }
        ).start();
    }
    const [showTime, setShowTime] = useState(false);
    useEffect(()=>{
        if(showTime) {
            animatedShowTime(beginMotion, 20, 200);
        }else{
            animatedShowTime(beginMotion, 0, 200);
        }
    },[showTime])

    
    const customStyle = {
        view : 
            decrypt ? 
            {
                alignSelf: senderBy ? "flex-end" : "flex-start",
                backgroundColor: senderBy ? colors.BLUE_DARK : colors.GRAY_CLOUD 
            } : {
                alignSelf: senderBy ? "flex-end" : "flex-start",
                backgroundColor: colors.WHITE,
                borderWidth:1,
                borderColor: colors.WARNING
            }
        ,
        text : 
            decrypt ? 
            {
                color: senderBy ? colors.WHITE : colors.BLACK
            } : {
                color: colors.BLACK,
                fontSize: 13
            }
    }

    return (
    <View style={{justifyContent:'space-around'}}>
        <Animated.View
        style={{ height:beginMotion, width:'100%'}}>
            <Text style={styles.textTime}>
                {getTime(messageTime)}
            </Text>
        </Animated.View>

        <TouchableWithoutFeedback
        onPress={()=>{setShowTime(!showTime)}}>
            <View style={[styles.containerMessage, customStyle.view]}>
                {
                    imageList?.length != 0 ? 
                    <FlatList
                        style = {{flexGrow:0, backgroundColor:'white'}}
                        data={imageList}
                        renderItem={({item, index}) => <ImageItem publicKey={publicKey} item={item} index ={index}/>}
                        numColumns={numColumns}
                        key={key}
                    ></FlatList>
                    :
                    <Text style= {[styles.textMessage, customStyle.text]}>{messageContent}</Text>
                }
            </View>
        </TouchableWithoutFeedback>

        <Animated.View
        style={{ height:beginMotion, width:'100%'}}>
            <Text style={{textAlign:'center'}}>
                {}
            </Text>
        </Animated.View>
        
    </View>
  )
}

const styles = StyleSheet.create({
    containerMessage:{
        backgroundColor: colors.GRAY_DARK,
        borderRadius:10,
        justifyContent:"space-around",
        marginVertical:HEIGHT*0.005,
        marginHorizontal: WIDTH * 0.025,
    },
    textMessage:{
        color: colors.BLACK,
        fontSize: 16,
        marginVertical: HEIGHT*0.005,
        maxWidth:WIDTH*0.8,
        paddingHorizontal:10,
        paddingVertical:5
    },
    textTime : {
        textAlign:'center',
        color:colors.GRAY_DARK
    }
})