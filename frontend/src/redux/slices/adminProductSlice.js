import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("userToken")}`,
});


export const fetchAdminProducts = createAsyncThunk("adminProducts/fetchAdminProducts", async () => {

  const response = await axios.get(`${API_URL}/api/admin/products`,
    {
      headers: getAuthHeaders(),
    });
  return response.data;
});


export const createProduct = createAsyncThunk("adminProducts/createProduct", async (productData) => {
  const response = await axios.post(`${API_URL}/api/admin/products`, productData,
    {
      headers: getAuthHeaders(),
    });
  return response.data;
});


export const updateProduct = createAsyncThunk("adminProducts/updateProduct",
  async ({ id, productData }) => {
    const response = await axios.put(`${API_URL}/api/admin/products/${id}`, productData,
      {
        headers: getAuthHeaders(),
      });
    return response.data;
  }
)


export const deleteProduct = createAsyncThunk("adminProducts/deleteProduct", async (id) => {
  await axios.delete(`${API_URL}/api/admin/products/${id}`,
    {
      headers: getAuthHeaders(),
    });
  return id;
})


const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // create products 
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      // update Products 
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((product) => product._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((product) => product._id !== action.payload)
      })
  }
})

export default adminProductSlice.reducer; 
