import React, { useState } from 'react';
import axios from 'axios';

const ImageUploader = () => {
  const [images, setImages] = useState([]);
console.log(images)
  const handleImageUpload = (event) => {
    const newImages = Array.from(event.target.files).map((file) => ({
      url: URL.createObjectURL(file),
      file: file,
      id: Math.random().toString(36).substring(7), // Generate a unique ID for each image
    }));
    setImages([...images, ...newImages]);
  };

  const handleRemoveImage = (id) => {
    const updatedImages = images.filter((image) => image.id !== id);
    setImages(updatedImages);
  };

  const handleSubmit = async () => {
    try {
      // Assuming 'uploadImages' is your backend endpoint
      await axios.post('/uploadImages', { images });
      console.log('Images uploaded successfully');
    } catch (error) {
      console.error('Error uploading images', error);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
      <div>
        {images.map((image) => (
          <div key={image.id}>
            <img src={image.url} alt="Uploaded" style={{ width: '100px', height: '100px' }} />
            <button onClick={() => handleRemoveImage(image.id)}>Remove</button>
          </div>
        ))}
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default ImageUploader;
