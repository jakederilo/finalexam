import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { v4 as uuidv4 } from 'uuid';
import Product from './Product';
import SalesChart from './SalesChart';
import StockChart from './StockChart';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Card } from 'react-bootstrap';
import ProductCard from './ProductCard'; 




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
  const [showModal, setShowModal] = useState(false);
  const [modalProduct, setModalProduct] = useState({});
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  
 
  const handleOpenModal = () => {
    setModalProduct({});
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target.result); // Update state with image URL
    };
    reader.readAsDataURL(file);
  };

  

  


  const addProduct = (product) => {
    setProducts([...products, { ...product, id: uuidv4(), image: imageUrl }]);
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
    if (!buyerName.trim()) {
      alert("Please enter the buyer's name before completing the transaction.");
      return;
    }
  
    const transactionDetails = {
      buyerName: buyerName,
      items: cart.map((item) => ({ ...item, quantity: 1 })),
      date: new Date(),
    };
  
    setTransactions([...transactions, transactionDetails]);
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
  
// Sorting function based on total quantity for Transaction Report
const sortPurchasersByQuantity = () => {
  const sortedBuyers = purchasers.slice().sort((a, b) => {
    const totalQuantityA = a.items.reduce((acc, item) => acc + (item.quantity || 0), 0);
    const totalQuantityB = b.items.reduce((acc, item) => acc + (item.quantity || 0), 0);

    // Change the comparison based on the sortOrder
    return sortOrder === 'asc' ? totalQuantityA - totalQuantityB : totalQuantityB - totalQuantityA;
  });

  // Update purchasers with sorted data
  setPurchasers(sortedBuyers);
};

// Toggle sorting order for Transaction Report
const toggleSortOrderForPurchasers = () => {
  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  sortPurchasersByQuantity(); // Call the sorting function after changing the sortOrder
};
  

  const sortTransactionsByDateTime = () => {
    const sortedTransactions = transactions.slice().sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      return dateB - dateA;
    });
  
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
    <div className="container mt-5">
      <Tabs style={{bg: 'danger' }}>
        <TabList className="navbar nav-tabs ">
          <Tab className="nav-item nav-link text-dark btn bg-danger text-white ">Product Management</Tab>
          <Tab className="nav-item nav-link text-dark btn">Stock List</Tab>
          <Tab className="nav-item nav-link text-dark btn">Transaction Management</Tab>
          <Tab className="nav-item nav-link text-dark btn">Transaction Report</Tab>
        </TabList>

        <TabPanel>
          <button onClick={handleOpenModal} className="btn btn-primary mb-5">
            Add Product
          </button>

          <h2 className="mb-3">Product Management</h2>

          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Add Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleProductSubmit}>
                <div className="mb-3">
                  <label htmlFor="productName" className="form-label">
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="productName"
                    name="name"
                    placeholder="Product Name"
                    required
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="productPrice" className="form-label">
                    Product Price
                  </label>
                  <input
                    type="number"
                    id="productPrice"
                    name="price"
                    placeholder="Product Price"
                    required
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="productStock" className="form-label">
                    Product Stock
                  </label>
                  <input
                    type="number"
                    id="productStock"
                    name="stock"
                    placeholder="Product Stock"
                    required
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="productCategory" className="form-label">
                    Product Category
                  </label>
                  <select id="productCategory" name="category" required className="form-select">
                    <option value="">Select a Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
              <div className="mb-3">
              <label htmlFor="productImage" className="form-label" id="ProductImage">
                Product Image
              </label>
              <input
              type="file"
              id="productImage"
              name="image"
              onChange={handleFileChange}
              accept="image/*"
              className="form-control"
                />
              </div>
                <button type="submit" className="btn btn-primary mb-5">
                  Add Product
                </button>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        

          <form onSubmit={handleCategorySubmit} className="mb-3">
            <div className="mb-3">
              <label htmlFor="categoryName" className="form-label">Category Name</label>
              <input type="text" id="categoryName" name="categoryName" placeholder="Category Name" required className="form-control" />
            </div>
            <button type="submit" className="btn btn-primary mb-5">Add Category</button>
          </form>

          <div>
            <h2>Categories</h2>
            <ul className="list-group mt-3">
              {categories.map((category) => (
                <li key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
                  {editingCategory === category.id ? (
                    <div className="d-flex align-items-center">
                      <input
                        type="text"
                        value={updatedCategoryName}
                        onChange={(e) => setUpdatedCategoryName(e.target.value)}
                        className="form-control me-2"
                      />
                      <button onClick={() => updateCategory(category.id)} className="btn btn-success">Save</button>
                      <button onClick={cancelEditingCategory} className="btn btn-warning">Cancel</button>
                    </div>
                  ) : (
                    <div className='d-flex align-items-center justify-content-between w-100'>
                      <span>{category.name}</span>
                      <div className='mx-'>
                        
                        <button onClick={() => startEditingCategory(category.id)} className="btn btn-success mx-2">Update</button>
                        <button onClick={() => deleteCategory(category.id)} className="btn btn-danger">Delete</button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </TabPanel>

        <TabPanel>
      <div className="mt-3">
        <h2>Product List</h2>
        

        <div className="d-flex flex-wrap">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={startEditingProduct}
              onDelete={deleteProduct}
              onAddToCart={addToCart}
              
            />
          ))}
        </div>

       
{editingProduct && (
  <Product
    product={products.find((product) => product.id === editingProduct)}
    categories={categories}
    onSubmit={(updatedProduct) => updateProduct(editingProduct, updatedProduct)}
    image={products.find((product) => product.id === editingProduct).image}
  />
)}
      </div>
    </TabPanel>
        <TabPanel>
          <div className="mt-3">
            <h2>Transaction Management</h2>
            <form>
              <div className="mb-3">
                <label htmlFor="buyerName" className="form-label">Buyer's Name:</label>
                <input
                  type="text"
                  id="buyerName"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="form-control"
                />
              </div>
            </form>
            <ul className="list-group mt-3">
              {cart.map((item, index) => (
                <li key={index} className="list-group-item">
                  {item.name} - Quantity: {item.quantity}
                </li>
              ))}
            </ul>
            <p>Total Quantity: {calculateTotalQuantity()}</p>
            <p>Total Amount: ₱{totalAmount.toFixed(2)}</p>
            <button onClick={calculateTotalAmount} className="btn btn-warning mx-2">Calculate Total</button>
            <button onClick={completeTransaction} className="btn btn-primary">Complete Transaction</button>
          </div>
        </TabPanel>

   
        <TabPanel>
          <div className="mt-3">
            <h2>Transaction Report</h2>
            {/* Add sorting button */}
            <button onClick={toggleSortOrderForPurchasers} className="btn btn-primary">
              Sort by Quantity ({sortOrder === 'asc' ? 'Least to Most' : 'Most to Least'})
            </button>
            <table className="table table-striped">
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
                    {transaction.items
                      .reduce((acc, item) => {
                        const existingItem = acc.find((accItem) => accItem.id === item.id);

                        if (existingItem) {
                          existingItem.quantity += item.quantity || 0;
                        } else {
                          acc.push({ ...item });
                        }

                        return acc;
                      }, [])
                      .map((aggregatedItem, subIndex) => (
                        <tr key={subIndex}>
                          <td>{transaction.buyerName}</td>
                          <td>{aggregatedItem.name}</td>
                          <td>{aggregatedItem.price}</td>
                          <td>{aggregatedItem.quantity}</td>
                          <td>{aggregatedItem.category}</td>
                          <td>{transaction.date.toLocaleString()}</td>
                        </tr>
                      ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          
    


    <div className="mt-3">
            <h2>Stock Chart</h2>
            {/* Pass the products data to the StockChart component */}
            <StockChart products={products} />
          </div>
          <div className="mt-3">
            <h2>Sales Chart</h2>
            {/* Pass the transactions data to the SalesChart component */}
            <SalesChart transactions={transactions} />
            </div>
  </div>
</TabPanel>

      </Tabs>
    </div>
  );
};

export default ProductManagement;