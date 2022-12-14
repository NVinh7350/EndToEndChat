import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { app } from "../../firebase/firebase-config";
import fireStore from "@react-native-firebase/firestore";
import { getAsyncStorage } from "../../asyncStorage";
import { caculatorPublicKey } from "../../encryption/DiffieHellman";

const initialState = {
    status:'idle',
    allInvitations: [],
    invitation: {}
}

const invitationsSlice = createSlice({
    name:'invitations',
    initialState,
    reducers:{
        setStatus: (state,action) => {
            state.status = action.payload;
        },
        setInvitation: (state, action) => {
            state.invitation = action.payload;
        },
        clearState: (state, action) => {
            return initialState
        }
    },
    extraReducers:(buider) => {
        buider
        .addCase(sendInvitation.fulfilled , (state, action) =>{
            state.status = 'success';
            console.log('send invitation', action.payload);
            state.invitation = action.payload; 
        })
        .addCase(sendInvitation.pending, (state, action) =>{
            state.status = 'loading'
        })
        .addCase(sendInvitation.rejected, (state, action) =>{
            state.status = 'error';
            state.invitation = action.payload;
        })
        .addCase(getAllInvitations.fulfilled , (state, action) =>{
            // state.status = 'success';
            state.allInvitations = action.payload; 
        })
        .addCase(getAllInvitations.pending, (state, action) =>{
            // state.status = 'loading'
        })
        .addCase(getAllInvitations.rejected, (state, action) =>{
            // state.status = 'error';
            console.log('error', action.error.message)
            state.allInvitations = action.payload;
        })
        .addCase(acceptInvitation.pending, (state, action) =>{
            state.status = 'loading';
        })
        .addCase(acceptInvitation.fulfilled, (state, action) =>{
            state.status = 'success';
        })
        .addCase(acceptInvitation.rejected, (state, action) =>{
            state.status = 'error';
        })
        .addCase(refuseInvitation.pending, (state, action) =>{
            state.status = 'loading';
        })
        .addCase(refuseInvitation.fulfilled, (state, action) =>{
            state.status = 'success';
        })
        .addCase(refuseInvitation.rejected, (state, action) =>{
            state.status = 'error';
        })

    }
})

export default invitationsSlice;


export const getAllInvitations = createAsyncThunk('invitations/getAllInvitations', 
async() => {
    const owner = JSON.parse(await getAsyncStorage('owner'));
    const result = await Promise.all(Object.keys(owner?.invitations).map( async(element) =>{
        const invitationDB = await fireStore(app).collection('invitations').doc(element).get();
        const sentBy = await fireStore(app).collection('users').doc(invitationDB.data()?.sentBy).get();
        const receivedBy = await fireStore(app).collection('users').doc(invitationDB.data()?.receivedBy).get();
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
    const invitationId = fireStore(app).collection('invitation').doc().id;
    const timeSend = Date.now();
    const privateKey = await getAsyncStorage('privateKey');
    const publicKey = (caculatorPublicKey(privateKey)).toString();// T??nh kho?? c??ng khai t???i ????y 
    const invitationData = {
        sentBy: owner.uid,
        receivedBy : guest.uid,
        publicKey: {
          [owner?.uid] :  publicKey
        },
        status: 'sent',
        time: timeSend,
        invitationId: invitationId
      }
    const invitation = await fireStore(app).collection('invitations').doc(invitationId).set(invitationData)
    await fireStore(app).collection('users').doc(owner.uid).update({
      [`invitations.${invitationId}`] : timeSend
    })
    await fireStore(app).collection('users').doc(guest.uid).update({
      [`invitations.${invitationId}`] : timeSend
    })
    return invitationData;
})

export const refuseInvitation = createAsyncThunk('invitations/refuseInvitation',
async(invitation) => {
    const owner = JSON.parse(await getAsyncStorage('owner'));
    const guest = JSON.parse(await getAsyncStorage('guest'));
    const invitationId = invitation?.invitationId;
    await fireStore(app).collection('invitations').doc(invitationId).delete()
    await fireStore(app).collection('users').doc(owner.uid).update({
      [`invitations.${invitationId}`] : fireStore.FieldValue.delete()
    })
    await fireStore(app).collection('users').doc(guest.uid).update({
      [`invitations.${invitationId}`] : fireStore.FieldValue.delete()
    })
    return invitation;
})

export const acceptInvitation = createAsyncThunk('invitations/acceptInvitation', 
async(invitation) => {
    const messageId = fireStore(app).collection('m').doc().id;
    const chatId = fireStore(app).collection('chats').doc().id;
    const guestId = invitation?.sentBy?.uid;
    const ownerId = invitation?.receivedBy?.uid;
    const invitationId = invitation?.invitationId;
    const privateKey = await getAsyncStorage('privateKey');
    const publicKey = (caculatorPublicKey(privateKey)).toString();// T??nh kho?? c??ng khai t???i ????y 
    const timeAccept = Date.now();
    await fireStore(app).collection('invitations').doc(invitationId).update({
        [`publicKey.${ownerId}`] : publicKey,
        status :'accepted',
        time : timeAccept
    })
    await fireStore(app).collection('users').doc(ownerId).update({
    // recivedInvitations : fireStore.FieldValue.arrayUnion(invitation.id)
    [`invitations.${invitationId}`] : timeAccept
    })  
    await fireStore(app).collection('users').doc(guestId).update({
    // sentInvitations : fireStore.FieldValue.arrayUnion(invitation.id)
    [`invitations.${invitationId}`] : timeAccept
    })
    const getPublicKey = await fireStore(app).collection('invitations').doc(invitationId).get();
    
    const chatRoom = await fireStore(app).collection('chats').doc(chatId).set({
    publicKey : getPublicKey.data().publicKey,
    lastMessage : {
        messageContent: 'Room has been created',
        messageTime: timeAccept,
        receivedBy: guestId,
        sentBy: ownerId
    },
    chatId,
    members: [ownerId, guestId]
    });
    await fireStore(app).collection('users').doc(ownerId).update({
        [`chats.${chatId}`] : timeAccept
    })
    await fireStore(app).collection('users').doc(guestId).update({
        [`chats.${chatId}`] : timeAccept
    })
    return getPublicKey.data().publicKey;
}
)
