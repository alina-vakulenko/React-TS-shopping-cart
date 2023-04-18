import { useReducer, useMemo, createContext, ReactElement } from "react";

/**
 * create initial cart state and type for it (single item and array of items)
 * define action types to change state as enum or object. Type can be determined through "typeof ACTIONS"
 * define type for action objects (type and payload, type should be among action types defined earlier)
 * prepare reducer function that accepts state and action and return new state
 * write logic for each action type with switch operator. Each case returns new state
 * all logic related to operation with cart context can be extracted to custom hook - useCartContext
 * hook accepts initial cart state,  uses useReducer hook to store and modify state
 * totalItems, totalPrice calculated inside hook
 * hook returns dispatch method, action types, sorted cart and calculations
 * type of custom hook can be constructed from ReturnType<typeof Hook>
 * create initial state for cart context
 * create cart context as createContext(initialContextState)
 * prepare provider for context: define type of children (ReactElement or array of ReactElement)
 * provider accepts {children} and returns ReactElement
 * provider is created as  <CartContext.Provider>{children}</CartContext.Provider> passing it value prop that equals result of call useCartContext with initial context state
 */

export type CartItemType = {
  sku: string;
  name: string;
  price: number;
  quantity: number;
};

type CartStateType = {
  cart: CartItemType[];
};

const ACTIONS = {
  ADD: "ADD",
  REMOVE: "REMOVE",
  QUANTITY: "QUANTITY",
  SUBMIT: "SUBMIT",
};

export type ReducerActionType = typeof ACTIONS;

export type ReducerAction = {
  type: string;
  payload?: CartItemType;
};

const reducer = (
  state: CartStateType,
  action: ReducerAction
): CartStateType => {
  switch (action.type) {
    case ACTIONS.ADD: {
      if (!action.payload) {
        throw new Error("action.payload missing in ADD action");
      }

      const { sku, name, price } = action.payload;

      const filteredCart: CartItemType[] = state.cart.filter(
        (item) => item.sku !== sku
      );

      const itemExists: CartItemType | undefined = state.cart.find(
        (item) => item.sku === sku
      );

      const quantity: number = itemExists ? itemExists.quantity + 1 : 1;

      return {
        ...state,
        cart: [...filteredCart, { sku, name, price, quantity }],
      };
    }
    case ACTIONS.REMOVE: {
      if (!action.payload) {
        throw new Error("action.payload missing in REMOVE action");
      }

      const { sku } = action.payload;

      const filteredCart: CartItemType[] = state.cart.filter(
        (item) => item.sku !== sku
      );

      return { ...state, cart: [...filteredCart] };
    }
    case ACTIONS.QUANTITY: {
      if (!action.payload) {
        throw new Error("action.payload missing in QUANTITY action");
      }

      const { sku, quantity } = action.payload;

      const itemExists: CartItemType | undefined = state.cart.find(
        (item) => item.sku === sku
      );

      if (!itemExists) {
        throw new Error("Item must exist in order to update quantity");
      }

      const updatedItem: CartItemType = { ...itemExists, quantity };

      const filteredCart: CartItemType[] = state.cart.filter(
        (item) => item.sku !== sku
      );

      return { ...state, cart: [...filteredCart, updatedItem] };
    }
    case ACTIONS.SUBMIT: {
      return { ...state, cart: [] };
    }
    default:
      throw new Error("Unidentified reducer action type");
  }
};

const initialCartState: CartStateType = { cart: [] };

const useCartContext = (initialCartState: CartStateType) => {
  const [state, dispatch] = useReducer(reducer, initialCartState);

  const REDUCER_ACTIONS = useMemo(() => {
    return ACTIONS;
  }, []);

  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(
    state.cart.reduce((sum, item) => sum + item.quantity * item.price, 0)
  );

  const sortedCart = state.cart.sort((a, b) => {
    const itemA = Number(a.sku.slice(-4));
    const itemB = Number(b.sku.slice(-4));
    return itemA - itemB;
  });

  return { dispatch, REDUCER_ACTIONS, totalItems, totalPrice, sortedCart };
};

export type UseCartContextType = ReturnType<typeof useCartContext>;

const initialCartContextState: UseCartContextType = {
  dispatch: () => {},
  REDUCER_ACTIONS: ACTIONS,
  totalItems: 0,
  totalPrice: "", // string because of currency sign
  sortedCart: [],
};

export const CartContext = createContext<UseCartContextType>(
  initialCartContextState
);

type ChildrenType = { children?: ReactElement | ReactElement[] };

export const CartProvider = ({ children }: ChildrenType): ReactElement => {
  return (
    <CartContext.Provider value={useCartContext(initialCartState)}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
