import { createSlice } from '@reduxjs/toolkit'

export const stateSlice = createSlice({
  name: 'state',
  initialState: {
    value: {}
  },
  reducers: {
    // updateIntegration: (state, action) => {
    //   // Redux Toolkit allows us to write "mutating" logic in reducers. It
    //   // doesn't actually mutate the state because it uses the Immer library,
    //   // which detects changes to a "draft state" and produces a brand new
    //   // immutable state based off those changes
    //   state.value[action.payload.id] = {
    //     ...action.payload,
    //     hasError: action.payload.error !== 0,
    //     // Add a timestamp to the payload
    //     timestamp: new Date().toISOString()
    //   }
    // },
    updateState: (state, action) => {
      // Update multiple integrations at once
      const data = action.payload;
      for (const [key, value] of Object.entries(data)) {
        state.value[key] = {
          timestamp: new Date().toISOString() // Add a timestamp to each integration
        }
        for(const [path, data] of Object.entries(value)){
          console.log(key)
          state.value[key][path.substring(1)] = JSON.parse(data)
        }
      }
    }
  }
})

// Action creators are generated for each case reducer function
export const { updateState } = stateSlice.actions

export default stateSlice.reducer
