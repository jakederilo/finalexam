import React, { useState, useEffect } from 'react';

const Product = ({ product, categories, onSubmit }) => {
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
          type="text"
          name="name"
          placeholder="Product Name"
          value={formProduct.name || ''}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Product Price"
          value={formProduct.price}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="Product Stock"
          value={formProduct.stock || ''}
          onChange={handleChange}
          required
        />
        <select
          name="category"
          value={formProduct.category || ''}
          onChange={handleChange}
          required
        >
          <option value="">Select a Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <button type="submit">{isEditMode ? 'Save Changes' : 'Add Product'}</button>
      </form>

     
    </div>
  );
};

export default Product;