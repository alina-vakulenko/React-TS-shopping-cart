import { useState } from "react";

import CartItem from "./CartItem";
import useCart from "../hooks/useCart";

const Cart = () => {
  const [confirm, setConfirm] = useState(false);
  const { dispatch, REDUCER_ACTIONS, totalItems, totalPrice, sortedCart } =
    useCart();

  const onSubmit = () => {
    dispatch({ type: REDUCER_ACTIONS.SUBMIT });
    setConfirm(true);
  };

  const pageContent = confirm ? (
    <h2>Thank you for order.</h2>
  ) : (
    <>
      <h2 className="offscreen">Cart</h2>
      <ul className="cart">
        {sortedCart.map((item) => {
          return (
            <CartItem
              key={item.sku}
              item={item}
              dispatch={dispatch}
              REDUCER_ACTIONS={REDUCER_ACTIONS}
            />
          );
        })}
      </ul>
      <div className="cart__totals">
        <p>Total items: {totalItems}</p>
        <p>Total price: {totalPrice}</p>
        <button
          className="cart__submit"
          onClick={onSubmit}
          disabled={!totalItems}
        >
          Place order
        </button>
      </div>
    </>
  );

  const content = <main className="main main--cart">{pageContent}</main>;

  return content;
};

export default Cart;
