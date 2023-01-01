import { Alert, StyleSheet, Text, View, ActivityIndicator, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, HEIGHT, WIDTH } from '../../utility'
import InputField from '../../components/InputField'
import ButtonField from '../../components/ButtonField'
import { useDispatch, useSelector } from 'react-redux'
import loginSlice, { onLogin, onRegister } from '../login/loginInputSlice'
import auth from '@react-native-firebase/auth'
import { app } from '../../firebase/firebase-config'
import {  loginDataSelector, statusRegisterSelector, uidSelector } from '../../redux/selector'
import Loader from '../../components/Loader'
const RegisterInputForm = ({ navigation }) => {
    const [registerData, setRegisterData] = useState({
        userName:'',
        email:'',
        password:'',
        comfirmPassword:''
    });
    const [showPW, setShowPW] = useState(true);
    const statusRegister = useSelector(statusRegisterSelector);
    const newUser = useSelector(loginDataSelector);
    const dispath = useDispatch(); 
    
    const addRegisterData = (key, value) => {
      setRegisterData({...registerData, [key]: value})
    }
    const checkRegisterData = (data) => {
		const validateEmail = (email) => 
		{
			let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
			return regex.test(email)
		}
      	const check = data?.userName && data?.email && data?.password && data?.comfirmPassword && true;
      	if (!check)
		{
			Alert.alert('Lỗi!', 'Vui lòng điền đủ thông tin');
			return false;
		} else if (!validateEmail(data?.email)){
			Alert.alert('Lỗi!', 'Định dạng email không chính xác');
			return false;
		} else if (data?.password !== data?.comfirmPassword) {
			Alert.alert('Lỗi!', 'Mật khẩu và nhập lại mật khẩu không khớp');
			return false;
		}
		else 
			return true;
    }

    const handleRegister = () => {
		if(checkRegisterData(registerData))
			{
				dispath(onRegister(registerData))
			}
    }

    

    useEffect(() =>{
      if (statusRegister == 'success') {
        dispath(loginSlice.actions.setStatusRegister('idle'));
		Alert.alert('Đăng ký thành công', 'Bạn có muốn quay về đăng nhập?',[
			{text:'Có', onPress: () => navigation.goBack()},
			{text:'Không', onPress: () => {}}
		])
      } else if (statusRegister != 'idle' && statusRegister != 'loading') {
		Alert.alert('Error!', statusRegister, [
			{text: 'OK', onPress: () => dispath(loginSlice.actions.setStatusRegister('idle')), style: 'OK'}
		  ])
	  }
    }, [statusRegister])

    return (
    <View style={styles.container}>
		<Loader status={statusRegister}/>
		<Text style={styles.textTitleSmall}>Đăng ký</Text>
		<InputField 
		containerStyle={{marginVertical: HEIGHT * 0.02}}
		leftIcon={{
				name: 'account',
			}}
		placeholder={'User name'}
		value= {registerData.userName}
		onChangeText= {(e) => addRegisterData('userName',e)}
		/>
		<InputField 
		containerStyle={{marginVertical: HEIGHT * 0.02}}
		leftIcon={{
				name: 'email',
			}}
		placeholder={'Email'}
		value= {registerData.email}
		onChangeText= {(e) => addRegisterData('email',e)}
		/>
		<InputField 
		containerStyle={{marginVertical: HEIGHT * 0.02}}
		leftIcon={{
				name: 'key',
			}}
		placeholder={'Password'}
		value= {registerData.password}
		onChangeText= {(e) => addRegisterData('password',e)}
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
		placeholder={'Confirm Password'}
		value= {registerData.comfirmPassword}
		onChangeText= {(e) => addRegisterData('comfirmPassword',e)}
		secureTextEntry = {showPW}
		/>
		<ButtonField
		containerStyle={{marginVertical: HEIGHT * 0.02}}
		textContent={'Đăng ký'}
		onPress={() => handleRegister()}
		/>
		<Text style={[styles.text, {textAlign:'center'}]}
		onPress={()=> navigation.navigate('Login')}>
			Đăng nhập tài khoản đã có
		</Text>
		{/* <Text>{uid}</Text>
		<Text>{status}</Text> */}
    </View>
  )
}

export default RegisterInputForm

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
		marginBottom: HEIGHT * 0.02,
		textAlign:'left',
		fontSize: 25,
		fontWeight: 'bold',
		color: colors.BLACK,
  },
})