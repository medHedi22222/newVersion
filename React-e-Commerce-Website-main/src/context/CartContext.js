
import React, { createContext, useContext, useEffect, useReducer, useState } from 'react'
import { cartReducer, productFilterReducer } from './Reducers';
import axios from 'axios';

const Cart = createContext(); //name of the context

const CartContext = ({ children }) => {
  const [data, setData] = useState([]); // Create a state to hold the fetched data

  async function fetchData() {
    try {
      const response = await axios.get("http://localhost:5000/api/carts");
      setData(response.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchData(); // Fetch data only on mount
  }, []);

  const products = data.map((data) => ({
    id: data._id,
    name: data.name,
    price: data.price,
    image: data.image,
    inStock: data.inStock,
    fastDelivery: data.fastDelivery,
    ratings: data.ratings,
  }));

  const savedCart = JSON.parse(localStorage.getItem('cart')) || []; // Load cart from localStorage

  // Initialize reducer state with products and cart data
  const [state, dispatch] = useReducer(cartReducer, {
    products: [], // Start with empty products
    cart: savedCart, // Load cart from localStorage
  });

  // Dispatch the SET_PRODUCTS action when products are fetched
  useEffect(() => {
    if (products.length > 0) {
      dispatch({ type: 'SET_PRODUCTS', payload: products });
    }
  }, [products]);

  const [productFilterState, productFilterDispatch] = useReducer(productFilterReducer, {
    byStock: false,
    byFastDelivery: false,
    byRating: 0,
    searchQuery: "",
  });

  return (
    /**
     * children are all the jsx or components wrapped inside the context
     * which we can see at the starting point of our app - index.js
     * so, all children will have access to the state and dispatch function
     * */
    <Cart.Provider
      value={{
        state,
        dispatch,
        productFilterState,
        productFilterDispatch,
        data, // Provide `data` state in the context
        setData, // Optionally expose the setter if needed elsewhere
      }}>
      {children}
    </Cart.Provider>
  )
}

export default CartContext;

export const CartState = () => {
  return useContext(Cart);
};
