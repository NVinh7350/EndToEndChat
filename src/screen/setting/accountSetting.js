import { StyleSheet, Text, View , Image, KeyboardAvoidingView} from 'react-native'
import React,{ useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, HEIGHT, WIDTH } from '../../utility'
import { useDispatch, useSelector } from 'react-redux';
import { ownerSelector, selectedImageSelector, statusUpdateOwnerSelector } from '../../redux/selector';
import CircleImage from '../../components/CircleImage';
import InputField from '../../components/InputField';
import ButtonField from '../../components/ButtonField';
import loginSlice, { setOwner, updateOwnerData } from '../login/loginInputSlice';
import Loader from '../../components/Loader';
import { useEffect } from 'react';
import SimpleToast from 'react-native-simple-toast';
import ImageGallery from '../../components/ImageGallery';
import {Image as im} from 'react-native-compressor'
let navigations;

const ChooseImage = ({openImageGallary, setOpenImageGallary,addOwnerData}) => {
  const selectedImage = useSelector(selectedImageSelector)
  const onPressOk = async() => {
    if(selectedImage?.uri) {
      const imageCompressor = await im.compress(selectedImage.uri, {
        compressionMethod: 'auto',
        returnableOutputType:'base64'
        });
        addOwnerData('profileImg', `data:image/png;base64,${imageCompressor}`)
        setOpenImageGallary(false)
    }
  }
  return <View  style={{height:HEIGHT, width:WIDTH, borderWidth:1}}>
    <View style={{height: HEIGHT * 0.1, borderWidth:1, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
    <Icon
        style = {styles.buttonBack}
            name='arrow-back-ios'
            size={30}
            color={colors.BLACK}
            onPress= {()=> setOpenImageGallary(false)}
    ></Icon>
    <ButtonField
    containerStyle={{width: WIDTH * 0.15, height: HEIGHT*0.06, marginLeft:WIDTH * 0.75}}
    textContent={'OK'}
    onPress={onPressOk}
    ></ButtonField>
    </View>
    <ImageGallery/>
  </View>
} 

const AccountSetting = ({navigation}) => {
  navigations = navigation
  const owner = useSelector(ownerSelector)
  const dispatch = useDispatch()
  const statusUpdateOwner = useSelector(statusUpdateOwnerSelector);
  const [openImageGallary, setOpenImageGallary] = useState(false); 
  const [ownerData, setOwnerData] = useState({
    uid : owner?.uid,
    userName: owner?.userName,
    email: owner?.email,
    phone: owner?.phone,
    birthDay : owner?.birthDay,
    profileImg : owner?.profileImg
  })
  const addOwnerData = (key, value) => {
    setOwnerData({...ownerData, [key]: value})
  }
  const handleUpdateOwner = () => {
    dispatch(updateOwnerData(ownerData))
  }
  const addAvatar = () => {
    setOpenImageGallary(!openImageGallary);
  }
  useEffect(() => {
    if(statusUpdateOwner == 'success') {
      SimpleToast.show('Cập nhật thành công', 1000 )
      dispatch(loginSlice.actions.setStatusUpdateOwner('idle'))
  } else if (statusUpdateOwner == 'error') {
      SimpleToast.show('Cập nhật thất bại', 1000)
      dispatch(loginSlice.actions.setStatusUpdateOwner('idle'))
  }
  })
  return (
        openImageGallary ? 
        <ChooseImage openImageGallary= {openImageGallary} setOpenImageGallary={setOpenImageGallary} addOwnerData={addOwnerData} /> 
        : 
        <KeyboardAvoidingView 
    behavior={'height'}
    keyboardVerticalOffset={HEIGHT * 0.6}
    style={{flex:1}}>
              <Loader status={statusUpdateOwner}/>
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
        <View style={styles.containerAvatar}>
                <CircleImage
                containerStyle={styles.avatar}
                source={ownerData?.profileImg ? {uri: ownerData?.profileImg} : require('../../utility/image/profileImg.png')}
                ></CircleImage>
                <View style={styles.iconCamera}>
                    <Icon
                    name='camera-alt'
                    size={25}
                    onPress={()=>{addAvatar()}}
                    ></Icon>
                </View>
            </View>
        <InputField 
          containerStyle={{marginVertical: HEIGHT * 0.02}}
          leftIcon={{
              name: 'account',
            }}
          placeholder={'User name'}
          value= {ownerData.userName}
          onChangeText= {(e) => addOwnerData('userName',e)}
          />
          <InputField 
          containerStyle={{marginVertical: HEIGHT * 0.02}}
          leftIcon={{
              name: 'email',
            }}
          placeholder={'Email'}
          value= {ownerData.email}
          editable = {false}
          />
          <InputField 
          containerStyle={{marginVertical: HEIGHT * 0.02}}
          leftIcon={{
              name: 'phone',
            }}
          placeholder={'Phone'}
          value= {ownerData?.phone}
          onChangeText= {(e) => addOwnerData('phone',e)}
          />
          <InputField 
          containerStyle={{marginVertical: HEIGHT * 0.02}}
          leftIcon={{
              name: 'calendar-today',
            }}
          placeholder={'Birth day'}
          value= {ownerData?.birthDay}
          onChangeText= {(e) => addOwnerData('birthDay',e)}
          />
          
          
          <ButtonField
          containerStyle={{marginVertical: HEIGHT * 0.02}}
          textContent={'Cập nhật'}
          onPress={() => handleUpdateOwner()}
          />
        </View>
      </KeyboardAvoidingView>
)
}
export default AccountSetting
const styles = StyleSheet.create({
containerHeader: {
    // height: HEIGHT * 0.25,
    // width: WIDTH,
    flex:2,
    backgroundColor: colors.BLUE_DARK,
    justifyContent: 'center'
},
buttonBack:{
    height: HEIGHT*0.04,
    aspectRatio:1,
    position: 'absolute',
    left:WIDTH*0.05,
    top:HEIGHT*0.02,
    borderRadius:100,
},
backgroundImage: {
    height: '100%',
    width: '100%'
},
containerBody: {
    // height: HEIGHT * 0.75,
    // width: WIDTH,
    flex:5,
    borderTopColor: colors.GRAY_DARK,
    borderTopWidth:3,
    paddingTop: HEIGHT * 0.15,
    alignItems:'center'
},
containerAvatar: {
    height: HEIGHT * 0.2,
    aspectRatio: 1,
    borderColor:colors.WHITE,
    borderWidth: 5,
    position: 'absolute',
    top:-HEIGHT*0.1,
    alignSelf: 'center',
    borderRadius:100,
    justifyContent:'center',
    alignItems:'center'
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
settingAvatar:{
  height:HEIGHT * 0.3,
  justifyContent:'space-evenly',
  alignItems:'center',
  borderWidth:1
},
avatar:{
  height:HEIGHT *0.2,
  borderWidth:6,
  borderRadius:100,
  borderColor:colors.WHITE
},
iconCamera:{
  height:HEIGHT *0.065,
  aspectRatio:1,
  position:'absolute',
  borderWidth:HEIGHT * 0.005,
  borderColor:colors.WHITE,
  backgroundColor:colors.GRAY_DARK,
  borderRadius:100,
  left:WIDTH * 0.22,
  top:HEIGHT *0.13,
  justifyContent:'center',
  alignItems:'center'
},
})