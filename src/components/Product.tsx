import { ReactElement, memo } from "react";

import { ProductType } from "../context/ProductsProvider";
import { ReducerActionType, ReducerAction } from "../context/CartProvider";

type ProductProps = {
  product: ProductType;
  dispatch: React.Dispatch<ReducerAction>;
  REDUCER_ACTIONS: ReducerActionType;
  inCart: boolean;
};

const Product = ({
  product,
  dispatch,
  REDUCER_ACTIONS,
  inCart,
}: ProductProps): ReactElement => {
  const imgSrc: string = new URL(
    `../images/${product.sku}.jpg`,
    import.meta.url
  ).href;

  const addToCart = () =>
    dispatch({
      type: REDUCER_ACTIONS.ADD,
      payload: { ...product, quantity: 1 },
    });

  const itemInCart = inCart ? " -> item in cart: ✔" : null;

  const content = (
    <article className="product">
      <h3>{product.name}</h3>
      <img className="product__img" src={imgSrc} alt={product.name} />
      <p>
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(product.price)}
        {itemInCart}
      </p>
      <button onClick={addToCart}>Add to Cart</button>
    </article>
  );
  return content;
};

const areProductsEqual = (
  { product: prevProduct, inCart: prevInCart }: ProductProps,
  { product: nextProduct, inCart: nextInCart }: ProductProps
) => {
  return Object.keys(prevProduct).every((key) => {
    return (
      prevProduct[key as keyof ProductType] ===
        nextProduct[key as keyof ProductType] && prevInCart === nextInCart
    );
  });
};

const MemoizedProduct = memo<typeof Product>(Product, areProductsEqual);

export default MemoizedProduct;
