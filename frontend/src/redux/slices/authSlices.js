import { createSlice , createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Retrieve user info and token from local storage if available 
const userFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo")) :
  null;

// check for an existing guest ID in local storage, if not generate a new one
const initialGuestId =
  localStorage.getItem("guestId") || `gust_${Date.now()}`;
localStorage.setItem("guestId", initialGuestId); // Store the guest ID in local storage

// Initial state for authentication slice 
const initialState = {
  user: userFromStorage,
  guestId: initialGuestId,
  loading: false,
  error: null
}

//Async thunk for user login 
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        userData
      );
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      localStorage.setItem("userToken", response.data.token);

      return response.data.user;
    } catch (err) {
      return rejectWithValue(err.response.data.message || "Login failed");
    };
  });


//Async thunk for user Registration
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
        userData
      );
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      localStorage.setItem("userToken", response.data.token);

      return response.data.user;
    } catch (err) {
      return rejectWithValue(err.response.data.message || "Login failed");
    };
  })


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.guestId = `guest_${Date.now()}`; //Reset guest ID on logout
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");
      localStorage.setItem("guestId", state.guestId); // Store new guest ID in local storage
    },
    generatenewGuestId: (state) => {
      state.guestId = `guest_${new Date().getTime()}`; // Generate a new guest ID
      localStorage.setItem("guestId", state.guestId); // Store new guest ID in local storage
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { logout, generatenewGuestId } = authSlice.actions;
export default authSlice.reducer;



