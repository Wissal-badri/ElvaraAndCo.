import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { PiDressLight, PiShoppingCartLight, PiUsersThreeLight, PiCurrencyDollarLight, PiPackageLight, PiSignOutLight, PiPlusLight, PiPencilSimple, PiTrash, PiXLight, PiCheckLight } from "react-icons/pi";
import { IoDiamondOutline } from "react-icons/io5";
import './AdminDashboard.css';

const TABS = ['Products', 'Orders'];

const AdminDashboard = () => {
    const { user, logout, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Products');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);

    // Form States
    const [form, setForm] = useState({ name: '', description: '', price: '', category: '', stock: '' });
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [formError, setFormError] = useState('');
    const [saving, setSaving] = useState(false);

    // ── Guard ──
    useEffect(() => {
        if (authLoading) return;
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        fetchData();
    }, [user, authLoading]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [pRes, oRes] = await Promise.all([
                api.get('/products'),
                api.get('/orders'),
            ]);
            setProducts(pRes.data);
            setOrders(oRes.data);
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        setEditProduct(null);
        setForm({ name: '', description: '', price: '', category: '', stock: '' });
        setSelectedSizes([]);
        setImageFile(null);
        setImagePreview('');
        setFormError('');
        setShowModal(true);
    };

    const openEditModal = (product) => {
        setEditProduct(product);
        setForm({
            name: product.name,
            description: product.description || '',
            price: product.price,
            category: product.category || '',
            stock: product.stock,
        });
        setSelectedSizes(product.sizes || []);
        setImageFile(null);
        setImagePreview(product.image || '');
        setFormError('');
        setShowModal(true);
    };

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setFormError('');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const toggleSize = (size) => {
        setSelectedSizes(prev =>
            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
        );
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.price) {
            setFormError('Product name and price are required.');
            return;
        }
        setSaving(true);

        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('description', form.description);
            formData.append('price', form.price);
            formData.append('category', form.category);
            formData.append('stock', form.stock);
            formData.append('sizes', JSON.stringify(selectedSizes));
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const config = { headers: { 'Content-Type': 'multipart/form-data' } };

            if (editProduct) {
                await api.put(`/products/${editProduct.id}`, formData, config);
            } else {
                await api.post('/products', formData, config);
            }
            setShowModal(false);
            await fetchData();
        } catch (err) {
            setFormError(err.response?.data?.message || 'Failed to save product.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            await fetchData();
        } catch (err) {
            alert('Failed to delete product.');
        }
    };

    const handleUpdateOrderStatus = async (orderId, status) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status });
            await fetchData();
        } catch (err) {
            alert('Failed to update order status.');
        }
    };

    const stats = {
        totalProducts: products.length,
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        revenue: orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0),
    };

    if (authLoading) return <div className="admin-page"><p style={{ color: '#888', margin: 'auto' }}>Loading...</p></div>;
    if (!user || user.role !== 'admin') return null;

    return (
        <div className="admin-page">
            <aside className="admin-sidebar">
                <div className="sidebar-brand">ELVARA & CO.</div>
                <nav className="sidebar-nav">
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            className={`sidebar-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === 'Products' ? <PiDressLight size={20} /> : <PiShoppingCartLight size={20} />}
                            {tab}
                        </button>
                    ))}
                </nav>
                <button className="sidebar-logout" onClick={() => logout()}>
                    <PiSignOutLight size={20} /> Logout
                </button>
            </aside>

            <main className="admin-main">
                <header className="admin-header">
                    <h1>{activeTab}</h1>
                    <span className="admin-welcome">Welcome, {user.username}</span>
                </header>

                <div className="stats-grid">
                    {[
                        { label: 'Total Products', value: stats.totalProducts, icon: <PiDressLight /> },
                        { label: 'Total Orders', value: stats.totalOrders, icon: <PiPackageLight /> },
                        { label: 'Pending Orders', value: stats.pendingOrders, icon: <IoDiamondOutline /> },
                        { label: 'Total Revenue', value: `${Number(stats.revenue).toFixed(2)} MAD`, icon: <PiCurrencyDollarLight /> },
                    ].map((s, i) => (
                        <motion.div
                            key={s.label}
                            className="stat-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <span className="stat-icon">{s.icon}</span>
                            <div>
                                <p className="stat-value">{s.value}</p>
                                <p className="stat-label">{s.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {activeTab === 'Products' && (
                    <div className="tab-content">
                        <div className="tab-header">
                            <h2>Product Management</h2>
                            <button className="btn-primary add-btn" onClick={openAddModal}>
                                <PiPlusLight size={18} /> Add Product
                            </button>
                        </div>

                        {loading ? (
                            <p className="loading-text">Loading products...</p>
                        ) : products.length === 0 ? (
                            <div className="empty-state">
                                <p>No products yet. Add your first product!</p>
                                <button className="btn-primary" onClick={openAddModal}>Add Product</button>
                            </div>
                        ) : (
                            <div className="products-table-wrap">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Image</th>
                                            <th>Name</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th>Stock</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map(p => (
                                            <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                <td>
                                                    {p.image
                                                        ? <img src={p.image.startsWith('http') ? p.image : `http://localhost:5000/uploads/${p.image}`} alt={p.name} className="table-img" />
                                                        : <div className="table-img-placeholder" />
                                                    }
                                                </td>
                                                <td className="product-name-cell">{p.name}</td>
                                                <td>{p.category || '—'}</td>
                                                <td className="price-cell">{Number(p.price).toFixed(2)} MAD</td>
                                                <td>
                                                    <span className={`stock-badge ${p.stock > 0 ? 'in-stock' : 'no-stock'}`}>
                                                        {p.stock}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="action-btns">
                                                        <button className="action-btn edit" onClick={() => openEditModal(p)} title="Edit">
                                                            <PiPencilSimple size={18} />
                                                        </button>
                                                        <button className="action-btn delete" onClick={() => handleDeleteProduct(p.id)} title="Delete">
                                                            <PiTrash size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'Orders' && (
                    <div className="tab-content">
                        <div className="tab-header">
                            <h2>Orders Management</h2>
                        </div>

                        {loading ? (
                            <p className="loading-text">Loading orders...</p>
                        ) : orders.length === 0 ? (
                            <div className="empty-state">
                                <p>No orders yet.</p>
                            </div>
                        ) : (
                            <div className="products-table-wrap">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Customer</th>
                                            <th>Phone</th>
                                            <th>Address</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                            <th>Update</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(o => (
                                            <motion.tr key={o.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                <td className="order-id">#{o.id.slice(0, 8)}</td>
                                                <td>{o.customerName}</td>
                                                <td>{o.customerPhone}</td>
                                                <td style={{ maxWidth: '150px', fontSize: '0.8rem', color: '#888' }}>{o.shippingAddress}</td>
                                                <td className="price-cell">{Number(o.totalAmount).toFixed(2)} MAD</td>
                                                <td>
                                                    <span className={`status-badge status-${o.status}`}>{o.status}</span>
                                                </td>
                                                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    <select
                                                        className="status-select"
                                                        value={o.status}
                                                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                                                    >
                                                        {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                                                            <option key={s} value={s}>{s}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            className="modal-card"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <h2>{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
                                <button className="modal-close" onClick={() => setShowModal(false)}><PiXLight size={24} /></button>
                            </div>

                            <form onSubmit={handleSaveProduct} className="modal-form">
                                <div className="modal-grid">
                                    <div className="form-group">
                                        <label>Product Name *</label>
                                        <input
                                            name="name"
                                            value={form.name}
                                            onChange={handleFormChange}
                                            placeholder="e.g. Royal Velvet Dress"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Category</label>
                                        <input
                                            name="category"
                                            value={form.category}
                                            onChange={handleFormChange}
                                            placeholder="e.g. Dresses"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Price (MAD) *</label>
                                        <input
                                            name="price"
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            value={form.price}
                                            onChange={handleFormChange}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Stock Quantity</label>
                                        <input
                                            name="stock"
                                            type="number"
                                            min="0"
                                            value={form.stock}
                                            onChange={handleFormChange}
                                            placeholder="0"
                                        />
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Sizes Available</label>
                                        <div className="sizes-grid">
                                            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                                <label key={size} className={`size-checkbox ${selectedSizes.includes(size) ? 'selected' : ''}`}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedSizes.includes(size)}
                                                        onChange={() => toggleSize(size)}
                                                        style={{ display: 'none' }}
                                                    />
                                                    {size}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Product Image (File Upload)</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="file-input"
                                        />
                                        {imagePreview && (
                                            <div className="img-preview-container">
                                                <img src={imagePreview} alt="Preview" className="img-preview" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Description</label>
                                        <textarea
                                            name="description"
                                            value={form.description}
                                            onChange={handleFormChange}
                                            rows={3}
                                            placeholder="Product description..."
                                        />
                                    </div>
                                </div>

                                {formError && <p className="login-error">{formError}</p>}

                                <div className="modal-actions">
                                    <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary" disabled={saving}>
                                        {saving ? 'Saving...' : (editProduct ? 'Update Product' : 'Add Product')}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
