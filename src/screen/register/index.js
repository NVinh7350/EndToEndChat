import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import InputField from '../../components/InputField'
import LoginHeader from '../login/loginHeader'
import RegisterInputForm from './registerInputForm'
const Register = ({navigation}) => {
  return (
    <View style={styles.container}>
        <LoginHeader/>
        <RegisterInputForm navigation={navigation}/>
    </View>
  )
}

export default Register

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center'
    }
})