import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { app } from "../../firebase/firebase-config";
import fireStore from "@react-native-firebase/firestore";
import { getAsyncStorage, setAsyncStorage } from "../../asyncStorage";

const initialState = {
    getAllUserStatus: 'idle',
    allUser: [],
    searchData: '',
    guest:{},
}
const searchSlice = createSlice({
    name:'search',
    initialState,
    reducers:{
        searchDataChage: (state,action) =>{
            state.searchData = action.payload;
        },
        setStatus: (state,action) => {
            state.getAllUserStatus = action.payload;
        },
        // setGuest: (state, action) => {
        //     state.guest = action.payload;
        // }
        clearState : (state, action) => {
            return initialState
        }
    },
    extraReducers:(buider) => {
        buider
        .addCase(getAllUser.fulfilled , (state, action) =>{
            state.getAllUserStatus = 'success';
            state.allUser = action.payload; 
        })
        .addCase(getAllUser.pending, (state, action) =>{
            state.getAllUserStatus = 'loading'
        })
        .addCase(getAllUser.rejected, (state, action) =>{
            state.getAllUserStatus = 'error';
            state.allUser = action;
        })
        .addCase(setGuest.pending, (state, action) =>{
            state.getAllUserStatus = 'loading'
        })
        .addCase(setGuest.fulfilled, (state, action) =>{
            state.getAllUserStatus = 'success';
            state.guest = action.payload;
            // console.log('acction');
            // console.log(action.payload);
            console.log('set Guest success')
        })
        .addCase(setGuest.rejected, (state, action) =>{
            state.getAllUserStatus = 'error';
            state.guest = action.payload;
            // console.log('acction');
            // console.log(action.payload);
            console.log('set Guest error')
        })
        .addCase(findGuest.pending, (state, action) =>{
            state.getAllUserStatus = 'loading'
        })
        .addCase(findGuest.fulfilled, (state, action) =>{
            state.getAllUserStatus = 'success';
            state.guest = action.payload;
            // console.log('acction');
            // console.log(action.payload);
            console.log('find Guest success')
        })
        .addCase(findGuest.rejected, (state, action) =>{
            state.getAllUserStatus = 'error';
            state.guest = action.payload;
            // console.log('acction');
            // console.log(action.payload);
            console.log('find Guest error')
        })
    }
})

export default searchSlice;

export const getAllUser = createAsyncThunk('search/getAllUser', 
async() => {
    let result = [];
    const users = await fireStore(app).collection('users').get()
    users.forEach(doc => {
        result.push(doc.data())
    })
    return result
})

export const setGuest = createAsyncThunk('search/setGuest',
async(guest) => {
    await setAsyncStorage('guest', JSON.stringify(guest));
    return guest;
})

export const findGuest = createAsyncThunk('search/findGuest',
async(guestId) => {
    const guest = await fireStore(app).collection('users').doc(guestId).get();
    await setAsyncStorage('guest', JSON.stringify(guest.data()));
    return guest.data();
}
)