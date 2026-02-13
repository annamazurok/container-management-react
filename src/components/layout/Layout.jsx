import "./Layout.css";
import { Outlet, NavLink, Link } from "react-router-dom";

export default function Layout() {
  return (
    <div className="layout">
      <div className="side-panel">
        <div className="logo-div">
          <img className="logo" src="/Logo.svg" alt="Logo" />
        </div>
        <div className="nav-links">



          <Link className="nav-link" to="#">
            <div className="nav-item">
              <img className="nav-img qr" src="/qr.svg" alt="qr" />
                Scan QR
            </div>
          </Link>



          <NavLink className="nav-link" to="/containers" end>
            <div className="nav-item">
              <img className="nav-img box" src="/box.svg" alt="box" />
              Containers
            </div>
          </NavLink>

          <NavLink className="nav-link" to="/" end>
            <div className="nav-item">
              <img
                className="nav-img shopping-basket"
                src="/shopping-basket.svg"
                alt="shopping basket"
              />
                Products
            </div>
          </NavLink>


          <Link className="nav-link" to="#">
            <div className="nav-item">
              <img
                className="nav-img users-alt"
                src="/users-alt.svg"
                alt="users"
              />
                Users
            </div>
          </Link>



        </div>
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}
