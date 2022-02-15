import { createSlice } from '@reduxjs/toolkit';
import Cookie from 'js-cookie';

const initialState = {
  user: {
    is_authenticated: Cookie.get('access_key') ? true : false,
    userInfo: Cookie.get('userInfo') ? Cookie.get('userInfo') : {},
    HasChannel: Cookie.get('HasChannel') ? true : false,
  }
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    UpdateAuthStatus: (state, action) => {
      state.user.is_authenticated = action.payload.Access
      state.user.userInfo = action.payload.userInfo
      state.user.HasChannel = action.payload.HasChannel
    }
  },
})

// Action creators are generated for each case reducer function
export const { UpdateAuthStatus } = authSlice.actions

export default authSlice.reducer