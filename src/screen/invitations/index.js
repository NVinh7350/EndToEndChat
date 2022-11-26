import { Alert, FlatList, Modal, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React, {useEffect, useState} from 'react'
import ChatItem from '../../components/ChatItem'
import InputField from '../../components/InputField';
import { colors, HEIGHT, WIDTH } from '../../utility';
import CircleImage from '../../components/CircleImage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { allInvitationsSelector, encryptKeySelector, encryptPasswordSelector, ownerSelector, receivedInvitationsSelector } from '../../redux/selector';
import { getAsyncStorage } from '../../asyncStorage';
import fireStore from '@react-native-firebase/firestore'
import {app} from '../../firebase/firebase-config'
import { setEncryptKey, setEncryptPassword } from '../setting/settingSlice';
import PopUp from '../../components/PopUp';
import InvitationItem from '../../components/InvitationItem';
import { setGuest } from '../search/searchSlice';
let navigations;

const HeaderComponent = ({navigation}) =>{
  const owner = useSelector(ownerSelector);

  return (
      <View style={ styles.contianerHeader }>
          <View style={styles.containerTitle}>
              <CircleImage
                  containerStyle={styles.imageFrameSmall}
                  source={owner?.profileImg ? {uri: owner?.profileImg} : require('../../utility/image/profileImg.png')}
                  onPress= {()=>{navigation.navigate('Setting')}}
              ></CircleImage>
              <Text style={ styles.title}>   Kết bạn</Text>
          </View>
          <TouchableWithoutFeedback
          onPress={()=> navigation.navigate('Seach')}
          >
              <View style={styles.search}>
                  <Icon
                  name='search'
                  size={20}
                  ></Icon>
                  <Text style={{fontSize:16, width:WIDTH*0.7}}>Tìm kiếm</Text>
              </View>
          </TouchableWithoutFeedback>
      </View>
  )
}
const Invitation = ({invitation}) => {
    const dispatch = useDispatch();
    const handleAccept = () => {

    }
    const handleRefuse = () => {

    } 
    const handleOpenProfile = () => {
        dispatch(setGuest(invitation?.sentBy));
        navigations.navigate('Profile');
    }
    return (
        <InvitationItem userName={invitation?.sentBy?.userName}
        profileImg={{uri: invitation?.sentBy?.profileImg}}
        onPressAccept={handleAccept}
        onPressRefuse={handleRefuse}
        onPressProfile={handleOpenProfile}
        />
    ) 
}
const Invitations = ({navigation}) => {
    navigations = navigation;
    const allInvitations = useSelector(allInvitationsSelector);
    const receivedInvitations = useSelector(receivedInvitationsSelector);
    console.log(receivedInvitations)
  return (
    <View>
        <HeaderComponent navigation={navigation}/>
        <FlatList
        data={receivedInvitations}
        renderItem={({item}) => <Invitation invitation={item}/>}
        ></FlatList>
    </View>
  )
}

export default Invitations
const styles = StyleSheet.create({
  container: {
      flex:1,
      
  },
  contianerHeader: {
      height: HEIGHT * 0.2,
      width: WIDTH,
      backgroundColor:colors.BLUE_DARK,
      justifyContent:'space-evenly',
      alignItems:'center'
  },
  containerTitle: {
      height: HEIGHT * 0.08,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      // borderWidth:1,
      paddingHorizontal:WIDTH*0.045
  },
  title: {
      fontSize: 32,
      color: 'white',
      fontWeight: 'bold'
  },
  imageFrameSmall: {
      height: HEIGHT * 0.06,
      aspectRatio: 1,
      borderRadius: 100,
  },
  imageCircle: {
      height: '100%',
      aspectRatio: 1,
      borderRadius: 100
  },
  search:{
      height: HEIGHT * 0.06,
      width: WIDTH * 0.9,
      borderRadius: 30,
      elevation:4,
      flexDirection:'row',
      backgroundColor:colors.WHITE,
      justifyContent:'space-evenly',
      alignItems:'center'
  },})