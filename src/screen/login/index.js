import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import InputField from '../../components/InputField'
import LoginInputForm from './loginInputForm'
import LoginHeader from './loginHeader'

const Login = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <LoginHeader/>
      <LoginInputForm navigation= {navigation}/>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center'
    }
})