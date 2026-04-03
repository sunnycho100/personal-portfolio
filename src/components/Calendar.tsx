const galleryItems = [
    { src: '/profile-image.jpg', label: 'Madison, WI' },
    { src: '/books/zero-to-one.jpg', label: 'Favorite Read' },
    { src: '/books/unstoppable.png', label: 'Inspiration' },
    { src: '/books/technological-republic.jpg', label: 'Tech & Society' },
];

const Gallery = () => {
    return (
        <div className="card gallery-card">
            <div className="card-top">
                <h3>Gallery</h3>
                <span className="gallery-count">{galleryItems.length} photos</span>
            </div>
            <div className="gallery-grid">
                {galleryItems.map((item, i) => (
                    <div key={i} className={`gallery-item ${i === 0 ? 'gallery-featured' : ''}`}>
                        <img src={item.src} alt={item.label} />
                        <div className="gallery-label">{item.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gallery;
