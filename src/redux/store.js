import { configureStore } from '@reduxjs/toolkit';
import loginSlice from "../screen/login/loginInputSlice";

const store = configureStore({
  reducer: {
    // filters: filtersSlice.reducer,
    // todoList: todosSlice.reducer,
    login: loginSlice.reducer
  },
});

export default store;