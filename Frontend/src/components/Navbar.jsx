import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FaShoppingBag, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const [isOpen, setIsOpen] = useState(false);

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link to="/" className="nav-logo">
                    <span className="nav-logo-dot" />
                    ELVARA &amp; CO.
                </Link>

                {/* Desktop Menu */}
                <div className="nav-links desktop-menu">
                    <Link to="/">Home</Link>
                    <Link to="/shop">Collections</Link>
                    <Link to="/about">About</Link>
                    {user?.role === 'admin' && <Link to="/admin">Dashboard</Link>}
                </div>

                <div className="nav-actions">
                    {user ? (
                        <button onClick={logout} className="icon-btn" title="Logout">
                            <FaUser />
                        </button>
                    ) : (
                        <Link to="/login" className="icon-btn" title="Login">
                            <FaUser />
                        </Link>
                    )}

                    <Link to="/cart" className="icon-btn cart-btn">
                        <FaShoppingBag />
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </Link>

                    <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="mobile-menu">
                    <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
                    <Link to="/shop" onClick={() => setIsOpen(false)}>Collections</Link>
                    <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
                    {user?.role === 'admin' && <Link to="/admin" onClick={() => setIsOpen(false)}>Dashboard</Link>}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
