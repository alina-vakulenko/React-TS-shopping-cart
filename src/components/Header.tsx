import Nav from "./Nav";

import useCart from "../hooks/useCart";

type HeaderPropsType = {
  viewCart: boolean;
  setViewCart: React.Dispatch<React.SetStateAction<boolean>>;
};

const Header = ({ viewCart, setViewCart }: HeaderPropsType) => {
  const { totalItems, totalPrice } = useCart();

  const content = (
    <>
      <header className="header">
        <div className="header__title-ber">
          <h1>Acme Co.</h1>
          <div className="header__price-box">
            <p>Total items: {totalItems}</p>
            <p>Total price: {totalPrice}</p>
          </div>
        </div>
        <Nav viewCart={viewCart} setViewCart={setViewCart} />
      </header>
    </>
  );
  return content;
};

export default Header;
