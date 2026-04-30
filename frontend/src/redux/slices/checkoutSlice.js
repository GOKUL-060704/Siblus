import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { logout } from "./authSlices";


// Async thunk to create the checkout session 
export const createCheckout = createAsyncThunk(
  "checkout/createCheckout",
  async (checkoutdata,{rejectWithValue, dispatch}) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/checkout`, checkoutdata,
      {
        headers : {
          Authorization : `Bearer ${localStorage.getItem("userToken")}`,
        }
      }
      );
      return response.data;
    } catch (error) {
        const errorData = error.response?.data || { message: error.message || "Checkout failed" };
        if (error.response?.status === 401 || errorData.error === "jwt expired") {
          dispatch(logout());
        }
        return rejectWithValue(errorData);
    }
});


const checkoutSlice = createSlice({
    name : "checkout",
    initialState : {
      checkout  :null,
      loading : false,
      error : null
    },
    reducers : {},
    extraReducers : (builder) => {
        builder 
        .addCase(createCheckout.pending,(state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(createCheckout.fulfilled,(state,action) => {
          state.loading = false;
          state.checkout = action.payload;
        })
        .addCase(createCheckout.rejected,(state,action) => {
          state.loading = false;
          state.error = action.payload?.message || "Checkout failed";
        })  
    }
});


export default checkoutSlice.reducer;


