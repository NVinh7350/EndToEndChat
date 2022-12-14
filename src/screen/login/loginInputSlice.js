import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import auth from '@react-native-firebase/auth'
import { app } from "../../firebase/firebase-config";
import fireStore from "@react-native-firebase/firestore";
import { setAsyncStorage, clearAsyncStorage, getAsyncStorage } from "../../asyncStorage";

const initialState = {
    statusLogin: 'idle',
    statusRegister: 'idle',
    statusUpdateOwner: 'idle',
    status: 'idle',
    loginData: {
        email:'',
        password:'',
    },
    owner:{}
}

const loginSlice = createSlice({
    name:'login',
    initialState,
    reducers: {
        addLoginData:(state, action) => {
            state.loginData = action.payload;
        },
        setStatusLogin: (state, action) => {
            state.statusLogin = action.payload;
        },
        setStatusRegister: (state, action) => {
            state.statusRegister = action.payload
        },
        setStatus : (state, action) => {
            state.status = action.payload
        },
        clearState: (state, action) => {
            return initialState
        },
        setStatusUpdateOwner:(state, action) => {
            state.statusUpdateOwner = action.payload;
        },
    },
    extraReducers:(buider) => {
        buider
        .addCase(onLogin.pending , (state, action) => {
            state.statusLogin = 'loading';
        })
        .addCase(onLogin.fulfilled, (state, action) => {
            state.owner = action.payload;
            state.statusLogin = 'success';
        })
        .addCase(onLogin.rejected, (state, action) => {
            state.statusLogin = action.error.message;
            state.owner = action.payload;
        })
        .addCase(onRegister.pending , (state, action) => {
            state.statusRegister = 'loading';
        })
        .addCase(onRegister.fulfilled, (state, action) => {
            state.loginData = action.payload;
            state.statusRegister = 'success';
        })
        .addCase(onRegister.rejected, (state, action) => {
            state.statusRegister = action.error.message;
            state.loginData = action.payload;
        })
        .addCase(onLogOut.pending , (state, action) => {
            state.statusLogin = 'loading';
        })
        .addCase(onLogOut.fulfilled, (state, action) => {
            state.loginData = {};
            state.owner = {};
            state.statusLogin = 'success';
        })
        .addCase(onLogOut.rejected, (state, action) => {
            state.statusLogin = 'error';
        })
        .addCase(setOwner.pending , (state, action) => {
            state.status = 'loading';
        })
        .addCase(setOwner.fulfilled, (state, action) => {
            state.owner = action.payload;
            state.status = 'success';
        })
        .addCase(setOwner.rejected, (state, action) => {
            state.status = 'error';
            state.owner = action.payload;
        })
        .addCase(updateOwnerData.pending , (state, action) => {
            state.statusUpdateOwner = 'loading';
        })
        .addCase(updateOwnerData.fulfilled, (state, action) => {
            state.owner = action.payload;
            state.statusUpdateOwner = 'success';
            console.log('update success')
        })
        .addCase(updateOwnerData.rejected, (state, action) => {
            state.statusUpdateOwner = 'error';
            state.owner = action.payload;
        })
    },
})
export default loginSlice;

export const setOwner = createAsyncThunk(
    'login/setOwner',
    async(newOwner) => {
        await setAsyncStorage('owner', JSON.stringify(newOwner));
        return newOwner;
    }
)

export const onLogin = createAsyncThunk(
    'login/onLogin',
    async (loginData) => {
        const user = await auth(app).signInWithEmailAndPassword(loginData?.email, loginData?.password)
        const getOwner = await fireStore(app).collection('users').doc(user.user.uid).get();
        await setAsyncStorage('owner', JSON.stringify(getOwner.data()));
        return getOwner.data();
    }
    )

export const updateOwnerData = createAsyncThunk(
    'login/updateOwnerData',
    async (ownerData) => {
        console.log(ownerData)
        const addUser = await fireStore(app)
        .collection(`users`)
        .doc(ownerData.uid)
        .update({
            userName: ownerData?.userName,
            email: ownerData?.email,
            phone: ownerData?.phone,
            birthDay : ownerData?.birthDay,
            profileImg: ownerData?.profileImg
        })
        const getOwner = await fireStore(app).collection('users').doc(ownerData.uid).get();
        await setAsyncStorage('owner', JSON.stringify(getOwner.data()));
        return getOwner.data();
})

export const onRegister = createAsyncThunk(
    'login/onRegister',
    async (loginData) => {
        const newUser = await auth(app).createUserWithEmailAndPassword(loginData?.email, loginData?.password)
        const addUser = await fireStore(app)
        .collection(`users`)
        .doc(newUser.user.uid)
        .set({
            uid: newUser.user.uid,
            userName: loginData?.userName,
            email: loginData?.email,
            profileImg:'',
            phone:'',
            birthDay : ''
        })
  
        return loginData;
})
export const onLogOut = createAsyncThunk(
    'login/onLogOut',
    async () => {
        await clearAsyncStorage();
    }  
)