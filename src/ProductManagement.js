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
  const [buyerName, setBuyerName] = useState('');
  
  const [purchasers, setPurchasers] = useState([]);
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
      const updatedProduct = { ...product, stock: product.stock - 1 };
      setCart([...cart, { ...updatedProduct, quantity: 1 }]);
      updateProduct(product.id, updatedProduct);
  
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
    // Check if the buyer's name is not empty
    if (!buyerName.trim()) {
      alert("Please enter the buyer's name before completing the transaction.");
      return;
    }
  
    const transactionDetails = {
      buyerName: buyerName,
      items: cart.map(item => ({ ...item, quantity: 1 })),
      date: new Date(),
    };
  
    setPurchasers([...purchasers, transactionDetails]);
    setCart([]);
    setTotalAmount(0);
    setBuyerName('');
  };

  const calculateTotalQuantityForBuyer = (buyerName) => {
    const itemQuantities = {};
    const buyerTransactions = purchasers.filter(
      (transaction) => transaction.buyerName === buyerName
    );
  
    buyerTransactions.forEach((transaction) => {
      transaction.items.forEach((item) => {
        const itemName = item.name;
        const quantity = item.quantity || 0;
        itemQuantities[itemName] = (itemQuantities[itemName] || 0) + quantity;
      });
    });
  
    const totalQuantity = Object.values(itemQuantities).reduce((acc, val) => acc + val, 0);
  
    return totalQuantity;
  };
  

  const calculateOverallQuantity = () => {
    const itemQuantities = {};
  
    purchasers.forEach((transaction) => {
      transaction.items.forEach((item) => {
        const itemName = item.name;
        const quantity = item.quantity || 0;
        itemQuantities[itemName] = (itemQuantities[itemName] || 0) + quantity;
      });
    });
  
    const totalQuantity = Object.values(itemQuantities).reduce(
      (total, quantity) => total + quantity,
      0
    );
  
    return totalQuantity;
  };




  const calculateTotalQuantity = () => {
    const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
    return totalQuantity;
  };
  

  // New function to sort transactions by count
  const sortTransactionsByCount = () => {
    const sortedTransactions = transactions.slice().sort((a, b) => b.stock - a.stock);
    setTransactions(sortedTransactions);
  };

  const sortBuyersByTotalQuantity = () => {
    const sortedBuyers = purchasers.slice().sort((a, b) => {
      const totalQuantityA = calculateTotalQuantityForBuyer(a.buyerName).reduce((acc, val) => acc + val, 0);
      const totalQuantityB = calculateTotalQuantityForBuyer(b.buyerName).reduce((acc, val) => acc + val, 0);
      return totalQuantityB - totalQuantityA;
    });
  
    setPurchasers(sortedBuyers);
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
          <th>Buyer Name</th>
          <th>Name</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Category</th>
          
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {purchasers.map((transaction, index) => (
          <React.Fragment key={index}>
            <tr>
              <td>{transaction.buyerName}</td>
              <td colSpan="5"></td>
            </tr>
            {transaction.items.map((item, subIndex) => (
              <React.Fragment key={subIndex}>
                <tr>
                  <td></td>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>{item.quantity}</td>
                  <td>{item.category}</td>
                  <td>{transaction.date.toLocaleString()}</td>
                </tr>
                
              </React.Fragment>
            ))}
     
            <tr>
  <td colSpan="3"></td>
  <td>
    <p>total Quantity: {calculateTotalQuantityForBuyer(transaction.buyerName)}</p>
  </td>
  <td colSpan="2"></td>
</tr>
          </React.Fragment>
        ))}
        
      </tbody>
    </table>
   
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
            {editingProduct && (
        <Product
          product={products.find((product) => product.id === editingProduct)}
          categories={categories}
          onSubmit={(updatedProduct) =>
            updateProduct(editingProduct, updatedProduct)
          }
        />
      )}
          </div>
        </TabPanel>
        <TabPanel>
  <div>
    <h2>Transaction Management</h2>
    <form>
      <label htmlFor="buyerName">Buyer's Name:</label>
      <input
        type="text"
        id="buyerName"
        value={buyerName}
        onChange={(e) => setBuyerName(e.target.value)}
      />
    </form>
    <ul>
      {cart.map((item, index) => (
        <li key={index}>
          {item.name} - Quantity: {item.quantity}
        </li>
      ))}
    </ul>
    <p>Total Quantity: {calculateTotalQuantity()}</p>
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