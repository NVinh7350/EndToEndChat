import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { app } from "../../firebase/firebase-config";
import fireStore from "@react-native-firebase/firestore";
import { getAsyncStorage } from "../../asyncStorage";

const invitationsSlice = createSlice({
    name:'invitations',
    initialState: {
        status:'idle',
        allInvitations: [],
        invitation: {}
    },
    reducers:{
        setStatus: (state,action) => {
            state.status = action.payload;
        },
        setInvitation: (state, action) => {
            state.guest = action.payload;
        }
    },
    extraReducers:(buider) => {
        buider
        .addCase(sendInvitation.fulfilled , (state, action) =>{
            state.status = 'success';
            state.invitation = action.payload; 
            console.log('send ss');
            console.log(action.payload);
        })
        .addCase(sendInvitation.pending, (state, action) =>{
            state.status = 'loading'
        })
        .addCase(sendInvitation.rejected, (state, action) =>{
            state.status = 'error';
            state.invitation = action.payload;
            console.log('send Error')
        })
        .addCase(getAllInvitations.fulfilled , (state, action) =>{
            state.status = 'success';
            state.allInvitations = action.payload; 
            console.log('getAllInvitations success');
            try{
                console.log(action.payload.length)
            } catch(err){
                console.log(err)
            }
        })
        .addCase(getAllInvitations.pending, (state, action) =>{
            state.status = 'loading'
        })
        .addCase(getAllInvitations.rejected, (state, action) =>{
            state.status = 'error';
            state.allInvitations = action.payload;
            console.log('send Error');
            console.log(action.error.message)
        })
    }
})

export default invitationsSlice;


export const getAllInvitations = createAsyncThunk('invitations/getAllInvitations', 
async() => {
    const owner = JSON.parse(await getAsyncStorage('owner'));
    console.log((owner?.invitations))
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

export const sendInvitation = createAsyncThunk('invitations/sendInvitation',
async() => {
    const owner = JSON.parse(await getAsyncStorage('owner'));
    const guest = JSON.parse(await getAsyncStorage('guest'));
    // const timeSend = fireStore.FieldValue.serverTimestamp();
    const timeSend = Date.now();
    const privateKey = await getAsyncStorage('privateKey');
    const publicKey = privateKey;// Tính khoá công khai tại đây 
    const invitationData = {
        sentBy: owner.uid,
        receivedBy : guest.uid,
        publicKey: {
          'UO6wqwixH6vEzePZ0TVZ' :  publicKey
        },
        status: 'sent',
        time: timeSend
      }
    const invitation = await fireStore(app).collection('invitations').add(invitationData)
    await fireStore(app).collection('users').doc(owner.uid).update({
      [`invitations.${invitation.id}`] : timeSend
    })
    await fireStore(app).collection('users').doc(guest.uid).update({
      [`invitations.${invitation.id}`] : timeSend
    })
    return invitationData;
})

export const acceptInvitation = createAsyncThunk('invitations/acceptInvitation', 
async() => {
    
}
)
