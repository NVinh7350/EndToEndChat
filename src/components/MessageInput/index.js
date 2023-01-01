import { useEffect, useState , useRef} from "react";
import { StyleSheet , Dimensions, TextInput, View, Alert, Keyboard, Modal, Text, Animated, BackHandler, FlatList, ActivityIndicator, PermissionsAndroid} from "react-native";
import { colors, WIDTH, HEIGHT } from "../../utility";
import ButtonField from "../ButtonField";
import FieldInput from "../InputField";
import BottomSheet from '../BottomSheet';
import ImageGallery from "../ImageGallery";
import Icon from "react-native-vector-icons/Ionicons"
import IconF from "react-native-vector-icons/FontAwesome"
import { useDispatch, useSelector } from "react-redux";
import { chatRoomSelector, guestSelector, ownerSelector, privateKeySelector, selectedImagesSelector, statusSendSelector, textMessageSelector } from "../../redux/selector";
import chatRoomSlice, { sendMessage } from "../../screen/chatRoom/chatRoomSlice";
import { launchCamera } from "react-native-image-picker";
import { useCameraRoll, CameraRoll } from "@react-native-camera-roll/camera-roll";
const fs = require('react-native-fs')
const BUTTON_SIZE = WIDTH*0.08;
const TEXT_INPUT_OPEN = WIDTH * 0.75;
const TEXT_INPUT_CLOSE = WIDTH * 0.6;
const BOTTOM_SHEET_MAX_HEIGHT = HEIGHT * 0.6;
const BOTTOM_SHEET_MIN_HEIGHT = HEIGHT * 0.1;
const MAX_UPWARD_TRANSLATE_Y =
  BOTTOM_SHEET_MIN_HEIGHT - BOTTOM_SHEET_MAX_HEIGHT; // negative number;
const MAX_DOWNWARD_TRANSLATE_Y = 0;
const DRAG_THRESHOLD = 50;
let KEYBOARD_SHOW = false;
const MessageInput = ({
    motionFlatList,
}) => {
    const dispatch = useDispatch();
    const chatRoom = useSelector(chatRoomSelector);
    const textMessage = useSelector(textMessageSelector);
    const selectedImages = useSelector(selectedImagesSelector);
    const statusSend = useSelector(statusSendSelector);
    const owner = useSelector(ownerSelector);
    const guest = useSelector(guestSelector);
    const privateKey = useSelector(privateKeySelector);
    const [photos, getPhotos, save] = useCameraRoll();


    const handleSend = async() => {
        const dataToSend = {
            chatRoom : chatRoom,
            textMessage : textMessage,
            selectedImages: selectedImages,
            owner: owner,
            guest: guest,
            privateKey: privateKey
        }
        dispatch(sendMessage(dataToSend));
        dispatch(chatRoomSlice.actions.setTextMessage(''))
    }

    const motionTextInput = useRef(new Animated.Value(TEXT_INPUT_CLOSE)).current;
    const motionButton = useRef(new Animated.Value(0)).current;
    const motionBottomSheet = useRef(new Animated.Value(0)).current;
    const animation = (motion, value, duration) => {
        Animated.timing(
            motion,
            {
                toValue:value,
                duration: duration,
                useNativeDriver:false
                
            }
        ).start();
    }

    const [visible, setVisible] = useState(true);
    const [imagePicker, setImagePicker ] = useState(false);
    useEffect(()=>{
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            KEYBOARD_SHOW = true;
            animation(motionFlatList, HEIGHT *0.45,0);
            setImagePicker(false);
            
        })
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            KEYBOARD_SHOW = false;
            animation(motionButton, 0, 300);
            animation(motionTextInput, TEXT_INPUT_CLOSE, 300)
            setVisible(true);
            
            if(!imagePicker){
                animation(motionFlatList, HEIGHT *0.8,0);
            }
        })

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        }
    }, [imagePicker])
    useEffect(()=>{
        if(statusSend == 'success') {
            dispatch(chatRoomSlice.actions.setStatusSend('idle'))
        } else if (statusSend == 'error') {
            dispatch(chatRoomSlice.actions.setStatusSend('idle'))
        }
    }, [statusSend])

    const handleHiden = () => {
        animation(motionButton, 0,300);
        animation(motionTextInput, TEXT_INPUT_CLOSE, 300)
        setVisible(true);
    }

    const handleInput = () => {
        animation(motionButton, -BUTTON_SIZE * 1.25, 300);
        animation(motionTextInput, TEXT_INPUT_OPEN, 300);
        animation(motionBottomSheet, 0 , 10);
        setVisible(false);
    } 
    
    const handlePressImage = () => {
        setImagePicker(pre => {
            if(pre == false) {
                if(KEYBOARD_SHOW) {
                    Keyboard.dismiss();
                }
                animation(motionFlatList, HEIGHT *0.45, 10);
                animation(motionBottomSheet, HEIGHT *0.45, 10);
            } else {
                animation(motionFlatList, HEIGHT *0.8, 10);
                animation(motionBottomSheet, 0 , 10);
            }

            return !pre;
        })
    }

    async function hasAndroidPermission() {
        const permission = PermissionsAndroid.PERMISSIONS.CAMERA;
      
        const hasPermission = await PermissionsAndroid.check(permission);
        if (hasPermission) {
          return true;
        }
      
        const status = await PermissionsAndroid.request(permission);
        return status === 'granted';
    }

    const handlePressCamera = async() => {
        if (Platform.OS === "android" && !(await hasAndroidPermission())) {
            return;
        }
        const result = await launchCamera({
            saveToPhotos: true,
            mediaType: 'photo'
        });
    }

    return (
        <View style={styles.container}>
            <View style={styles.containerInput}>
                <Animated.View
                style={{flexDirection:'row',marginLeft: motionButton}}
                >
                    <Icon
                    style ={styles.button}
                    name="image"
                    size={27}
                    color={colors.BLUE_DARK}
                    onPress= {() => handlePressImage()}
                    />
                    {
                        visible ? 
                        <Icon 
                        name="camera"
                        onPress={() => handlePressCamera()}
                        style= {styles.button}
                        size={27}
                        color={colors.BLUE_DARK}
                        />:
                        <Icon 
                        name="md-chevron-forward-circle"
                        onPress={() => handleHiden()}
                        style= {styles.button}
                        size={27}
                        color={colors.BLUE_DARK}
                        />
                    }
                </Animated.View>
                <Animated.View 
                style={{width:motionTextInput}}
                >
                    <TextInput
                    onPressIn={()=>{handleInput()}}
                    onKeyPress={()=>{handleInput()}}
                    placeholder="Nhập tin nhắn..."
                    placeholderTextColor={colors.GRAY_DARK}
                    style={[styles.textInput,]}
                    multiline={!visible ? true : false}
                    value={textMessage}
                    onChangeText={(e) => dispatch(chatRoomSlice.actions.setTextMessage(e))}
                    ></TextInput>
                </Animated.View>
                {
                    statusSend == 'loading' ?
                    <ActivityIndicator
                    style= {styles.button}
                    size={30}
                    color={colors.BLUE_DARK}
                    ></ActivityIndicator> 
                    :
                    <Icon
                    name="send"
                    onPress={()=> handleSend()}
                    style= {styles.button}
                    size={27}
                    color={colors.BLUE_DARK}
                    />
                }
            </View>
            <Animated.View style={{height:motionBottomSheet, width:'100%', backgroundColor:'white'}}>
                <BottomSheet 
                visible={imagePicker}
                handlePressImage = {handlePressImage}
                bottomSheetMinHeight= {HEIGHT *0.45}
                bottomSheetMaxHeight={HEIGHT}
                props = {
                    <ImageGallery multipleSelect={true}/>
                }
                />
            </Animated.View>
        </View>
    )
}


export default MessageInput
const styles = StyleSheet.create({
    container:{
        flexDirection:'column',
        backgroundColor:colors.WHITE,
        // elevation:15,
    },
    containerInput:{
        flexDirection:'row',
        paddingVertical:HEIGHT*0.02,
        maxHeight:HEIGHT *0.3,
        alignItems:'flex-end',
        justifyContent:'space-evenly',
    },
    containerImagePicker:{
        width:WIDTH,
    },
    textInput: {
        paddingVertical:HEIGHT*0.008,
        paddingHorizontal:WIDTH*0.05,
        backgroundColor:colors.GRAY_CLOUD,
        borderRadius:30,
        fontSize:16,
    },
    button:{
        // marginTop:0,
        marginHorizontal:5,
        backgroundColor:colors.WHITE,
        // width: BUTTON_SIZE,
        paddingVertical:HEIGHT*0.004,
        // borderWidth:1
    },
})