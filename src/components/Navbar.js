import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './ContextReducer';

export default function Navbar() {
  const navigate = useNavigate();
  const cartState = useCart();
  const cartItems = cartState && Array.isArray(cartState.cartItems) ? cartState.cartItems : [];
  const cartCount = cartItems.reduce((s, it) => s + (Number(it.qty) || 0), 0);

  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('userToken'));

  useEffect(() => {
    const onAuth = () => setLoggedIn(!!localStorage.getItem('userToken'));
    window.addEventListener('authChange', onAuth);
    return () => window.removeEventListener('authChange', onAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    window.dispatchEvent(new Event('authChange'));
    navigate('/login');
  };

  const handleBrandClick = (e) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('showWelcome', { detail: { force: true } }));
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a href="/" className="navbar-brand fs-1 fst-italic" onClick={handleBrandClick}>FoodHub</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2">
            <li className="nav-item"><Link className="nav-link active fs-3" to="/">Home</Link></li>
            {loggedIn && <li className="nav-item"><Link className="nav-link active fs-3" to="/order">My Order</Link></li>}
          </ul>

          <div className='d-flex ms-auto align-items-center'>
            {loggedIn && (
              <Link to="/cart" className="btn btn-outline-warning me-2 position-relative">
                MyCart
                {cartCount > 0 && <span className="badge bg-danger rounded-pill position-absolute" style={{ top: -8, right: -8 }}>{cartCount}</span>}
              </Link>
            )}
            {!loggedIn ? (
              <>
                <Link className="btn btn-outline-success mx-1" to="/login">Login</Link>
                <Link className="btn btn-outline-success mx-1" to="/createuser">SignUp</Link>
              </>
            ) : (
              <button className="btn btn-outline-danger mx-1" onClick={handleLogout}>Logout</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
