import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import auth from '@react-native-firebase/auth'
import { app } from "../../firebase/firebase-config";
import fireStore from "@react-native-firebase/firestore";
import { setAsyncStorage, clearAsyncStorage, getAsyncStorage } from "../../asyncStorage";
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { PermissionsAndroid } from "react-native";
import { Image } from "react-native-compressor";
import { caculatorEncryptkey , caculatorPublicKey} from "../../encryption/DiffieHellman";
import { AES_Decrypt, AES_Encrypt } from "../../encryption/AES";

const initialState = {
    status: 'idle',
    allImages: [],
    selectedImages : [],
    textMessage : '',
    allMessages: [],
    statusSend : 'idle',
    selectedImage : {}
}

const chatRoomSlice = createSlice({
    name:'chatRoom',
    initialState,
    reducers: {
        setSelectedImages : (state, action ) => {
            const image = action.payload;
            if(state.selectedImages.some(e => e.uri === image?.uri)){
                state.selectedImages = state.selectedImages.filter(e => e.uri !== image?.uri);
            } else {
                state.selectedImages = [...state.selectedImages, {
                    uri: image.uri,
                    height: image.height,
                    width: image.width
                }]
            }
        },
        setSelectedImage : (state, action) => {
            state.selectedImage = action.payload;
        },
        setTextMessage : (state, action) => {
            state.textMessage = action.payload;
        },
        setAllMessages : (state, action) => {
            console.log('setAllMessages');
            state.allMessages = action.payload;
        },
        setStatusSend : (state, action) => {
            state.statusSend = action.payload;
        },
        clearState: (state, action) => {
            return initialState
        } 
    },
    extraReducers : (builder) => {
        builder.addCase(getAllImages.pending, (state, action) => {
            state.status = 'loading';
        })
        builder.addCase(getAllImages.fulfilled , (state, action) => {
            state.status = 'success';
            state.allImages = action.payload;
        })
        builder.addCase(getAllImages.rejected , (state, action) => {
            state.status = 'error';
            state.allImages = action.payload;
        })
        builder.addCase(sendMessage.pending, (state, action) => {
            state.statusSend = 'loading';
        })
        builder.addCase(sendMessage.fulfilled , (state, action) => {
            state.statusSend = 'success';
            state.textMessage = '';
            state.selectedImages =[];
        })
        builder.addCase(sendMessage.rejected , (state, action) => {
            state.statusSend = 'error';
            state.textMessage = '';
            console.log('error sendMessage',action.error)
            state.selectedImages =[];
        })
        builder.addCase(getAllMessages.pending, (state, action) => {
            state.status = 'loading';
        })
        builder.addCase(getAllMessages.fulfilled , (state, action) => {
            state.status = 'success';
            console.log('success getMessage')
            state.allMessages = action.payload;
        })
        builder.addCase(getAllMessages.rejected , (state, action) => {
            state.status = 'error';
            console.log('error getMessage',action.error.message)
        })
        builder.addCase(getNewMessage.fulfilled, (state, action) => {
            state.status = 'success';
            state.allMessages.unshift(action.payload);
        })
        builder.addCase(getNewMessage.pending, (state, action) => {
            state.status = 'loading';
        })
        builder.addCase(getNewMessage.rejected, (state, action) => {
            state.status = 'error';
            console.log('new Message ',action.error.message)
        })
        
    }
})

export default chatRoomSlice;
export const getAllImages = createAsyncThunk('chatRoom/getAllImages',
async() => {
        async function hasAndroidPermission() {
            const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
            const hasPermission = await PermissionsAndroid.check(permission);
            if (hasPermission) {
                return true;
            }
            const status = await PermissionsAndroid.request(permission);
                return status === 'granted';
        }
      
        if (Platform.OS === "android" && !(await hasAndroidPermission())) {
          return;
        }
        const allImages = await CameraRoll.getPhotos({
            first: 2000,
            assetType: 'Photos',
            include: ['imageSize']
          })
        
        return allImages.edges;
}
)
export const sendMessage = createAsyncThunk('chatRoom/sendMessage', 
async(dataToSend) => {
    const chatRoom = dataToSend.chatRoom;
    const textMessage = dataToSend.textMessage;
    const selectedImages = dataToSend.selectedImages;
    const owner = dataToSend.owner;
    const guest = dataToSend.guest;
    const timeSend = Date.now();
    const publicKey = chatRoom.publicKey[guest.uid];
    const privateKey = dataToSend.privateKey;
    const ownerPublicKey = (caculatorPublicKey(privateKey)).toString();
    const encryptKey = (caculatorEncryptkey(privateKey,publicKey)).toString();
    const encryptMessage = selectedImages.length == 0 ? (AES_Encrypt(encryptKey, textMessage))._j : 'Hình ảnh mã hoá';
    const imageEncryptList = await Promise.all(selectedImages.map(async e => {
        const imageCompressor = await Image.compress(e.uri, {
            compressionMethod: 'auto',
            returnableOutputType:'base64'
            });
        const imageEncrypt = (AES_Encrypt(encryptKey,`data:image/jpg;base64,${imageCompressor}`))
        return {
            imageBase64 : imageEncrypt._j,
            height : e.height,
            width : e.width,
        }
    }))
    const messageId = fireStore(app).collection('messages').doc().id;
    try {
        await fireStore(app).collection('messages').doc(chatRoom.chatId).update({
            [`${messageId}`] : {
                publicKey : {
                    ...chatRoom.publicKey,
                    [`${owner?.uid}`] : ownerPublicKey
                },
                messageContent: encryptMessage,
                messageTime : timeSend,
                sentBy : owner?.uid,
                receivedBy: guest?.uid,
                imagesList: [...imageEncryptList]
            }
        })
    } catch (error) {
        await fireStore(app).collection('messages').doc(chatRoom.chatId).set({
            [`${messageId}`] : {
                publicKey : {
                    ...chatRoom.publicKey,
                    [`${owner?.uid}`] : ownerPublicKey
                },
                messageContent: encryptMessage,
                messageTime : timeSend,
                sentBy : owner?.uid,
                receivedBy: guest?.uid,
                imagesList: [...imageEncryptList]
            }
        })
    }
    await fireStore(app).collection('chats').doc(chatRoom.chatId).update({
        lastMessage : {
            messageContent: encryptMessage,
            messageTime: timeSend,
            sentBy : owner?.uid,
            receivedBy: guest?.uid,
        },
    })
    await fireStore(app).collection('users').doc(guest?.uid).update({
        [`chats.${chatRoom.chatId}`] : timeSend
    })
    await fireStore(app).collection('users').doc(owner?.uid).update({
        [`chats.${chatRoom.chatId}`] : timeSend
    })
    return [];
})
export const getAllMessages =  createAsyncThunk('chatRoom/getAllMessages', 
async(allMessage) => {
    const owner = JSON.parse(await getAsyncStorage('owner'));
    const guest = JSON.parse(await getAsyncStorage('guest'));
    const privateKey = await getAsyncStorage('privateKey');
    const ownerPublicKey = (caculatorPublicKey(privateKey)).toString();
    if(!allMessage) {
        return []
    }
    const result = allMessage?.map(e => {
        if( ownerPublicKey != e.publicKey[owner.uid]){
            return {
                ...e,
                messageContent: 'Khoá hiện tại không thể mã hoá tin nhắn này',
                decrypt : false,
                imagesList: []
            }
        }else {
            const publicKey = e.publicKey[guest.uid];
            const encryptKey = (caculatorEncryptkey(privateKey,publicKey)).toString();
            const messageDecrypt = e?.imagesList?.length == 0 ?  AES_Decrypt(encryptKey, e.messageContent)._j.message: 'Hình ảnh mã hoá';
            let   imageDecryptList = e?.imagesList?.map(image => {
                return {
                    uri: AES_Decrypt(encryptKey, image.imageBase64)._j.message,
                    height: image.height,
                    width: image.width
                };
            });
            return {
                ...e,
                messageContent: messageDecrypt,
                decrypt : true,
                imagesList: imageDecryptList
            }
        }
    })
    const resultSort = result?.sort((a,b) => b.messageTime - a.messageTime);
    return resultSort;
})

export const getNewMessage =  createAsyncThunk('chatRoom/getNewMessage', 
async(newMessage) => {
    const owner = JSON.parse(await getAsyncStorage('owner'));
    const guest = JSON.parse(await getAsyncStorage('guest'));
    const privateKey = await getAsyncStorage('privateKey');
    const ownerPublicKey = (caculatorPublicKey(privateKey)).toString();
    if(!newMessage){
        return {}
    }  
        if( ownerPublicKey != newMessage.publicKey[owner.uid]){
            return {
                ...newMessage,
                messageContent: 'Khoá hiện tại không thể mã hoá tin nhắn này',
                decrypt : false,
                imagesList: []
            }
        }else {
            const publicKey = newMessage.publicKey[guest.uid];
            const encryptKey = (caculatorEncryptkey(privateKey,publicKey)).toString();
            const messageDecrypt = newMessage?.imagesList?.length == 0 ?  AES_Decrypt(encryptKey, newMessage.messageContent)._j.message: 'Hình ảnh mã hoá';
            let   imageDecryptList = newMessage?.imagesList?.map(image => {
                return {
                    uri: AES_Decrypt(encryptKey, image.imageBase64)._j.message,
                    height: image.height,
                    width: image.width
                };
            });
            return {
                ...newMessage,
                messageContent: messageDecrypt,
                decrypt : true,
                imagesList: imageDecryptList
            }
        }
})