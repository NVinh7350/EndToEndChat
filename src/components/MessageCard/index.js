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

const ImageItem = ({publicKey,item, index}) => {
    // var rowCurrent = Math.ceil((index + 1) / numColumns);
    // var columnCurrent = Math.ceil((index + 1) % numColumns);
    width = item.width /5 || 100;
    height = item.height /5|| 100;
    const [base64, setBase64] = useState('');
    useEffect(()=>{
        (async() => {
                const owner = JSON.parse(await getAsyncStorage('owner'));
                const guest = JSON.parse(await getAsyncStorage('guest'));
                const privateKey = await getAsyncStorage('privateKey');
                const ownerPublicKey = (caculatorPublicKey(privateKey)).toString();
                if( ownerPublicKey != publicKey[owner.uid]) {
                    console.log('Khac key')
                } else
                {
                    const encryptKey = (caculatorEncryptkey(privateKey,publicKey[owner.uid])).toString();
                    const imageDecrypt = await AES_Decrypt(encryptKey, item.imageBase64)._j.message;
                    setBase64(imageDecrypt)
                }
            })()}, [])
    return (
        <TouchableWithoutFeedback onPress={()=>{}}>

            {
                base64 ? 
                <Image  style={{width:width, height: height, maxHeight:HEIGHT*0.5 , maxWidth:WIDTH*0.5, margin:1
                    , borderRadius:  15 
                    , borderWidth:1}} 
                source={{uri: base64 }}
                ></Image>
                :
                <View style={{width:width, height: height, maxHeight:HEIGHT*0.5 , maxWidth:WIDTH*0.5, margin:1
                    ,borderRadius:15
                    , borderWidth:1
                }} >
                </View>
            }
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
        publicKey
    }
) => {
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

    // lengthList = imageList ? Object.values(imageList).length :0 ;
    // switch(lengthList){
    //     case 1:
    //         width = imageList[0]?.width /5 || 100;
    //         height = imageList[0]?.height /5|| 100;
    //         numColumns = 1;
    //         key = 1;
    //         break;
    //     case 2:
    //     case 4:
    //         numColumns = 2;
    //         width = WIDTH * 0.6 /2;
    //         key = 2;
    //         height = width;
    //         break;
    //     case 3:
    //     default:
    //         numColumns = 3;
    //         width = WIDTH * 0.6 /3;
    //         key = 3;
    //         height = width;
    //         break;
    // }
    // numRows = Math.ceil(lengthList / numColumns);
    
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