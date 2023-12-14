import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';

const ProductCard = ({ product, onEdit, onDelete, onAddToCart, imageUrl }) => {
  const [localImageUrl, setLocalImageUrl] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setLocalImageUrl(e.target.result); // Update state with image URL
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    // Update the image URL whenever the product changes
    setLocalImageUrl(product.image || ''); // Assuming product.image contains the image data
  }, [product.image]);

  return (
    <Card style={{ width: '18rem', marginBottom: '15px', marginLeft: '10px' }}>
      <Card.Body className="text-center">
        <Card.Title>{product.name}</Card.Title>
        {(localImageUrl || imageUrl) && (
          <img
            src={
              typeof localImageUrl === 'string'
                ? localImageUrl
                : URL.createObjectURL(localImageUrl)
            }
            alt="Product"
            style={{ MAxwidth: '50%', height: '120px', marginBottom: '10px' }}
          />
        )}
        <Card.Text>
          Price: ₱{product.price} <br />
          Stock: {product.stock} <br />
          Category: {product.category}
        </Card.Text>
        <div className="btn-group">
          <button onClick={() => onEdit(product.id)} className="btn btn-primary btn-sm ">
            Update
          </button>
          <button onClick={() => onDelete(product.id)} className="btn btn-danger btn-sm">
            Delete
          </button>
          <button onClick={() => onAddToCart(product)} className="btn btn-success btn-sm text-danger bg-warning">
            Order Now
          </button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;