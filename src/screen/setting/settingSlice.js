import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import auth from '@react-native-firebase/auth'
import { app } from "../../firebase/firebase-config";
import fireStore from "@react-native-firebase/firestore";
import { setAsyncStorage, clearAsyncStorage, getAsyncStorage } from "../../asyncStorage";

const settingSlice = createSlice({
    name:'setting',
    initialState:{
        status: 'idle',
        privateKey: '',
        accountPassword: '',
    },
    reducers: {
        setStatus: (state, action) => {
            state.status = action.payload;
        },
        setPrivateKey: (state, action) => {
            state.privateKey == action.payload;
        }
    },
    extraReducers:(buider) => {
        buider
        .addCase(setPrivateKey.pending , (state, action) => {
            state.status = 'loading';
        })
        .addCase(setPrivateKey.fulfilled, (state, action) => {
            state.privateKey = action.payload;
            console.log('ss')
            state.status = 'success';
        })
        .addCase(setPrivateKey.rejected, (state, action) => {
            state.status = 'error';
            console.log('err')
        })
    },
})
export default settingSlice;
export const setPrivateKey = createAsyncThunk(
    'setting/setPrivateKey',
    async (key) => {
        await setAsyncStorage('privateKey', key);
        return key;
    }
)
