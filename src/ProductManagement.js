import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { v4 as uuidv4 } from 'uuid';
import Product from './Product.js';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [updatedCategoryName, setUpdatedCategoryName] = useState('');
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const addProduct = (product) => {
    setProducts([...products, { ...product, id: uuidv4() }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addProduct({
      name: e.target.name.value,
      price: e.target.price.value,
      stock: e.target.stock.value,
      category: e.target.category.value,
    });

    // Reset the form
    e.target.reset();
  };

  const updateProduct = (productId, updatedProduct) => {
    setProducts(
      products.map((product) =>
        product.id === productId ? updatedProduct : product
      )
    );
    setEditingProduct(null);
  };

  const deleteProduct = (productId) => {
    setProducts(products.filter((product) => product.id !== productId));
    setEditingProduct(null);
  };

  const startEditingProduct = (id) => {
    setEditingProduct(id);
  };

  const addCategory = (categoryName) => {
    setCategories([...categories, { name: categoryName, id: uuidv4() }]);


  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    addProduct({
      name: e.target.name.value,
      price: e.target.price.value,
      stock: e.target.stock.value,
      category: e.target.category.value,
    });


    e.target.reset();
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    const categoryName = e.target.categoryName.value;
    addCategory(categoryName);


  e.target.reset();
  };

  const startEditingCategory = (categoryId) => {
    setEditingCategory(categoryId);
    setUpdatedCategoryName(
      categories.find((category) => category.id === categoryId).name
    );
  };

  const cancelEditingCategory = () => {
    setEditingCategory(null);
    setUpdatedCategoryName('');
  };

  const updateCategory = (categoryId) => {
    setCategories(
      categories.map((category) =>
        category.id === categoryId
          ? { ...category, name: updatedCategoryName }
          : category
      )
    );
    setEditingCategory(null);
    setUpdatedCategoryName('');
  };

  const deleteCategory = (categoryId) => {
    setCategories(categories.filter((category) => category.id !== categoryId));
    setEditingCategory(null);
    setUpdatedCategoryName('');
  };

  const addToCart = (product) => {
    if (product.stock > 0) {
      setCart([...cart, product]);
      updateProduct(product.id, { ...product, stock: product.stock - 1 });
      
      
      if (product.stock - 1 === 0) {
        deleteProduct(product.id);
      }
    }
  };

  const calculateTotalAmount = () => {
    const total = cart.reduce((acc, product) => acc + parseFloat(product.price), 0);
    setTotalAmount(total);
  };

  const completeTransaction = () => {
    setTransactions([...transactions, ...cart]);
    setCart([]);
    setTotalAmount(0);
  };

  // New function to sort transactions by count
  const sortTransactionsByCount = () => {
    const sortedTransactions = transactions.slice().sort((a, b) => b.stock - a.stock);
    setTransactions(sortedTransactions);
  };

  useEffect(() => {
    // Update the current date and time
    setCurrentDateTime(new Date());
  }, [transactions]); // Update when transactions change

  return (
    <div>
      <Tabs>
        <TabList>
          <Tab>Add Product</Tab>
          
          <Tab>Transaction Report</Tab>
          <Tab>Product List</Tab>
          <Tab>Transaction Management</Tab>
          
        </TabList>

        <TabPanel>
          <form onSubmit={handleProductSubmit} >
            <input type="text" name="name" placeholder="Product Name" required />
            <input type="number" name="price" placeholder="Product Price" required />
            <input type="number" name="stock" placeholder="Product Stock" required />
            <select name="category" required>
              <option value="">Select a Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <button type="submit">Add Product</button>
           
          </form>
          <form onSubmit={handleCategorySubmit}>
            <input type="text" name="categoryName" placeholder="Category Name" required />
            <button type="submit">Add Category</button>
          </form>

          <div>
            <h2>Categories</h2>
            <ul>
              {categories.map((category) => (
                <li key={category.id}>
                  {editingCategory === category.id ? (
                    <div>
                      <input
                        type="text"
                        value={updatedCategoryName}
                        onChange={(e) => setUpdatedCategoryName(e.target.value)}
                      />
                      <button onClick={() => updateCategory(category.id)}>Save</button>
                      <button onClick={cancelEditingCategory}>Cancel</button>
                    </div>
                  ) : (
                    <div>
                      {category.name}
                      <button onClick={() => startEditingCategory(category.id)}>Update</button>
                      <button onClick={() => deleteCategory(category.id)}>Delete</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </TabPanel>
       
        <TabPanel>
          <div>
            <h2>Transaction Report</h2>
           
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Category</th>
                  <th>Current Date and Time</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.name}</td>
                    <td>{transaction.price}</td>
                    <td>{transaction.stock}</td>
                    <td>{transaction.category}</td>
                    <td>{currentDateTime.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={sortTransactionsByCount}>Sort by Transaction Count</button>
          </div>
        </TabPanel>
        <TabPanel>
          <div>
            <h2>Product List</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.stock}</td>
                    <td>{product.category}</td>
                    <td>
                      <button onClick={() => startEditingProduct(product.id)}>Edit</button>
                      <button onClick={() => deleteProduct(product.id)}>Delete</button>
                      <button onClick={() => addToCart(product)}>Add to Cart</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabPanel>
        <TabPanel>
          <div>
            <h2>Transaction Management</h2>
            <ul>
              {cart.map((item, index) => (
                <li key={index}>{item.name}</li>
              ))}
            </ul>
            <p>Total Amount: ₱{totalAmount.toFixed(2)}</p>
            <button onClick={calculateTotalAmount}>Calculate Total</button>
            <button onClick={completeTransaction}>Complete Transaction</button>
          </div>
        </TabPanel>
        
      </Tabs>

    </div>
  );
};

export default ProductManagement;