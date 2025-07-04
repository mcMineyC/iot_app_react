import { configureStore } from '@reduxjs/toolkit'
import integrationStatusReducer from './integrationStatusSlice'

export default configureStore({
  reducer: {
    integrationStatus: integrationStatusReducer
  }
})
