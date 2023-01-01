import { View, Text, StyleSheet, Image, Dimensions, Alert } from 'react-native'
import React ,  { useContext, useEffect }from 'react'
import { colors, HEIGHT, WIDTH } from '../../utility'
import CircleImage from '../../components/CircleImage';
import ButtonField from '../../components/ButtonField';
import { useDispatch, useSelector } from 'react-redux';
import { checkFriendSelector, privateKeySelector, guestSelector, checkInvitationSelector } from '../../redux/selector';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getAsyncStorage } from '../../asyncStorage';
import settingSlice, { setPrivateKey } from '../setting/settingSlice';
import { app } from '../../firebase/firebase-config';
import fireStore from '@react-native-firebase/firestore'
import { sendInvitation } from '../invitations/invitationsSlice';
let navigations;
export default function Profile({navigation}) {
    const guest = useSelector(guestSelector);
    const checkFriend = useSelector(checkFriendSelector);
    const checkInvitaion = useSelector(checkInvitationSelector);
    const privateKey = useSelector(privateKeySelector);
    const dispatch = useDispatch(settingSlice);
    navigations= navigation;
    const handleOpenMessage = async() => {
            if(checkFriend == true) {
                navigation.navigate('ChatRoom')
            } else {
                Alert.alert('Thông báo', `Gửi lời mời trò chuyện đến ${guest?.userName}?`);
            }
    }

    const handleSendInvitaion = async() => {
        const privateKeyStorage = await getAsyncStorage('privateKey');
            
            if(privateKeyStorage) {
                if(checkFriend == true) {
                    Alert.alert('Thông báo', `Bạn đã được kết nối với ${guest?.userName}`);
                } else {
                        if(checkInvitaion != false) {
                            if(checkInvitaion == guest.uid){
                                navigation.navigate('Invitations');
                            }
                        }
                        else {
                            dispatch(sendInvitation());
                        }
                }
            } else {
            Alert.alert('Lỗi!', 'Bạn chưa cài đặt khoá mã hoá', [
                {
                    text:'Đi đến cài đặt',
                    onPress:()=> navigation.navigate('EncryptSetting')
                },
                { 
                    text:'Huỷ',
                }
            ])
        }
    }

    return (
        <View>
            <View style={ styles.containerHeader }>
            <Image
            style={ styles.backgroundImage}
            source={{ uri: 'https://dohanews.co/wp-content/uploads/2022/05/aww7nqnvmdzd6brsvv2d-1-560x315.jpeg'}}
            ></Image>
            <Icon
            style = {styles.buttonBack}
                name='arrow-back-ios'
                size={30}
                color={colors.WHITE}
                onPress= {()=> navigations.goBack()}
            ></Icon>
            </View>


            <View style={ styles.containerBody }>
            <CircleImage
            containerStyle={ styles.containerAvatar }
            source={guest?.profileImg ? {uri: guest?.profileImg} : require('../../utility/image/profileImg.png')}
            />
            <Text
            style= { styles.textName }
            >{guest?.userName}</Text>
            <View 
            style= { styles.containerButton }>
                <ButtonField
                containerStyle={ styles.buttonMessage }
                textContent= {'Nhắn tin'}
                textStyle={styles.textButtonMessage}
                onPress= {()=> handleOpenMessage()}
                icon={{
                    name:'message-text-outline',
                    size:20,
                    color:colors.BLUE_DARK
                }}/>
                <ButtonField
                containerStyle={ styles.buttonMessage }
                textContent= {!Boolean(checkInvitaion) ? 'Kết bạn' : (checkInvitaion == guest.uid ? 'Trả lời' : 'Đã gửi')}
                textStyle={styles.textButtonMessage}
                onPress= {()=> handleSendInvitaion()}
                icon={{
                    name:'account-plus',
                    size:20,
                    color:colors.BLUE_DARK
                }}/>
            </View>
            <Text 
                style={ styles.textTitle }>
                Thông tin tài khoản </Text>
            <Text 
            style={ styles.textContent }>
            Số điện thoại: {guest?.phone ? guest.phone : '**********'} </Text>
            <Text 
            style={ styles.textContent }>
            Địa chỉ email: {guest?.email} </Text>
            <Text 
            style={ styles.textContent }>
            Ngày sinh :	 {guest?.birthDay ? guest.birthDay : '**********'} </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    containerHeader: {
        height: HEIGHT * 0.25,
        width: WIDTH,
        backgroundColor: colors.BLUE_DARK,
        justifyContent: 'center'
    },
    buttonBack:{
        height: HEIGHT*0.035,
        aspectRatio:1,
        position: 'absolute',
        left:WIDTH*0.05,
        top:HEIGHT*0.02,
        borderRadius:100
    },
    backgroundImage: {
        height: '100%',
        width: '100%'
    },
    containerBody: {
        height: HEIGHT * 0.75,
        width: WIDTH,
        borderTopColor: colors.GRAY_DARK,
        borderTopWidth:3
    },
    containerAvatar: {
        height: HEIGHT * 0.2,
        aspectRatio: 1,
        borderColor:colors.WHITE,
        borderWidth: 5,
        position: 'absolute',
        top:-HEIGHT*0.1,
        alignSelf: 'center'
    },
    textName: {
        fontSize: 25,
        color: colors.BLACK,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginTop: HEIGHT*0.11,
    },
    containerButton: {
        width: WIDTH,
        flexDirection:'row',
        height: HEIGHT * 0.05,
        marginTop: HEIGHT*0.05,
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    buttonMessage: {
        width: WIDTH * 0.4,
        height: HEIGHT * 0.05,
        backgroundColor: colors.BLUE_BLAND,
    },
    textButtonMessage:{
        marginLeft:WIDTH * -0.01,
        color:colors.BLUE_DARK
    } ,
    buttonAddFriend: {
        width: WIDTH * 0.15,
        height: HEIGHT * 0.05,
        marginTop: 0,
        backgroundColor: colors.WHITE,
        marginLeft: 0
    },
    textTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: HEIGHT * 0.06,
        marginHorizontal: WIDTH * 0.075,
        color: colors.BLACK,
    },
    textContent: {
        fontSize: 16,
        marginTop: HEIGHT * 0.025,
        marginHorizontal: WIDTH * 0.125,
        color: colors.BLACK,
    },
    
})