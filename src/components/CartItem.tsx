import { ChangeEvent, ReactElement, memo } from "react";
import { CartItemType } from "../context/CartProvider";
import { ReducerAction, ReducerActionType } from "../context/CartProvider";

type CartItemProps = {
  item: CartItemType;
  dispatch: React.Dispatch<ReducerAction>;
  REDUCER_ACTIONS: ReducerActionType;
};

const CartItem = ({
  item,
  dispatch,
  REDUCER_ACTIONS,
}: CartItemProps): ReactElement => {
  const imgSrc: string = new URL(`../images/${item.sku}.jpg`, import.meta.url)
    .href;

  const itemTotal: number = item.quantity * item.price;

  const highestQty: number = 20 > item.quantity ? 20 : item.quantity;

  const optionValues: number[] = [...Array(highestQty).keys()].map(
    (i) => i + 1
  );

  const options: ReactElement[] = optionValues.map((val) => (
    <option key={`opt${val}`} value={val}>
      {val}
    </option>
  ));

  const onChangeQty = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: REDUCER_ACTIONS.QUANTITY,
      payload: { ...item, quantity: Number(e.target.value) },
    });
  };

  const onRemove = () =>
    dispatch({ type: REDUCER_ACTIONS.REMOVE, payload: item });

  const content = (
    <li className="cart__item">
      <img src={imgSrc} className="cart__img" alt={item.name} />
      <div aria-label="Item name">{item.name}</div>
      <div aria-label="Price per item">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(item.price)}
      </div>
      <label className="offscreen" htmlFor="itemQty">
        Item quantity
      </label>
      <select
        name="itemQty"
        id="itemQty"
        className="cart__select"
        value={item.quantity}
        aria-label="Item quantity"
        onChange={onChangeQty}
      >
        {options}
      </select>
      <div className="cart__item-subtotal" aria-label="Item subtotal">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(itemTotal)}
      </div>

      <button
        onClick={onRemove}
        aria-label="Remove item from cart"
        title="Remove item from cart"
        className="cart__button"
      >
        ❌
      </button>
    </li>
  );

  return content;
};

const areItemsEqual = (
  { item: prevItem }: CartItemProps,
  { item: nextItem }: CartItemProps
) => {
  return Object.keys(prevItem).every((key) => {
    return (
      prevItem[key as keyof CartItemType] ===
      nextItem[key as keyof CartItemType]
    );
  });
};
const MemoizedCartItem = memo<typeof CartItem>(CartItem, areItemsEqual);

export default MemoizedCartItem;
