import { configureStore } from '@reduxjs/toolkit';
import chatsSlice from '../screen/chats/chatsSlice';
import invitationsSlice from '../screen/invitations/invitationsSlice';
import loginSlice from "../screen/login/loginInputSlice";
import searchSlice from '../screen/search/searchSlice';
import settingSlice from '../screen/setting/settingSlice';
const store = configureStore({
  reducer: {
    login: loginSlice.reducer,
    search: searchSlice.reducer,
    setting: settingSlice.reducer,
    chats: chatsSlice.reducer,
    invitations: invitationsSlice.reducer
  },
});

export default store;