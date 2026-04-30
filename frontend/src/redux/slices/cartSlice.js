import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"; 
import { logout } from "./authSlices";


const localCartFromStorage = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : { products : [] }; 
};

// Helper function to save cart to localStorage 
const saveCartToStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const isAuthError = (error) => {
  const errorData = error.response?.data;
  return error.response?.status === 401 ||
    errorData?.error === "jwt expired" ||
    errorData?.message?.toLowerCase().includes("not authorized");
};

const getErrorPayload = (error, fallbackMessage) => {
  return error.response?.data || { message: error.message || fallbackMessage };
};

// Fetch cart for a user or guest 
export const fetchCart = createAsyncThunk("/cart/fetchCart",async ({userId , guestId},
    { rejectWithValue, dispatch}) => {
      try{
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cart`,
          {
            params : { userId, guestId }
          }
      );
      return response.data;
      }catch(error){
        console.error("Error fetching cart:", error);
        if (isAuthError(error)) {
          dispatch(logout());
        }
        return rejectWithValue(getErrorPayload(error, "Failed to fetch cart"));
      }
    });


// Add an item to the cart for a user or guest 
export const addToCart = createAsyncThunk("cart/addToCart",async ({
    productId,
    quantity,
    size,
    color , 
    guestId ,
    userId 
  } ,{rejectWithValue, dispatch}) => {
    try{
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart`,{  productId,quantity,size,color,guestId,userId});
      return response.data;
    }catch(error){
      console.error("Error adding to cart:", error);
      if (isAuthError(error)) {
        dispatch(logout());
      }
      return rejectWithValue(getErrorPayload(error, "Failed to add to cart"));
     }                         
  }
);


// Update the quantity of an item in the cart 
export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async ({productId , quantity , guestId , userId , size , color },
    {rejectWithValue, dispatch}) => {
      try{
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/cart`,{ productId,quantity,guestId,userId,size,color });
        return response.data; 
      }catch(error){
        console.error("Error updating cart item quantity:", error);
        if (isAuthError(error)) {
          dispatch(logout());
        }
        return rejectWithValue(getErrorPayload(error, "Failed to update quantity"));
      }
    }
)


// Remove an item from the cart 
export const removeFromCart = createAsyncThunk("cart/removeFromCart",
  async ({productId , guestId , userId , size , color} , {rejectWithValue, dispatch}) => {
    try{
      const response = await axios({
        method : "DELETE",
        url : `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        data : {productId , guestId , userId , size , color}
      });
      return response.data;
    }catch(error){
      console.error("Error removing from cart:", error);
      if (isAuthError(error)) {
        dispatch(logout());
      }
      return rejectWithValue(getErrorPayload(error, "Failed to remove from cart"));
    }   
}
);

//Merge guest cart with user cart upon login 
export const mergeCart = createAsyncThunk(
  "cart/mergeCart",
  async ({ guestId , user } , {rejectWithValue, dispatch}) => {
  try{
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
      {guestId,user},
      {
        headers : {
          Authorization : `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );       
      return response.data;
  }catch(error){
    console.error("Error merging cart:", error);
    if (isAuthError(error)) {
      dispatch(logout());
    }
    return rejectWithValue(getErrorPayload(error, "Failed to merge cart"));
  }
}) ;


const cartSlice = createSlice({
  name : "cart",
  initialState : {
    cart : localCartFromStorage(),
    loading : false,
    error : null,
  },
  reducers : {
    clearCart : (state) => {
      state.cart = {products : [] };
      localStorage.removeItem("cart");
    },
    clearCartError : (state) => {
      state.error = null;
    },
  },
  extraReducers : (builder) => {
    builder
    .addCase(fetchCart.pending,(state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchCart.fulfilled,(state,action) => {
      state.loading = false;
      state.cart = action.payload;
      saveCartToStorage(action.payload);
    })
    .addCase(fetchCart.rejected,(state,action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to fetch cart";
    })

    .addCase(addToCart.pending,(state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(addToCart.fulfilled,(state,action) => {
      state.loading = false;
      state.cart = action.payload;
      saveCartToStorage(action.payload);
    })
    .addCase(addToCart.rejected,(state,action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to add to cart";
    })

    .addCase(updateCartItemQuantity.pending,(state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateCartItemQuantity.fulfilled,(state,action) => {
      state.loading = false;
      state.cart = action.payload;
      saveCartToStorage(action.payload);
    })
    .addCase(updateCartItemQuantity.rejected,(state,action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to update quantity";
    })

    .addCase(removeFromCart.pending,(state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(removeFromCart.fulfilled,(state,action) => {
      state.loading = false;
      state.cart = action.payload;
      saveCartToStorage(action.payload);
    })
    .addCase(removeFromCart.rejected,(state,action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to remove from cart";
    })

    .addCase(mergeCart.pending,(state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(mergeCart.fulfilled,(state,action) => {
      state.loading = false;
      state.cart = action.payload;
      saveCartToStorage(action.payload);
    })
    .addCase(mergeCart.rejected,(state,action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to merge cart";
    })
  }
});


export const { clearCart, clearCartError } = cartSlice.actions;
export default cartSlice.reducer;

