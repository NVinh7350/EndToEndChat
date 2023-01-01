import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { HEIGHT, WIDTH, colors } from '../../utility'
import Icon from 'react-native-vector-icons/MaterialIcons'
import IconM from 'react-native-vector-icons/MaterialCommunityIcons'
import CircleImage from '../../components/CircleImage'
import { useDispatch, useSelector } from 'react-redux'
import { ownerSelector, statusLoginSelector, statusSelector } from '../../redux/selector'
import ChatItem from '../../components/ChatItem'
import loginSlice, { onLogin, onLogOut } from '../login/loginInputSlice'
import Loader from '../../components/Loader'
import searchSlice from '../search/searchSlice'
import chatsSlice from '../chats/chatsSlice'
import settingSlice from './settingSlice'
import invitationsSlice from '../invitations/invitationsSlice'
import chatRoomSlice from '../chatRoom/chatRoomSlice'

const Setting = ({navigation}) => {
    const owner = useSelector(ownerSelector)
    const dispatch = useDispatch();
    const statusLogOut = useSelector(statusLoginSelector);
    const addAvatar = () =>{
        Alert.alert('oke', 'hihi')
    }
    const openInforUser = () => {
        navigation.navigate('AccountSetting');
    }

    const openPasswordAccount = () => {
        navigation.navigate('PasswordSetting');
    }

    const openPasswordEncrypt = () => {
        navigation.navigate('EncryptSetting');
    }

    const logOut = () => {
        dispatch(searchSlice.actions.clearState());
        dispatch(chatsSlice.actions.clearState());
        dispatch(settingSlice.actions.clearState());
        dispatch(loginSlice.actions.clearState());
        dispatch(invitationsSlice.actions.clearState());
        dispatch(chatRoomSlice.actions.clearState());
        dispatch(onLogOut());
    }

    useEffect(()=>{
        if(statusLogOut == 'success'){
            dispatch(loginSlice.actions.setStatusLogin('idle'));
            navigation.navigate('Login');
        } else if (statusLogOut == 'error') {
            dispatch(loginSlice.actions.setStatusLogin('idle'));
            Alert.alert('Lỗi!', 'Đăng xuất thất bại, vui lòng thử lại');
        }
    }, [statusLogOut])

    return (
    <View style = {styles.container} >
        <Loader status={statusLogOut}/>
        <View style={styles.containerHeader}>
            <Icon
                style = {styles.buttonBack}
                    name='arrow-back-ios'
                    size={30}
                    color={colors.BLACK}
                    onPress= {()=> navigation.goBack()}
            ></Icon>
            <Text style={[styles.textTitle, {width:WIDTH*0.8}]}>Cài đặt</Text>
        </View>
        <ScrollView style = {styles.containerBody}>
            <View style={styles.settingAvatar}>
                <CircleImage
                containerStyle={styles.avatar}
                source={owner?.profileImg ? {uri: owner?.profileImg} : require('../../utility/image/profileImg.png')}
                ></CircleImage>
                <Text style={[styles.textTitle, ]}>{owner?.userName}</Text>
            </View>
            <TouchableOpacity style={styles.buttonItem}
            onPress={()=>{openInforUser()}}
            >
                <View style={styles.containerItem}>
                <View style={[styles.iconItem, {backgroundColor:colors.BLUE_DARK}]}>
                    <IconM
                    name='account'
                    size={25}
                    color={colors.WHITE}
                    ></IconM>
                </View>
                <Text style={styles.titleItem}>Thông tin tài khoản</Text>
            </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonItem}
            onPress={()=>{openPasswordEncrypt()}}
            >
                <View style={styles.containerItem}>
                <View style={[styles.iconItem, {backgroundColor:colors.GREEN_DARK}]}>
                    <IconM
                    name='key'
                    size={25}
                    color={colors.WHITE}
                    ></IconM>
                </View>
                <Text style={styles.titleItem}>Mật khẩu mã hoá</Text>
            </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonItem}
            onPress={()=>{openPasswordAccount()}}
            >
                <View style={styles.containerItem}>
                    <View style={[styles.iconItem, {backgroundColor:colors.PURPLE}]}>
                        <IconM
                        name='account-key'
                        size={25}
                        color={colors.WHITE}
                        ></IconM>
                    </View>
                    <Text style={styles.titleItem}>Mật khẩu tài khoản</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonItem}
            onPress={()=>{logOut()}}
            >
                <View style={styles.containerItem}>
                    <View style={[styles.iconItem, {backgroundColor:colors.ORANGE}]}>
                        <IconM
                        name='logout'
                        size={30}
                        color={colors.WHITE}
                        ></IconM>
                    </View>
                    <Text style={styles.titleItem}>Đăng xuất</Text>
                </View>
            </TouchableOpacity>
        </ScrollView>
        
    </View>
  )
}

export default Setting

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    containerHeader:{
        height:HEIGHT * 0.07,
        borderBottomWidth:1,
        borderBottomColor:colors.GRAY_BLAND,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-evenly',
    },
    buttonBack:{
        borderRadius:100
    },
    textTitle: {
        fontSize: 25,
        // width:WIDTH*0.8,
        color: colors.BLACK,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    containerBody:{
        paddingHorizontal:WIDTH*0.05
    },
    settingAvatar:{
        height:HEIGHT * 0.3,
        justifyContent:'space-evenly',
        alignItems:'center',
    },
    avatar:{
        height:HEIGHT *0.15
    },
    iconCamera:{
        height:HEIGHT *0.065,
        aspectRatio:1,
        position:'absolute',
        borderWidth:HEIGHT * 0.005,
        borderColor:colors.WHITE,
        backgroundColor:colors.GRAY_DARK,
        borderRadius:100,
        left:WIDTH * 0.5,
        top:HEIGHT *0.13,
        justifyContent:'center',
        alignItems:'center'
    },
    buttonItem:{
        height: HEIGHT * 0.08,
        marginVertical:HEIGHT *0.01,
        justifyContent:'space-evenly'
    },
    containerItem:{
        height: HEIGHT * 0.08,
        flexDirection:'row',
        justifyContent:'space-evenly'
    },
    iconItem:{
        height:HEIGHT *0.05,
        aspectRatio:1,
        // borderWidth:HEIGHT * 0.005,
        // borderColor:colors.WHITE,
        backgroundColor:colors.GRAY_DARK,
        borderRadius:100,
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center'
    },
    titleItem:{
        width:WIDTH*0.7,
        fontSize:16,
        color:colors.BLACK,
        alignSelf:'center'
    }
})