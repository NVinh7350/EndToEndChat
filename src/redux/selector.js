import { createSelector } from "@reduxjs/toolkit";

export const uidSelector = (state) => state.login.uid;
export const statusSelector = (state) => state.login.status;
export const loginDataSelector = (state) => state.login.loginData;