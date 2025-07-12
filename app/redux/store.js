import { configureStore } from '@reduxjs/toolkit'
import integrationStatusReducer from './integrationStatusSlice'
import stateReducer from './stateSlice'

export default configureStore({
  reducer: {
    integrationStatus: integrationStatusReducer,
    state: stateReducer
  }
})
