import React, { useState, useEffect } from 'react';

const StocksEdit = ({ product, onSubmit }) => {
  const [formProduct, setFormProduct] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    setFormProduct(product || {});
    setIsEditMode(!!product);
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormProduct({ ...formProduct, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formProduct);
    }
    setFormProduct({});
    setIsEditMode(false);
  };

  return (
    <div>
      <form onSubmit={(e) => handleFormSubmit(e)}>
        <input
          type="number"
          name="stock"
          placeholder="Product Stock"
          value={formProduct.stock || ''}
          onChange={handleChange}
          required
          className='form-control mb-3'
        />
        <button type="submit" className='btn btn-success'>
          {isEditMode ? 'Update Stock' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default StocksEdit;
