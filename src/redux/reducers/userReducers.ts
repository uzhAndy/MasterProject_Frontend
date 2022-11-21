import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Role } from '../../shared/models/loginform'
import type { RootState } from '../store'
import { UserState } from '../types'


// Define the initial state using that type
const initialState: UserState = {
  uuid: undefined,
  username: undefined,
  role: undefined,
} as UserState

export const userSlice = createSlice({
  name: 'count',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{uuid: number, username: string, role: Role}>) => {
      state.username = action.payload.username
      state.uuid = action.payload.uuid
      state.role = action.payload.role
    },
    setUUID: (state, action: PayloadAction<number>) => {
      state.uuid = action.payload
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload
    },
    setRole: (state, action: PayloadAction<Role>) => {
      state.role = action.payload
    },
    removeData: (state) => {
      state.username = NaN
      state.uuid = NaN
      state.role = Role.GUEST
    },
  },
})



export const { setUser, setUUID, setUsername, setRole, removeData } = userSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectUUID = (state: RootState) => state.users.uuid
export const selectUsername = (state: RootState) => state.users.username
export const selectRole = (state: RootState) => state.users.role

export default userSlice.reducer