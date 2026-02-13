import "./Layout.css";

export default function Layout({ children }) {
  return (
    <div className="layout">
      <div className="side-panel">
        <div className="logo-div">
          <img className="logo" src="/Logo.svg" alt="Logo" />
        </div>
        <div className="nav-links">
          <div className="nav-item">
            <img className="nav-img qr" src="/qr.svg" alt="qr" />
            <a className="nav-link" href="#">
              Scan QR
            </a>
          </div>
          <div className="nav-item">
            <img className="nav-img box" src="/box.svg" alt="box" />
            <a className="nav-link" href="#">
              Containers
            </a>
          </div>
          <div className="nav-item">
            <img
              className="nav-img shopping-basket"
              src="/shopping-basket.svg"
              alt="shopping basket"
            />
            <a className="nav-link" href="#">
              Products
            </a>
          </div>
          <div className="nav-item">
            <img
              className="nav-img users-alt"
              src="/users-alt.svg"
              alt="users"
            />
            <a className="nav-link" href="#">
              Users
            </a>
          </div>
        </div>
      </div>
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}
