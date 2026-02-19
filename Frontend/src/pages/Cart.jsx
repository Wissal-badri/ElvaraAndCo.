import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './Cart.css';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();
    const navigate = useNavigate();

    if (cart.length === 0) {
        return (
            <div className="cart-page">
                <Navbar />
                <div className="container cart-empty">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                        <h1>My Selection</h1>
                        <p>Your selection is empty.</p>
                        <Link to="/shop" className="btn-primary">Explore Collection</Link>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <Navbar />
            <div className="container" style={{ padding: '60px 20px' }}>
                <h1 style={{ marginBottom: '50px', textAlign: 'center' }}>My Selection</h1>

                <div className="cart-layout">
                    {/* Cart Items */}
                    <div className="cart-items">
                        <AnimatePresence>
                            {cart.map((item) => (
                                <motion.div
                                    key={item.cartItemId}
                                    className="cart-item"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    layout
                                >
                                    <div className="cart-item-img">
                                        {item.image ? (
                                            <img src={item.image.startsWith('http') ? item.image : `http://localhost:5000/uploads/${item.image}`} alt={item.name} />
                                        ) : (
                                            <div className="img-placeholder" />
                                        )}
                                    </div>
                                    <div className="cart-item-info">
                                        <h3>{item.name}</h3>
                                        <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '4px' }}>Size: {item.size || 'N/A'}</p>
                                        <p className="item-price">{Number(item.price).toFixed(2)} MAD</p>
                                    </div>
                                    <div className="cart-item-controls">
                                        <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}>
                                            <FaMinus />
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}>
                                            <FaPlus />
                                        </button>
                                    </div>
                                    <p className="item-subtotal">{(item.price * item.quantity).toFixed(2)} MAD</p>
                                    <button className="remove-btn" onClick={() => removeFromCart(item.cartItemId)}>
                                        <FaTrash />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <div className="cart-summary">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>{total.toFixed(2)} MAD</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="summary-row total-row">
                            <span>Total</span>
                            <span>{total.toFixed(2)} MAD</span>
                        </div>
                        <button className="btn-primary checkout-btn" onClick={() => navigate('/checkout')}>
                            Proceed to Checkout
                        </button>
                        <button className="btn-secondary clear-btn" onClick={clearCart}>
                            Clear Selection
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
