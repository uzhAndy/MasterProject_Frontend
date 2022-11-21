import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ClientState } from '../types';

const initialState: ClientState = {
    firstname: undefined,
    lastname: undefined,
    clientId: undefined,
    q1: undefined,
    q2: undefined
} as ClientState

export const clientSlice = createSlice({
    name: 'clientSetter',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setBasicData: (state, action: PayloadAction<{firstname: number, lastname: string}>) => {
            state.firstname = action.payload
        },
        setRiskForm: (state, action: PayloadAction<{q1:string, q2:string }>) => {
            state.lastname = action.payload
        },
        setClientId: (state, action: PayloadAction<string|undefined>) => {
            state.clientId = action.payload
        },
    }
})

export const { setBasicData, setRiskForm, setClientId } = clientSlice.actions

export default clientSlice.reducer