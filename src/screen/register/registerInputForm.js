import { Alert, StyleSheet, Text, View, ActivityIndicator, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, HEIGHT, WIDTH } from '../../utility'
import InputField from '../../components/InputField'
import ButtonField from '../../components/ButtonField'
import { useDispatch, useSelector } from 'react-redux'
import loginSlice, { onLogin, onRegister } from '../login/loginInputSlice'
import auth from '@react-native-firebase/auth'
import { app } from '../../firebase/firebase-config'
import {  loginDataSelector, statusSelector, uidSelector } from '../../redux/selector'
import Loader from '../../components/Loader'
const RegisterInputForm = ({ navigation }) => {
    const [registerData, setRegisterData] = useState({
        userName:'Vinh2310',
        email:'vanvinhqn2310@gmail.com',
        password:'123456',
        comfirmPassword:'123456'
    });
    const [showPW, setShowPW] = useState(true);
    const status = useSelector(statusSelector);
    const newUser = useSelector(loginDataSelector);
    const dispath = useDispatch(); 
    
    const addRegisterData = (key, value) => {
      setRegisterData({...registerData, [key]: value})
    }
    const checkRegisterData = (data) => {
      const check = data?.userName && data?.email && data?.password && data?.comfirmPassword;
      console.log(check);
    }

    const handleRegister = () => {
      if(checkRegisterData(registerData))
          dispath(onRegister(registerData))
    }

    checkRegisterData(registerData);

    useEffect(() =>{
      if(status == 'error') {
        Alert.alert('Lỗi!', 'Tài khoản đã tồn tại', [
          {text: 'OK', onPress: () => dispath(loginSlice.actions.setStatus('idle')), style: 'OK'}
        ])
      } else if (status == 'success') {
        dispath(loginSlice.actions.setStatus('idle'));
        navigation.goBack();
      }
    }, [status])
    console.log(status)

    return (
    <View style={styles.container}>
      <Loader status={status}/>
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