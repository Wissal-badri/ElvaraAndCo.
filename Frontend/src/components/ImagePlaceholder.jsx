import './ImagePlaceholder.css';

/**
 * A beautiful branded placeholder shown when a product has no image.
 * @param {'sm'|'md'|'lg'} size - sm for cart/table, md for product cards, lg for detail page
 */
const ImagePlaceholder = ({ size = 'md', name = '' }) => {
    const initial = name ? name.charAt(0).toUpperCase() : '✦';

    return (
        <div className={`img-placeholder-wrap img-placeholder-${size}`}>
            <svg className="placeholder-pattern" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <defs>
                    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                        <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(184,147,90,0.12)" strokeWidth="0.5" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
            <div className="placeholder-content">
                <span className="placeholder-initial">{initial}</span>
                <span className="placeholder-label">No Image</span>
            </div>
        </div>
    );
};

export default ImagePlaceholder;
