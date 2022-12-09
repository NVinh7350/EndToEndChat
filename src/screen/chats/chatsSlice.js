import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import auth from '@react-native-firebase/auth'
import { app } from "../../firebase/firebase-config";
import fireStore from "@react-native-firebase/firestore";
import { setAsyncStorage, clearAsyncStorage, getAsyncStorage } from "../../asyncStorage";

const initialState = {
    status: 'idle',
    chats : [],
    chatRoom: {},
    preloadMessage:{}
}

const chatsSlice = createSlice({
    name:'chats',
    initialState,
    reducers: {
        setStatus: (state, action) => {
            state.status = action.payload;
        },
        setChatRoom: (state, action) => {
            state.chatRoom = action.payload;
        },
        setPreLoadMessage: (state, action) => {
            state.preloadMessage = action.payload;
        },
        clearState : (state, action) => {
            return initialState;
        }
    },
    extraReducers:(buider) => {
        buider
        .addCase(getChats.rejected, (state, action) => {
            state.status = 'error';
            state.chats = action.payload;
        })
        .addCase(getChats.pending, (state, action) => {
            state.status = 'loading';
        })
        .addCase(getChats.fulfilled, (state, action) =>{
            state.status = 'success';
            state.chats = action.payload;
        })
    },
})
export default chatsSlice;
export const getChats = createAsyncThunk(
    'chats/getChats',
    async () => {
        const owner = JSON.parse(await getAsyncStorage('owner'));
        const result = await Promise.all(Object.keys(owner?.chats).map( async(element) => {
            const chatId = await fireStore(app).collection('chats').doc(element).get();
            const guestId = chatId.data()?.members.filter(e => e!= owner?.uid);
            const guest = await fireStore(app).collection('users').doc(guestId[0]).get();
            return {...chatId.data(), ['members']: {guest: guest.data(),owner: owner}};
        }))
        const resultSort = result.sort((a, b)=> {
            return b?.lastMessage?.messageTime - a?.lastMessage?.messageTime
        });
        await setAsyncStorage('chats', JSON.stringify(resultSort));
        return resultSort;
    }
)

export const getAllInvitations = createAsyncThunk('invitations/getAllInvitations', 
async() => {
    const owner = JSON.parse(await getAsyncStorage('owner'));
    const result = await Promise.all(Object.keys(owner?.invitations).map( async(element) =>{
        const invitationDB = await fireStore(app).collection('invitations').doc(element).get();
        const sentBy = await fireStore(app).collection('users').doc(invitationDB.data().sentBy).get();
        const receivedBy = await fireStore(app).collection('users').doc(invitationDB.data().receivedBy).get();
        return {...invitationDB.data(), ['sentBy']:sentBy.data(), ['receivedBy']: receivedBy.data()};
    }))
    const resultSort = result.sort((a, b) => {
        a.time - b.time
    })  
    return resultSort;
})
