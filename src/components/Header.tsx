import Nav from "./Nav";

type HeaderPropsType = {
  viewCart: boolean;
  setViewCart: React.Dispatch<React.SetStateAction<boolean>>;
};

const Header = ({ viewCart, setViewCart }: HeaderPropsType) => {
  const content = (
    <>
      <header className="header">
        <div className="header__title-ber">
          <h1>Acme Co.</h1>
          <div className="header__price-box">
            <p>Total items:</p>
            <p>Total price:</p>
          </div>
        </div>
        <Nav viewCart={viewCart} setViewCart={setViewCart} />
      </header>
    </>
  );
  return content;
};

export default Header;
