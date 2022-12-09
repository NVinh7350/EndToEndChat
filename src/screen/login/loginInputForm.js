import { Alert, StyleSheet, Text, View, ActivityIndicator, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, HEIGHT, WIDTH } from '../../utility'
import InputField from '../../components/InputField'
import ButtonField from '../../components/ButtonField'
import { useDispatch, useSelector } from 'react-redux'
import loginSlice ,{ onLogin } from './loginInputSlice'
import auth from '@react-native-firebase/auth'
import fireStore from '@react-native-firebase/firestore'
import { app } from '../../firebase/firebase-config'
import { loginDataSelector,  ownerSelector, statusLoginSelector } from '../../redux/selector'
import Loader from '../../components/Loader'
import { clearAsyncStorage } from '../../asyncStorage'
const LoginInputForm = ({ navigation }) => {
    const [loginData, setLoginData] = useState({
        email:'vanvinhqn2310@ail.com',
        password:'123456'
    });
    const [showPW, setShowPW] = useState(true);
    const statusLogin = useSelector(statusLoginSelector);
    const newLoginData = useSelector(loginDataSelector);
    const dispath = useDispatch(); 
	
    const addLoginData = (key, value) => {
		setLoginData({...loginData, [key]: value})
    }

	const checkLoginData = (data) => {
		const validateEmail = (email) => 
		{
			let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
			return regex.test(email)
		}
      	const check = data?.email && data?.password && true;
      	if (!check)
		{
			Alert.alert('Lỗi!', 'Vui lòng điền đủ thông tin');
			return false;
		} else if (!validateEmail(data?.email)){
			Alert.alert('Lỗi!', 'Định dạng email không chính xác');
			return false;
		}
		else 
			return true;
    }
	
	const handleLogin = async() => {
		await clearAsyncStorage();
		if(checkLoginData(loginData)){
			dispath(onLogin(loginData))
		}
	}

    useEffect(() => {
		if(statusLogin == 'error') {
			Alert.alert('Lỗi!', 'Vui lòng kiểm tra lại tài khoản', [
				{text: 'OK', onPress: () => dispath(loginSlice.actions.setStatusLogin('idle')), style: 'OK'}
			])
			} 
		else if (statusLogin == 'success') {
		dispath(loginSlice.actions.setStatusLogin('idle'));
		navigation.navigate('EncryptSetting');
		}
    },[statusLogin, newLoginData])
    


    return (
    <View style={styles.container}>
		<Loader status={statusLogin}/>
		<Text style={styles.textTitleSmall}>Đăng nhập</Text>
		<InputField 
		containerStyle={{marginVertical: HEIGHT * 0.02}}
		leftIcon={{
				name: 'email',
			}}
		placeholder={'Email'}
		value= {loginData.email}
		onChangeText= {(e) => addLoginData('email',e)}
		/>
		<InputField 
		containerStyle={{marginVertical: HEIGHT * 0.02}}
		leftIcon={{
				name: 'key',
			}}
		placeholder={'Password'}
		value= {loginData.password}
		onChangeText= {(e) => addLoginData('password',e)}
		rightIcon={{
				name: showPW ? 'eye-off' : 'eye'
		}}
		secureTextEntry = {showPW}
		onRightIconPress={() => setShowPW(!showPW)}
		/>
		<Text style={styles.text}
		>Quên mật khẩu?</Text>
		<ButtonField
		containerStyle={{marginVertical: HEIGHT * 0.02}}
		textContent={'Đăng nhập'}
		onPress={() => handleLogin()}
		/>
		<Text style={[styles.text, {textAlign:'center'}]}
		onPress={()=> navigation.navigate('Register')}>
			Tạo tài khoản mới
		</Text>
    </View>
  )
}

export default LoginInputForm

const styles = StyleSheet.create({
    container:{
        height:HEIGHT * 0.7,
        width:WIDTH,
        alignItems:'center',
        justifyContent:'center',
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
		marginBottom: HEIGHT * 0.07,
		textAlign:'left',
		fontSize: 25,
		fontWeight: 'bold',
		color: colors.BLACK,
  },
})