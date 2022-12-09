import { Animated, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { allMessagesSelector, chatRoomSelector, guestSelector, ownerSelector } from '../../redux/selector'
import MessageCard from '../../components/MessageCard'
import { HEIGHT, WIDTH, colors } from '../../utility'
import Icon from 'react-native-vector-icons/MaterialIcons'
import MessageInput from '../../components/MessageInput'
import chatRoomSlice, { getAllMessages, getNewMessage } from './chatRoomSlice'
import fireStore from '@react-native-firebase/firestore'
import {app} from '../../firebase/firebase-config'
import ChatItem from '../../components/ChatItem'
let navigations;
const Header = ({guest}) => {
    const dispatch = useDispatch();
    return (
        <View style={ styles.containerHeader }>
            <Icon
            style = {styles.buttonBack}
                name='arrow-back-ios'
                size={28}
                color={colors.BLACK}
                onPress= {()=> {
                    dispatch(chatRoomSlice.actions.setAllMessages([]))
                    navigations.goBack()
                }}
            ></Icon>
            <ChatItem
            containerStyle={{width:WIDTH*0.5}}
            containerImageStyle={styles.avatar}
            imageStyle={{height:'100%'}}
            source={{uri : guest.profileImg}}
            userName={guest.userName}
            />
        </View>
  )
}

const Input = ({ motionFlatList}) => {
    return (
        <MessageInput
        motionFlatList={motionFlatList}
        />
    )
}

const Body = ({ motionFlatList}) => {
    const allMessages = useSelector(allMessagesSelector);
    return (
        <Animated.FlatList style={[styles.containerBody, {height:motionFlatList}]}
            data={allMessages}
            inverted
            showsVerticalScrollIndicator={false}
            renderItem={({item})=> {
                return (
                    <MessageCard
                    messageContent={item?.messageContent}
                    messageTime = {item?.messageTime}
                    senderBy = {item?.sentByOwner}
                    decrypt = {item?.decrypt}
                    imageList = {item?.imagesList}
                    publicKey = {item?.publicKey}
                    />)
            }
            }>
        </Animated.FlatList>
    )
}

const ChatRoom = ({navigation}) => {
    navigations = navigation;
const guest = useSelector(guestSelector);
const chatRoom = useSelector(chatRoomSelector);
const owner = useSelector(ownerSelector);
const motionFlatList = useRef((new Animated.Value(HEIGHT*0.8))).current;
const dispatch = useDispatch();
useEffect(() => {
    var firstLoad = true;
    const subscriber = fireStore(app).collection('messages').doc(chatRoom.chatId).onSnapshot(sn => {
        const result = Object.values(sn.data()).sort((a,b) => {
            return a.messageTime - b.messageTime
        })
        if(!firstLoad){
            console.log('get new')
            dispatch(getNewMessage(result.pop()))
        }
        else{
            console.log('get All')
            dispatch(getAllMessages(result))
            firstLoad = false
        }
    })
    return () => subscriber();
},[])
return (
    <View style={styles.container}>
        
        <Header guest={guest}/>
        <View style={{height:3, elevation:5}}></View>
        <Body motionFlatList={motionFlatList}/>
        <Input motionFlatList={motionFlatList}/>
    
    </View>
    
)
}
export default ChatRoom


const styles = StyleSheet.create({
    container: {
        flex: 1
      },
    containerHeader: {
        height: HEIGHT * 0.075,
        width: WIDTH,
        backgroundColor: colors.WHITE,
        alignItems:'center',
        flexDirection:'row',
        
    },
    avatar:{
        height: HEIGHT * 0.065,
    },  
    containerBody: {
        height: HEIGHT * 0.756,
        width: WIDTH,
        backgroundColor: colors.WHITE,
    },
    containerTail: {
        height: HEIGHT * 0.065,
        width: WIDTH,
        backgroundColor: colors.WHITE,
        justifyContent: 'center',
        alignItems:'center',
        flexDirection:'row',
        elevation:0,
    },
    inputMessage: {
        width:WIDTH*0.65,
        marginTop:0,
        marginHorizontal:0,
        elevation:0,
        backgroundColor:colors.GRAY_CLOUD,
        borderRadius:20
    },
    buttonSend: {
        width: WIDTH*0.1,
        marginTop:0,
        marginHorizontal:0,
        backgroundColor:colors.WHITE,
        elevation: 0

    },
    buttonBack:{
        marginHorizontal:15,
        // borderWidth:1
    },
    backgroundImage: {
        height: '100%',
        width: '100%'
    },
    textName: {
        fontSize: 20,
        color: colors.BLACK,
        fontWeight: 'bold',
    }
})