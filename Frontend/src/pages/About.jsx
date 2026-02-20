import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            <Navbar />

            {/* ── Full-screen Hero ── */}
            <section className="about-hero">
                <div className="about-hero-overlay" />
                <motion.div
                    className="about-hero-content"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9 }}
                >
                    <span className="about-eyebrow">Est. 2026</span>
                    <h1>Our Story</h1>
                    <p>Where elegance meets purpose</p>
                    <div className="about-hero-divider" />
                </motion.div>
            </section>

            {/* ── Brand Story — image + text ── */}
            <section className="about-section">
                <div className="container">
                    <div className="about-grid">
                        {/* Image Column */}
                        <motion.div
                            className="about-img-col"
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="about-img-wrap">
                                <img
                                    src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
                                    alt="Elvara & Co. — luxury evening wear"
                                />
                                <div className="about-img-tag">
                                    <span>✦</span>
                                    <p>Luxury since 2026</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Text Column */}
                        <motion.div
                            className="about-text-col"
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="about-section-label">Our Identity</span>
                            <h2>ELVARA &amp; CO.</h2>
                            <p>
                                Born from a passion for timeless elegance and modern sophistication, ELVARA &amp; CO.
                                is a luxury clothing brand dedicated to the refined woman. Every piece in our
                                collection is crafted with meticulous attention to detail, using only the finest
                                fabrics and materials.
                            </p>
                            <p>
                                We believe that true luxury is not just about what you wear — it's about how you
                                feel. Our designs are created to empower, inspire, and celebrate the modern woman
                                in all her grace.
                            </p>

                            {/* Value cards inline */}
                            <div className="about-values">
                                <div className="value-card">
                                    <span className="value-icon">✦</span>
                                    <div>
                                        <h3>Craftsmanship</h3>
                                        <p>Every stitch tells a story of dedication and mastery.</p>
                                    </div>
                                </div>
                                <div className="value-card">
                                    <span className="value-icon">✦</span>
                                    <div>
                                        <h3>Elegance</h3>
                                        <p>Timeless designs that transcend seasonal trends.</p>
                                    </div>
                                </div>
                                <div className="value-card">
                                    <span className="value-icon">✦</span>
                                    <div>
                                        <h3>Exclusivity</h3>
                                        <p>Limited collections for the discerning few.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Quote ── */}
            <section className="about-quote">
                <div className="container">
                    <motion.blockquote
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        "Discover timeless elegance with ELVARA &amp; CO., where every piece reflects
                        sophistication and modern luxury."
                        <span>— Elvara &amp; Co.</span>
                    </motion.blockquote>
                </div>
            </section>

            {/* ── Footer — capsule style matching Home ── */}
            <footer className="about-footer">
                <div className="footer-ornament"><span>✦</span></div>
                <div className="footer-brand-large">ELVARA &amp; CO.</div>
                <div className="footer-capsule">
                    <p className="footer-copy">
                        &copy; 2026 <strong>ELVARA &amp; CO.</strong> &mdash; Timeless Elegance
                    </p>
                    <div className="footer-links">
                        <Link to="/shop">Collections</Link>
                        <Link to="/about">About</Link>
                        <Link to="/cart">Cart</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default About;
