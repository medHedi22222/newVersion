/**
 * containing reducer function for cart and filter
 * 
 * Reducers take in two things: previous state and an action. 
 * Then they reduce it (read it return) to one entity: the new updated instance of state. 
 * So reducers are basically pure JS functions which take in the previous state and an action and return the newly updated state.
 */
export const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            const updatedAddCart = [...state.cart, { ...action.payload, qty: 1 }];
            localStorage.setItem('cart', JSON.stringify(updatedAddCart)); // Save to localStorage
            return {
                ...state,
                cart: updatedAddCart
            };

        case 'REMOVE_FROM_CART':
            const updatedRemoveCart = state.cart.filter(c => c.id !== action.payload.id);
            localStorage.setItem('cart', JSON.stringify(updatedRemoveCart)); // Save to localStorage
            return {
                ...state,
                cart: updatedRemoveCart
            };

        case 'CHANGE_CART_QTY':
            const updatedQtyCart = state.cart.map((c) =>
                c.id === action.payload.id ? { ...c, qty: action.payload.qty } : c
            );
            localStorage.setItem('cart', JSON.stringify(updatedQtyCart)); // Save to localStorage
            return {
                ...state,
                cart: updatedQtyCart
            };

        case 'EMPTY_CART':
            localStorage.removeItem('cart'); // Clear from localStorage
            return {
                ...state,
                cart: []
            };

        case 'SET_PRODUCTS': // Add this case to set products
            return {
                ...state,
                products: action.payload
            };

        default:
            return state;
    }
};

export const productFilterReducer = (state, action) => {
    switch (action.type) {
        case 'SORT_BY_PRICE':
            return { ...state, sort: action.payload }; //adding sort variable 

        case 'FILTER_BY_STOCK':
            return { ...state, byStock: !state.byStock };

        case 'FILTER_BY_DELIVERY':
            return { ...state, byFastDelivery: !state.byFastDelivery };

        case 'FILTER_BY_RATING':
            return { ...state, byRating: action.payload };

        case 'FILTER_BY_SEARCH':
            return { ...state, searchQuery: action.payload };

        case 'CLEAR_FILTERS':
            return {
                byStock: false,
                byFastDelivery: false,
                byRating: 0,
                searchQuery: "",
            };

        default:
            return state;
    }
}