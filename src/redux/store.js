import { configureStore } from '@reduxjs/toolkit';
import chatRoomSlice from '../screen/chatRoom/chatRoomSlice';
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
    invitations: invitationsSlice.reducer,
    chatRoom : chatRoomSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
  })
});
export default store;