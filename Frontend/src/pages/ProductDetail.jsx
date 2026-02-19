import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { motion } from 'framer-motion';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [added, setAdded] = useState(false);
    const [selectedSize, setSelectedSize] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get(`/products/${id}`)
            .then(res => setProduct(res.data))
            .catch(() => navigate('/shop'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleAddToCart = () => {
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            setError('Please select a size.');
            return;
        }
        addToCart({ ...product, selectedSize });
        setAdded(true);
        setError('');
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) {
        return (
            <div className="product-detail-page">
                <Navbar />
                <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="product-detail-page">
            <Navbar />
            <div className="container" style={{ padding: '60px 20px' }}>
                <div className="product-detail-layout">
                    {/* Image */}
                    <motion.div
                        className="product-detail-img"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {product.image ? (
                            <img src={product.image.startsWith('http') ? product.image : `http://localhost:5000/uploads/${product.image}`} alt={product.name} />
                        ) : (
                            <div className="img-placeholder-lg" />
                        )}
                    </motion.div>

                    {/* Info */}
                    <motion.div
                        className="product-detail-info"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {product.category && (
                            <p className="product-category">{product.category}</p>
                        )}
                        <h1 className="product-name">{product.name}</h1>
                        <p className="product-price">{Number(product.price).toFixed(2)} MAD</p>

                        {product.description && (
                            <p className="product-description">{product.description}</p>
                        )}

                        {/* Size Selector */}
                        {product.sizes && (Array.isArray(product.sizes) ? product.sizes : JSON.parse(product.sizes || '[]')).length > 0 && (
                            <div className="product-detail-sizes">
                                <p>Select Size:</p>
                                <div className="size-options">
                                    {(Array.isArray(product.sizes) ? product.sizes : JSON.parse(product.sizes || '[]')).map(size => (
                                        <button
                                            key={size}
                                            className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                                            onClick={() => { setSelectedSize(size); setError(''); }}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                                {error && <p className="size-error" style={{ color: '#e05c5c', marginTop: '10px' }}>{error}</p>}
                            </div>
                        )}

                        <div className="product-stock">
                            {product.stock > 0 ? (
                                <span className="in-stock">✓ In Stock ({product.stock} available)</span>
                            ) : (
                                <span className="out-of-stock">✗ Out of Stock</span>
                            )}
                        </div>

                        <button
                            className={`btn-primary add-to-cart-btn ${added ? 'added' : ''}`}
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                        >
                            {added ? '✓ Added to Selection' : 'Add to Selection'}
                        </button>

                        <button className="btn-secondary" onClick={() => navigate('/shop')}>
                            ← Back to Collection
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
