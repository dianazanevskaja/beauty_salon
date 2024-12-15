import React, { useState } from 'react';
import '../../styles/Gallery.css';
import hair1 from './hair1.jpg';
import hair2 from './hair2.jpg';
import hair3 from './hair3.jpg';
import makeup1 from './makeup1.jpg';
import makeup2 from './makeup2.jpg';
import makeup3 from './makeup3.jpg';
import skincare1 from './skincare1.jpg';
import skincare2 from './skincare2.jpg';
import massage1 from './massage1.jpg';
import massage2 from './massage2.jpeg';
import eyebrows1 from './eyebrows1.jpg';
import eyebrows2 from './eyebrows2.jpg';
import lashes1 from './lashes1.jpg';
import lashes2 from './lashes2.jpg';
import manicure from './manicure.jpg';
import manicure1 from './manicure1.jpg';
import manicure2 from './manicure2.jpg';
import manicure3 from './manicure3.jpg';
import pedicure1 from './pedicure1.jpg';
import pedicure2 from './pedicure2.jpg';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const images = [hair1, hair2, hair3, makeup1, makeup2, makeup3, skincare1, skincare2, massage1, massage2, eyebrows1, eyebrows2, lashes1, lashes2, manicure, manicure1, manicure2, manicure3, pedicure1, pedicure2];

  const handleImageClick = (index) => {
    setSelectedImage(index);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <section className="gallery">
      <div className="gallery-images">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Image ${index + 1}`}
            onClick={() => handleImageClick(index)}
            className="gallery-image"
          />
        ))}
      </div>
      {selectedImage !== null && (
        <div className="modal" onClick={handleCloseModal}>
          <div className="modal-content">
            <img src={images[selectedImage]} alt={`Image ${selectedImage + 1}`} />
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;