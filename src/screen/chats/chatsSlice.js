import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import auth from '@react-native-firebase/auth'
import { app } from "../../firebase/firebase-config";
import fireStore from "@react-native-firebase/firestore";
import { setAsyncStorage, clearAsyncStorage, getAsyncStorage } from "../../asyncStorage";

const chatsSlice = createSlice({
    name:'chats',
    initialState:{
        status: 'idle',
        chats : []
    },
    reducers: {
        setStatus: (state, action) => {
            state.status = action.payload;
        },
    },
    extraReducers:(buider) => {
        buider
        .addCase(getChats.rejected, (state, action) => {
            state.status = 'error';
            // console.log('error');
            // console.log(action.payload);
            state.chats = action.payload;
        })
        .addCase(getChats.pending, (state, action) => {
            state.status = 'loading';
        })
        .addCase(getChats.fulfilled, (state, action) =>{
            state.status = 'success';
            // console.log('success');
            // console.log(action.payload);
            state.chats = action.payload;
        })
    },
})
export default chatsSlice;
export const getChats = createAsyncThunk(
    'chats/getChats',
    async () => {
        const owner = await getAsyncStorage('owner');
        const result = await Promise.all(Object.keys(JSON.parse(owner)?.chats).map( async(element) => {
            const chatId = await fireStore(app).collection('chats').doc(element).get();
            return chatId.data();
        }))
        const resultSort = result.sort((a, b)=> b?.lastMessage?.messageTime - a?.lastMessage?.timeMessage);
        await setAsyncStorage('chats', JSON.stringify(resultSort));
        return resultSort;
    }
)
