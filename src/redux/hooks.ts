import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

// type definition of hooks so they can be used throughout the whole app without specifying type everytime
export const useSetReduxState = () => useDispatch<AppDispatch>()
export const useReduxState: TypedUseSelectorHook<RootState> = useSelector