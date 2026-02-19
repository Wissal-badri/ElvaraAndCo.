import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import './Shop.css';

const CATEGORIES = ['All', 'Dresses', 'Accessories', 'Outerwear', 'Tops', 'Bottoms'];

const Shop = () => {
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [addedId, setAddedId] = useState(null);

    useEffect(() => {
        api.get('/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const filtered = activeCategory === 'All'
        ? products
        : products.filter(p => p.category === activeCategory);

    const handleAddToCart = (product, e) => {
        e.preventDefault();
        addToCart(product);
        setAddedId(product.id);
        setTimeout(() => setAddedId(null), 1500);
    };

    return (
        <div className="shop-page">
            <Navbar />

            {/* Page Header */}
            <section className="shop-header">
                <div className="shop-header-overlay" />
                <motion.div
                    className="shop-header-content"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <h1>The Collection</h1>
                    <p>Curated for the refined woman</p>
                </motion.div>
            </section>

            <div className="container" style={{ padding: '60px 20px' }}>
                {/* Category Filter */}
                <div className="category-filter">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="shop-loading">
                        <p>Loading collection...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="shop-empty">
                        <p>No products in this category yet.</p>
                    </div>
                ) : (
                    <div className="products-grid">
                        {filtered.map((product, i) => (
                            <motion.div
                                key={product.id}
                                className="product-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.07 }}
                                whileHover={{ y: -8 }}
                            >
                                <Link to={`/product/${product.id}`} className="product-card-link">
                                    <div className="product-card-img">
                                        {product.image ? (
                                            <img src={product.image.startsWith('http') ? product.image : `http://localhost:5000/uploads/${product.image}`} alt={product.name} />
                                        ) : (
                                            <div className="product-img-placeholder" />
                                        )}
                                        <div className="product-card-overlay">
                                            <span>View Details</span>
                                        </div>
                                    </div>
                                </Link>

                                <div className="product-card-body">
                                    {product.category && (
                                        <p className="product-card-category">{product.category}</p>
                                    )}
                                    <h3 className="product-card-name">{product.name}</h3>
                                    <p className="product-card-price">{Number(product.price).toFixed(2)} MAD</p>
                                    <button
                                        className={`product-card-btn ${addedId === product.id ? 'added' : ''}`}
                                        onClick={(e) => handleAddToCart(product, e)}
                                        disabled={product.stock === 0}
                                    >
                                        {product.stock === 0
                                            ? 'Out of Stock'
                                            : addedId === product.id
                                                ? '✓ Added'
                                                : 'Add to Selection'}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <footer style={{ padding: '50px 0', borderTop: '1px solid var(--color-charcoal-grey)', textAlign: 'center' }}>
                <p>&copy; 2026 ELVARA & CO. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default Shop;
