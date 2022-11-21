import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Role } from '../../shared/models/loginform'
import type { RootState } from '../store'
import { Consult } from '../types'


// Define the initial state using that type
const initialState: Consult = {
  sidebarOpen: false,
  riskQuestionnaireCompleted: false,
} as Consult

export const consultSlice = createSlice({
  name: 'consult',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    setRiskQuestionnaireCompleted: (state, action: PayloadAction<boolean>) => {
      state.riskQuestionnaireCompleted = action.payload
    },

  },
})

export const { setSidebarOpen } = consultSlice.actions
export const { setRiskQuestionnaireCompleted } = consultSlice.actions

export const selectSidebarOpen = (state: RootState) => state.consult.sidebarOpen
export const selectRiskQuestionnaireCompleted = (state: RootState) => state.consult.riskQuestionnaireCompleted


export default consultSlice.reducer