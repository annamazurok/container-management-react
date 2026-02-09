import './Layout.css'

export default function Layout() {

  return (
    <div className="layout">
        <div className="side-panel">
            <div className="logo-div">
                <img className="logo" src="./public/Logo.svg" alt="Logo" />
            </div>
            <div className="nav-links">
                <div className="nav-item">
                    <img className="nav-img qr"  src="./public/qr.svg" alt="qr" />
                    <a className="nav-link" href="#">Scan QR</a>
                </div>
                <div className="nav-item">
                    <img className="nav-img box" src="./public/box.svg" alt="box" />
                    <a className="nav-link" href="#">Container</a>
                </div>
                <div className="nav-item">
                    <img className="nav-img shopping-basket"  src="./public/shopping-basket.svg" alt="shopping basket" />
                    <a className="nav-link" href="#">Products</a>
                </div>
                <div className="nav-item">
                    <img className="nav-img users-alt"  src="./public/users-alt.svg" alt="users" />
                    <a className="nav-link" href="#">Users</a>
                </div>
            </div>
        </div>
        <div className="top-panel">
            <a href="">dsc</a>
        </div>
    </div>
  );
}