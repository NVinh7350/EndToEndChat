import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import InputField from '../../components/InputField'
import ButtonField from '../../components/ButtonField'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useDispatch, useSelector } from 'react-redux'
import { colors, WIDTH, HEIGHT } from '../../utility'
import Loader from '../../components/Loader'
import settingSlice, { changePassword } from './settingSlice'
import md5 from 'md5'
import SimpleToast from 'react-native-simple-toast'
import { passwordStatusSelector, settingStatusSelector } from '../../redux/selector'

const PasswordSetting = ({navigation}) => {
    const dispatch = useDispatch();
    const passwordStatus = useSelector(passwordStatusSelector)
    const [showPW, setShowPW] = useState(true);
    const [password, setPassword] = useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    })

    const handleChangePassword = () => {
        // dispatch(changePassword({oldPassword: '1234567',newPassword: '123456'}))
        if(!password.oldPassword || !password.newPassword || !password.confirmNewPassword){
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin!')
            return;
        }
        if(password.newPassword.length <6) {
            Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự')
        }
        if(password.newPassword != password.confirmNewPassword) {
            Alert.alert('Lỗi', 'Mật khẩu và mật khẩu xác nhận không giống nhau!')
            return;
        }
        dispatch(changePassword(password));
    }

    useEffect(()=>{
        if(passwordStatus == 'success') {
            SimpleToast.show('Cài đặt thành công', 1000 )
            dispatch(settingSlice.actions.setStatusPassword('idle'))
        } else if (passwordStatus == 'error') {
            SimpleToast.show('Cài đặt thất bại', 1000)
            dispatch(settingSlice.actions.setStatusPassword('idle'))
        }
    },[passwordStatus])

return (
    <View style={styles.container}>
        <Loader status={passwordStatus}/>
        <View style={styles.containerHeader}>
            <Icon
                style = {styles.buttonBack}
                    name='arrow-back-ios'
                    size={30}
                    color={colors.BLACK}
                    onPress= {()=> navigation.goBack()}
            ></Icon>
            <Text style={[styles.textTitle, {width:WIDTH*0.8}]}></Text>
        </View>
        <View style={styles.containerBody}>
            <Text style={styles.textTitleSmall}>Thay đổi mật khẩu </Text>
            <InputField 
            containerStyle={{marginVertical: HEIGHT * 0.02, marginTop: HEIGHT * 0.05}}
            leftIcon={{
                    name: 'key',
                }}
            placeholder={'Mật khẩu cũ'}
            value= {password.oldPassword}
            onChangeText= {(e) => setPassword({
                ...password,
                'oldPassword' : e
            })}
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
            placeholder={'Mật khẩu mới'}
            value= {password.newPassword}
            onChangeText= {(e) => setPassword({
                ...password,
                'newPassword' : e
            })}
            secureTextEntry = {showPW}
            />
            <InputField 
            textInputStyle={{marginLeft:-WIDTH *0.05}}
            containerStyle={{marginVertical: HEIGHT * 0.02,justifyContent:'space-around' }}
            leftIcon={{
                    name: 'key',
                }}
            placeholder={'Xác nhận mật khẩu'}
            value= {password.confirmNewPassword}
            onChangeText= {(e) => setPassword({
                ...password,
                'confirmNewPassword' : e
            })}
            secureTextEntry = {showPW}
            />
            <ButtonField
            containerStyle={{marginVertical: HEIGHT * 0.1}}
            textContent={'Xác nhận'}
            onPress={() => handleChangePassword()}
            />
        </View>
    </View>
)
}

export default PasswordSetting

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
        height:HEIGHT * 0.93,
        justifyContent:'center',
        alignItems:'center',
        paddingTop:HEIGHT *0.05
    },
    text:{
        width: WIDTH * 0.9,
        // textAlign:'right',
        marginVertical: HEIGHT * 0.02,
        fontSize:18,
        color:colors.BLACK,
        lineHeight:23
        // fontWeight:'bold'
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