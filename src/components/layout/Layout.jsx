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



          <NavLink className="nav-link" to="/products/new">
            <div className="nav-item">
              <img className="nav-img qr" src="/qr.svg" alt="qr" />
                Create product
            </div>
          </NavLink>

          <NavLink className="nav-link" to="/containers/new">
            <div className="nav-item">
              <img className="nav-img qr" src="/qr.svg" alt="qr" />
                Create container
            </div>
          </NavLink>



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


          <NavLink className="nav-link" to="/users">
            <div className="nav-item">
              <img
                className="nav-img users-alt"
                src="/users-alt.svg"
                alt="users"
              />
                Users
            </div>
          </NavLink>



        </div>
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}
