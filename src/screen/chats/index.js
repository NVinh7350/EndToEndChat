import { Alert, FlatList, Modal, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React, {useEffect, useLayoutEffect, useState} from 'react'
import ChatItem from '../../components/ChatItem'
import InputField from '../../components/InputField';
import { colors, HEIGHT, WIDTH } from '../../utility';
import CircleImage from '../../components/CircleImage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { allMessagesSelector, chatsSelector, guestSelector, ownerSelector, statusSelector } from '../../redux/selector';
import { getAsyncStorage } from '../../asyncStorage';
import fireStore from '@react-native-firebase/firestore'
import {app} from '../../firebase/firebase-config'
import PopUp from '../../components/PopUp';
import chatsSlice, { getChats } from './chatsSlice';
import searchSlice, { setGuest } from '../search/searchSlice';
import { getAllInvitations } from '../invitations/invitationsSlice';
import { setOwner } from '../login/loginInputSlice';
import chatRoomSlice, { getAllMessages } from '../chatRoom/chatRoomSlice';
let navigations ;
const HeaderComponent = ({navigation}) =>{
    const owner = useSelector(ownerSelector);
    return (
        <View style={ styles.contianerHeader }>
            <View style={styles.containerTitle}>
                <CircleImage
                    containerStyle={styles.imageFrameSmall}
                    source={owner?.profileImg ? {uri: owner?.profileImg} : require('../../utility/image/profileImg.png')}
                    onPress= {()=>{navigation.navigate('Setting')}}
                ></CircleImage>
                <Text style={ styles.title}>   Trò chuyện</Text>
            </View>
            <TouchableWithoutFeedback
            onPress={()=> navigation.navigate('Seach')}
            >
                <View style={styles.search}>
                <Icon
                  name='search'
                  size={20}
                  color={colors.GRAY_DARK}
                  ></Icon>
                  <Text style={{fontSize:16, width:WIDTH*0.7, color: colors.GRAY_DARK}}>Tìm kiếm</Text>
              </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

const Chat = ({chatRoom}) => {
    const dispatch = useDispatch();
    const openChatRoom = async() => {
            dispatch(setGuest(chatRoom?.members?.guest));
            dispatch(chatsSlice.actions.setChatRoom(chatRoom));
            navigations.navigate('ChatRoom')
    }
    return (
        <ChatItem userName={chatRoom?.members?.guest?.userName}
            lastMessage={chatRoom?.lastMessage?.messageContent == 'Hình ảnh mã hoá'? 'Hình ảnh mã hoá' : 'Tin nhắn mã hoá'}
            timeMessage={chatRoom?.lastMessage?.messageTime}
            source={chatRoom?.members?.guest?.profileImg ? {uri: chatRoom?.members?.guest?.profileImg} : require('../../utility/image/profileImg.png')}
            state={'Active'}
            onPress={() =>{ openChatRoom()}}
        ></ChatItem>
    )
}

const Chats = ({navigation}) => {
    navigations = navigation;
    const dispatch = useDispatch();
    const owner = useSelector(ownerSelector);
    const chats = useSelector(chatsSelector);
    const status = useSelector(statusSelector);
    useEffect(() => {
        // lắng nghe người dùng thêm xoá đoạn chat
        const subscriber = fireStore(app)
        .collection('users')
        .doc(owner?.uid)
        .onSnapshot(documentSnapshot => {
            dispatch(setOwner(documentSnapshot.data()))
            dispatch(getChats());
            dispatch(getAllInvitations());
        });
        return () => subscriber();
    }, []);
    return (
        <View>
            <HeaderComponent navigation={navigation}/>
            {
                !chats ? 
                <Text style={styles.titleEmpty}>Hiện tại không có đoạn hội thoại nào</Text> :
                <Text></Text>
            }   
            <FlatList
            data={chats}
            renderItem={({item})=><Chat chatRoom={item}/>}
            ></FlatList>
        </View>
    )
}

export default Chats

const styles = StyleSheet.create({
    container: {
        flex:1,
        
    },
    contianerHeader: {
        height: HEIGHT * 0.2,
        width: WIDTH,
        backgroundColor:colors.BLUE_DARK,
        justifyContent:'space-evenly',
        alignItems:'center'
    },
    containerTitle: {
        height: HEIGHT * 0.08,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        // borderWidth:1,
        paddingHorizontal:WIDTH*0.045
    },
    title: {
        fontSize: 32,
        color: 'white',
        fontWeight: 'bold'
    },
    imageFrameSmall: {
        height: HEIGHT * 0.06,
        aspectRatio: 1,
        borderRadius: 100,
    },
    imageCircle: {
        height: '100%',
        aspectRatio: 1,
        borderRadius: 100
    },
    search:{
        height: HEIGHT * 0.06,
        width: WIDTH * 0.9,
        borderRadius: 30,
        elevation:4,
        flexDirection:'row',
        backgroundColor:colors.WHITE,
        justifyContent:'space-evenly',
        alignItems:'center'
    },
    containerPopUp : {
        height: HEIGHT *0.5,
        width:WIDTH * 0.95,
        backgroundColor:colors.WHITE,
        borderWidth:1,
        elevation:4,
        borderRadius:20
    },
    titleEmpty : {
        fontSize: 22,
        color: colors.GRAY_DARK,
        fontWeight: 'bold',
        position:'absolute',
        top: HEIGHT * 0.5,
        alignSelf:'center'
    }
})