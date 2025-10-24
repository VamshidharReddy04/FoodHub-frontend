import React, { createContext, useReducer, useContext } from 'react';

const CartStateContext = createContext(null);
const CartDispatchContext = createContext(null);

const initialState = { cartItems: [] };

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const item = action.payload || {};
      const qtyToAdd = Number(item.qty) || 1;

      // match by _id and size (if provided)
      const matchIndex = state.cartItems.findIndex(
        (ci) => ci._id === item._id && (item.size ? ci.size === item.size : true)
      );

      if (matchIndex !== -1) {
        const updated = state.cartItems.map((ci, idx) =>
          idx === matchIndex ? { ...ci, qty: Number(ci.qty || 0) + qtyToAdd } : ci
        );
        return { ...state, cartItems: updated };
      }

      const newItem = { ...item, qty: qtyToAdd };
      return { ...state, cartItems: [...state.cartItems, newItem] };
    }

    case 'REMOVE_FROM_CART': {
      const { id, size } = action.payload || {};
      if (typeof action.index === 'number') {
        const copy = [...state.cartItems];
        copy.splice(action.index, 1);
        return { ...state, cartItems: copy };
      }
      if (id) {
        return {
          ...state,
          cartItems: state.cartItems.filter(
            (ci) => !(ci._id === id && (size ? ci.size === size : true))
          ),
        };
      }
      return state;
    }

    case 'CLEAR_CART':
      return { ...state, cartItems: [] };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <CartStateContext.Provider value={state}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartStateContext.Provider>
  );
}

export const useCart = () => useContext(CartStateContext);
export const useDispatchCart = () => useContext(CartDispatchContext);