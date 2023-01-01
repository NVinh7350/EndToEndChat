import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import auth from '@react-native-firebase/auth'
import { app } from "../../firebase/firebase-config";
import fireStore from "@react-native-firebase/firestore";
import { setAsyncStorage, clearAsyncStorage, getAsyncStorage } from "../../asyncStorage";

const initialState = {
    status: 'idle',
    privateKey: '',
    accountPassword: '',
    statusPassword : 'idle'
}

const settingSlice = createSlice({
    name:'setting',
    initialState,
    reducers: {
        setStatus: (state, action) => {
            state.status = action.payload;
        },
        setPrivateKey: (state, action) => {
            state.privateKey == action.payload;
        },
        clearState: (state, action) => {
            return initialState
        },
        setStatusPassword : (state, action) => {
            state.statusPassword == action.payload;
        }
    },
    extraReducers:(buider) => {
        buider
        .addCase(setPrivateKey.pending , (state, action) => {
            state.status = 'loading';
        })
        .addCase(setPrivateKey.fulfilled, (state, action) => {
            state.privateKey = action.payload;
            state.status = 'success';
        })
        .addCase(setPrivateKey.rejected, (state, action) => {
            state.status = 'error';
            console.log('error', action.error);
        })
        .addCase(changePassword.rejected, (state, action) => {
            state.statusPassword = 'error';
        })
        .addCase(changePassword.fulfilled, (state, action) => {
            state.statusPassword = 'success';
        })
        .addCase(changePassword.pending, (state, action) => {
            state.statusPassword = 'loading';
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

export const changePassword = createAsyncThunk(
    'setting/changePassword' ,
    async (password) => {
        console.log(password.oldPassword)
        const owner =JSON.parse(await getAsyncStorage('owner'))
        const checkOwner = (await auth(app).signInWithEmailAndPassword(auth(app).currentUser.email, password.oldPassword)).user.uid
        if (owner.uid == checkOwner) {
            await auth(app).currentUser.updatePassword(password.newPassword)
        }
    }
)
