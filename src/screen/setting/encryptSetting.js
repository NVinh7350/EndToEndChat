import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import InputField from '../../components/InputField'
import ButtonField from '../../components/ButtonField'
import { WIDTH, HEIGHT, colors } from '../../utility'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useDispatch, useSelector } from 'react-redux'
import { privateKeySelector, settingStatusSelector } from '../../redux/selector'
import settingSlice, { setPrivateKey } from './settingSlice'
import SimpleToast from 'react-native-simple-toast'
import { getAsyncStorage } from '../../asyncStorage'
import Loader from '../../components/Loader'
const EncryptSetting = ({navigation}) => {
    const [showPW, setShowPW] = useState(true);
    const [key, setKey] = useState('');
    const [confirmKey, setConfirmKey] = useState('');
    const privateKey = useSelector(privateKeySelector);
    const settingStatus = useSelector(settingStatusSelector);
    const dispatch = useDispatch();

    const handleBack = async() => {
        const privateKeyStorage = await getAsyncStorage('privateKey');
        if(privateKeyStorage) {
            navigation.goBack();
        } else {
            Alert.alert('Cảnh báo!', 'Chưa cài đặt khoá mã hoá', [
                {
                    text:'Vẫn thoát',
                    onPress:()=> navigation.goBack()
                },
                { 
                    text:'Huỷ',
                }
            ])
        }
    }
    const handleSetKey = async() => {
        if(key === confirmKey && key.length >= 6) {
            Alert.alert('Cảnh báo!', 'Mỗi tin nhắn chỉ có thể giải mã bằng một khoá\n Bạn chắc chứ ? ', [
            {   
                text:'Có', 
                onPress: () => {dispatch(setPrivateKey(key))}
            },
            {
                text:'Không',
                onPress: () => {}
            }
            ])
        } else {
            Alert.alert('Lỗi!', 'Khoá và xác nhận khoá phải giống nhau')
        }
    }

    useEffect(()=>{
        if(settingStatus == 'success') {
            SimpleToast.show('Cài đặt thành công', 1000 )
            dispatch(settingSlice.actions.setStatus('idle'))
            Alert.alert('key',typeof privateKey)
        } else if (settingStatus == 'error') {
            SimpleToast.show('Cài đặt thất bại', 1000)
            dispatch(settingSlice.actions.setStatus('idle'))
        }
    },[settingStatus])

    return (
    <View style={styles.container}>
        <Loader status={settingStatus}/>
        <View style={styles.containerHeader}>
            <Icon
                style = {styles.buttonBack}
                    name='arrow-back-ios'
                    size={30}
                    color={colors.BLACK}
                    onPress= {()=> handleBack()}
            ></Icon>
            <Text style={[styles.textTitle, {width:WIDTH*0.8}]}></Text>
        </View>
        <View style={styles.containerBody}>
            <Text style={styles.textTitleSmall}>Khoá mã hoá </Text>
            <InputField 
            containerStyle={{marginVertical: HEIGHT * 0.02, marginTop: HEIGHT * 0.05}}
            leftIcon={{
                    name: 'key',
                }}
            placeholder={'Khoá'}
            value= {key}
            onChangeText= {(e) => setKey(e)}
            rightIcon={{
                    name: showPW ? 'eye-off' : 'eye'
            }}
            secureTextEntry = {showPW}
            onRightIconPress={() => setShowPW(!showPW)}
            />
            <InputField 
            textInputStyle={{marginLeft:-WIDTH *0.05}}
            containerStyle={{marginVertical: HEIGHT * 0.02,justifyContent:'space-around' }}
            leftIcon={{
                    name: 'key',
                }}
            placeholder={'Xác nhận khoá'}
            value= {confirmKey}
            onChangeText= {(e) => setConfirmKey(e)}
            secureTextEntry = {showPW}
            />
            <ButtonField
            containerStyle={{marginVertical: HEIGHT * 0.1}}
            textContent={'Đăng ký'}
            onPress={() => handleSetKey()}
            />
        </View>
    </View>
  )
}

export default EncryptSetting

const styles = StyleSheet.create({
    container:{
        flex:1,
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
    containerHeader:{
        height:HEIGHT * 0.07,
        borderBottomWidth:1,
        borderBottomColor:colors.GRAY_BLAND,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-evenly',
    },
    containerBody:{
        // justifyContent:'center',
        alignItems:'center',
        paddingTop:HEIGHT *0.1
    },
    text:{
        width: WIDTH * 0.9,
        textAlign:'right',
        marginVertical: HEIGHT * 0.02,
        fontSize:16,
        color:colors.BLACK,
        fontWeight:'bold'
    },
    textTitleSmall: {
		width: WIDTH * 0.9,
		marginBottom: HEIGHT * 0.02,
		textAlign:'left',
		fontSize: 25,
		fontWeight: 'bold',
		color: colors.BLACK,
  },
})