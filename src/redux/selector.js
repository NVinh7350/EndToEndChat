import { createSelector } from "@reduxjs/toolkit";

export const ownerSelector = (state) => state.login.owner;
export const statusSelector = (state) => state.login.status;
export const statusRegisterSelector = (state) => state.login.statusRegister;
export const statusLoginSelector = (state) => state.login.statusLogin;
export const loginDataSelector = (state) => state.login.loginData;

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

export const chatsSelector = (state) => state.chats.chats;
export const checkFriendSelector = createSelector(
    chatsSelector, guestSelector,
    (chats, guest) => {
        var result = false;
        if(!chats) {
            return false;
        }
        chats.forEach(e => {
            if(result == false) {
                e?.members.forEach(u => {
                    if ( u === guest?.uid )
                        {
                            result = true;
                            return;
                        }
                })
            }
        });
        return result;
    }
)

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
                console.log(e?.receivedBy?.uid)
                return e?.receivedBy?.uid == owner?.uid && e?.status == 'sent'
            })
            console.log(result);
            return result;
        } else {
            return []
        }
    }
)