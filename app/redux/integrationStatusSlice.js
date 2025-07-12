import { createSlice } from '@reduxjs/toolkit'

export const integrationStatusSlice = createSlice({
  name: 'integrationStatus',
  initialState: {
    value: {}
  },
  reducers: {
    updateIntegration: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value[action.payload.id] = {
        ...action.payload,
        hasError: action.payload.error !== 0,
        // Add a timestamp to the payload
        timestamp: new Date().toISOString()
      }
    },
    updateIntegrations: (state, action) => {
      // Update multiple integrations at once
      const data = action.payload;
      for (const [key, value] of Object.entries(data)) {
        state.value[key] = {
          ...value,
          hasError: value.error !== 0,
          timestamp: new Date().toISOString() // Add a timestamp to each integration
        }
      }
    }
  }
})

// Action creators are generated for each case reducer function
export const { updateIntegration, updateIntegrations } = integrationStatusSlice.actions

export default integrationStatusSlice.reducer
