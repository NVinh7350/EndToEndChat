import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import auth from '@react-native-firebase/auth'
import { app } from "../../firebase/firebase-config";
import fireStore from "@react-native-firebase/firestore";
import { useDispatch } from "react-redux";
const loginSlice = createSlice({
    name:'login',
    initialState:{
        status: 'idle',
        loginData: {
            email:'',
            password:'',
        },
        uid: '',
    },
    reducers: {
        addLoginData:(state, action) => {
            state.loginData = action.payload;
        },
        setStatus: (state, action) => {
            state.status = action.payload;
        },
    },
    extraReducers:(buider) => {
        buider
        .addCase(onLogin.pending , (state, action) => {
            state.status = 'loading';
        })
        .addCase(onLogin.fulfilled, (state, action) => {
            state.uid = action.payload;
            state.status = 'success';
        })
        .addCase(onLogin.rejected, (state, action) => {
            state.status = 'error';
            state.uid = action.payload;
        })
        .addCase(onRegister.pending , (state, action) => {
            state.status = 'loading';
        })
        .addCase(onRegister.fulfilled, (state, action) => {
            state.loginData = action.payload;
            state.status = 'success';
        })
        .addCase(onRegister.rejected, (state, action) => {
            state.status = 'error';
            state.loginData = action.payload;
            
        })
    },
})
export default loginSlice;
export const onLogin = createAsyncThunk(
    'login/onLogin',
    async (loginData) => {
        const user = await auth(app).signInWithEmailAndPassword(loginData?.email, loginData?.password)
        return user.user.uid;
    }
    )
export const onRegister = createAsyncThunk(
    'login/onRegister',
    async (loginData) => {
        const newUser = await auth(app).createUserWithEmailAndPassword(loginData?.email, loginData?.password)
        .catch(er =>{
            console.log(er)
        })
        const addUser = await fireStore(app)
        .collection(`users`)
        .doc(newUser.user.uid)
        .set({
            uid: newUser.user.uid,
            userName: loginData?.userName,
            email: loginData?.email,
        })
        return loginData;
}
)