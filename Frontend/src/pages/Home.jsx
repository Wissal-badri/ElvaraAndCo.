import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import './Home.css';

const Home = () => {
    const { addToCart } = useCart();
    const [featured, setFeatured] = useState([]);
    const [addedId, setAddedId] = useState(null);

    useEffect(() => {
        api.get('/products')
            .then(res => setFeatured(res.data.slice(0, 3)))
            .catch(() => { });
    }, []);

    const handleAdd = (product) => {
        addToCart(product);
        setAddedId(product.id);
        setTimeout(() => setAddedId(null), 1500);
    };

    return (
        <div className="home-page">
            <Navbar />

            {/* ── Hero ── */}
            <section className="hero">
                <div className="hero-overlay" />
                <div className="container hero-content">
                    <motion.p
                        className="hero-eyebrow"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        New Collection 2026
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                    >
                        ELVARA<br />&amp; CO.
                    </motion.h1>
                    <motion.p
                        className="hero-tagline"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                    >
                        Timeless Elegance &amp; Modern Luxury
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.45 }}
                        className="hero-actions"
                    >
                        <Link to="/shop" className="btn-primary">Shop Collection</Link>
                        <Link to="/about" className="btn-secondary">Our Story</Link>
                    </motion.div>
                </div>
            </section>

            {/* ── Brand Statement ── */}
            <section className="brand-statement">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="statement-inner"
                    >
                        <span className="statement-ornament">✦</span>
                        <p>
                            "Discover timeless elegance with ELVARA &amp; CO., where every piece reflects
                            sophistication and modern luxury. We are dedicated to providing the finest quality
                            attire for the modern woman who values style and grace."
                        </p>
                        <span className="statement-ornament">✦</span>
                    </motion.div>
                </div>
            </section>

            {/* ── Featured Products ── */}
            <section className="featured-section">
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2>New Arrivals</h2>
                        <Link to="/shop" className="view-all">View All →</Link>
                    </motion.div>

                    {featured.length > 0 ? (
                        <div className="featured-grid">
                            {featured.map((product, i) => (
                                <motion.div
                                    key={product.id}
                                    className="featured-card"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ y: -8 }}
                                >
                                    <Link to={`/product/${product.id}`} className="featured-card-img-wrap">
                                        {product.image
                                            ? <img src={product.image.startsWith('http') ? product.image : `http://localhost:5000/uploads/${product.image}`} alt={product.name} />
                                            : <div className="featured-img-placeholder" />
                                        }
                                        <div className="featured-card-hover"><span>View Details</span></div>
                                    </Link>
                                    <div className="featured-card-body">
                                        <h3>{product.name}</h3>
                                        <p className="featured-price">${Number(product.price).toFixed(2)}</p>
                                        <button
                                            className={`featured-add-btn ${addedId === product.id ? 'added' : ''}`}
                                            onClick={() => handleAdd(product)}
                                        >
                                            {addedId === product.id ? '✓ Added' : 'Add to Selection'}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="featured-placeholder-grid">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="featured-card">
                                    <div className="featured-img-placeholder" />
                                    <div className="featured-card-body">
                                        <h3>Coming Soon</h3>
                                        <p className="featured-price">—</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── Values Strip ── */}
            <section className="values-strip">
                <div className="container values-grid">
                    {[
                        { icon: '✦', title: 'Premium Quality', desc: 'Finest fabrics, impeccable finish' },
                        { icon: '✦', title: 'Free Delivery', desc: 'On all orders nationwide' },
                        { icon: '✦', title: 'Cash on Delivery', desc: 'Safe and convenient payment' },
                        { icon: '✦', title: 'Exclusive Designs', desc: 'Limited edition collections' },
                    ].map((v, i) => (
                        <motion.div
                            key={v.title}
                            className="value-item"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <span className="value-icon">{v.icon}</span>
                            <h4>{v.title}</h4>
                            <p>{v.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="home-footer">
                <div className="container footer-inner">
                    <div className="footer-brand">ELVARA & CO.</div>
                    <div className="footer-links">
                        <Link to="/shop">Collections</Link>
                        <Link to="/about">About</Link>
                        <Link to="/cart">Cart</Link>
                    </div>
                    <p className="footer-copy">&copy; 2026 ELVARA & CO. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
