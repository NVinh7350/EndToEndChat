import { Alert, StyleSheet, Text, View, ActivityIndicator, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, HEIGHT, WIDTH } from '../../utility'
import InputField from '../../components/InputField'
import ButtonField from '../../components/ButtonField'
import { useDispatch, useSelector } from 'react-redux'
import { onLogin } from './loginInputSlice'
import auth from '@react-native-firebase/auth'
import fireStore from '@react-native-firebase/firestore'
import { app } from '../../firebase/firebase-config'
import { loginDataSelector, statusSelector, uidSelector } from '../../redux/selector'
import Loader from '../../components/Loader'
const LoginInputForm = ({ navigation }) => {
    const [loginData, setLoginData] = useState({
        email:'vanvinhqn2310@gmail.com',
        password:'12345'
    });
    const [showPW, setShowPW] = useState(true);
    const status = useSelector(statusSelector);
    const uid = useSelector(uidSelector);
    const newLoginData = useSelector(loginDataSelector);
    const dispath = useDispatch(); 
    const handleLogin = async() => {
      dispath(onLogin(loginData))
    }

    const addLoginData = (key, value) => {
      setLoginData({...loginData, [key]: value})
    }

    useEffect(() => {
      if (uid) {
        console.log(uid)
        navigation.navigate('BottomTab');
      }
      if(newLoginData) {
        setLoginData({...newLoginData});
      }
    },[uid, newLoginData])
    


    return (
    <View style={styles.container}>
      <Loader status={status}/>
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
      {/* <Text>{uid}</Text>
      <Text>{status}</Text> */}
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