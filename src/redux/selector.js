import { createSelector } from "@reduxjs/toolkit";

export const ownerSelector = (state) => state.login.owner;
export const statusSelector = (state) => state.login.status;
export const statusRegisterSelector = (state) => state.login.statusRegister;
export const statusLoginSelector = (state) => state.login.statusLogin;
export const loginDataSelector = (state) => state.login.loginData;
export const statusUpdateOwnerSelector = (state) => state.login.statusUpdateOwner;

export const searchDataSelector = (state) => state.search.searchData;
export const getAllUserStatusSelector = (state) => state.search.getAllUserStatus;
export const allUserSelector = (state) => state.search.allUser;
export const guestSelector = (state) => state.search.guest;
export const searchedUserListSelector = createSelector(
    searchDataSelector,
    allUserSelector,
    ownerSelector,
    (searchData, allUser, owner) => {
        if(searchData) {
            const regex = new RegExp(searchData, 'g');
            return allUser.filter(e => {
                return (e?.email.match(regex) || e?.userName.match(regex)) && e?.uid != owner?.uid
            });  
        } else
            return [];
    }
);

export const privateKeySelector = (state) => state.setting.privateKey;
export const settingStatusSelector = (state) => state.setting.status;
export const passwordStatusSelector = (state) => state.setting.statusPassword;
export const chatsSelector = (state) => state.chats.chats;
export const chatRoomSelector = (state) => state.chats.chatRoom;
export const checkFriendSelector = createSelector(
    chatsSelector, guestSelector,
    (chats, guest) => {
        if(!chats) {
            return false;
        }
        var result = 'false'
        chats.forEach(e => {
            if( result == true) {
                return result
            }
            if(e?.members?.guest?.uid == guest?.uid) {
                result = true
            }
        });
        console.log('result',result)
        return result;
    }
)
export const statusInvitationSelector = (state) => state.invitations.status;
export const allInvitationsSelector = (state) => state.invitations.allInvitations;
export const checkInvitationSelector = createSelector(
    allInvitationsSelector, guestSelector,
    (invitations, guest) => {
        var result = false;
        if(!invitations) {
            return false;
        }
        invitations.forEach(e => {
            if( e?.receivedBy?.uid == guest?.uid || e?.sentBy?.uid == guest?.uid){
                result = e?.sentBy?.uid;
            }
        })
        return result;
    }
)
export const receivedInvitationsSelector = createSelector(
    allInvitationsSelector, ownerSelector,
    (invitations, owner) => {
        if(invitations) {
            const result = invitations.filter(e => {
                return e?.receivedBy?.uid == owner?.uid && e?.status == 'sent'
            })
            return result;
        } else {
            return []
        }
    }
)

export const allImagesSelector = (state) => state.chatRoom.allImages;
export const selectedImagesSelector = (state) => state.chatRoom.selectedImages;
export const selectedImageSelector = (state) => state.chatRoom.selectedImage;
export const textMessageSelector = (state) => state.chatRoom.textMessage;
// export const allMessagesSelector = (state) => state.chatRoom.allMessages;
export const allMessagesSelector = createSelector(
    (state) => state.chatRoom.allMessages, ownerSelector,
    (allMessages, owner) => {
        if(allMessages) {
            return allMessages.map(e => {
                return {
                    ...e,
                    sentByOwner: e.sentBy == owner.uid
                }
            })
        } else {
            return []
        }
    }
)
export const statusSendSelector = (state) => state.chatRoom.statusSend;
