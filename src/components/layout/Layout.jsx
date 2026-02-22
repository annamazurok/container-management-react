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


          <NavLink className="nav-link" to="/containers/new" end>
            <div className="nav-item">
              <img className="nav-img box" src="/box.svg" alt="create container" />
              Create Container
            </div>
          </NavLink>

          <NavLink className="nav-link" to="/containers" end>
            <div className="nav-item">
              <img className="nav-img box" src="/box.svg" alt="box" />
              Containers
            </div>
          </NavLink>

          <NavLink className="nav-link" to="/products" end>
            <div className="nav-item">
              <img
                className="nav-img shopping-basket"
                src="/shopping-basket.svg"
                alt="shopping basket"
              />
              Products
            </div>
          </NavLink>

          <NavLink className="nav-link" to="/products/new" end>
            <div className="nav-item">
              <img
                className="nav-img shopping-basket"
                src="/shopping-basket.svg"
                alt="create product"
              />
              Create Product
            </div>
          </NavLink>

          <NavLink className="nav-link" to="/container-types" end>
            <div className="nav-item">
              <img className="nav-img box" src="/box.svg" alt="container types" />
              Container Types
            </div>
          </NavLink>

          <NavLink className="nav-link" to="/product-types" end>
            <div className="nav-item">
              <img
                className="nav-img shopping-basket"
                src="/shopping-basket.svg"
                alt="product types"
              />
              Product Types
            </div>
          </NavLink>

          <NavLink className="nav-link" to="/units" end>
            <div className="nav-item">
              <img
                className="nav-img shopping-basket"
                src="/shopping-basket.svg"
                alt="product types"
              />
              Units
            </div>
          </NavLink>

          <NavLink className="nav-link" to="/users" end>
            <div className="nav-item">
              <img
                className="nav-img shopping-basket"
                src="/shopping-basket.svg"
                alt="product types"
              />
              Users
            </div>
          </NavLink>
          
        </div>
      </div>

      
      <div className="main-content">
        <Outlet />
      </div>


      <div className="bottom-nav">

        <NavLink className="bottom-link" to="/containers" end>
          <div className="bottom-item">
            <img className="bottom-ico" src="/box.svg" alt="box" />
            <span>Containers</span>
          </div>
        </NavLink>

        <NavLink className="bottom-link" to="/products" end>
          <div className="bottom-item">
            <img
              className="bottom-ico"
              src="/shopping-basket.svg"
              alt="products"
            />
            <span>Products</span>
          </div>
        </NavLink>

        <NavLink className="bottom-link" to="/products/new" end>
          <div className="bottom-item">
            <img
              className="bottom-ico"
              src="/shopping-basket.svg"
              alt="create product"
            />
            <span>+ Product</span>
          </div>
        </NavLink>

        <NavLink className="bottom-link" to="/containers/new" end>
          <div className="bottom-item">
            <img className="bottom-ico" src="/box.svg" alt="create container" />
            <span>+ Container</span>
          </div>
        </NavLink>

        <NavLink className="bottom-link" to="/container-types" end>
          <div className="bottom-item">
            <img className="bottom-ico" src="/box.svg" alt="container types" />
            <span>C. Types</span>
          </div>
        </NavLink>

        <NavLink className="bottom-link" to="/product-types" end>
          <div className="bottom-item">
            <img className="bottom-ico" src="/shopping-basket.svg" alt="product types" />
            <span>P. Types</span>
          </div>
        </NavLink>

        <NavLink className="bottom-link" to="/units" end>
          <div className="bottom-item">
            <img className="bottom-ico" src="/shopping-basket.svg" alt="product types" />
            <span>Units</span>
          </div>
        </NavLink>

        <NavLink className="bottom-link" to="/users" end>
          <div className="bottom-item">
            <img className="bottom-ico" src="/shopping-basket.svg" alt="product types" />
            <span>Users</span>
          </div>
        </NavLink>

      </div>
    </div>
  );
}
