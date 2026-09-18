import React, { useState } from "react";
import "./VendorPage.css";

const VendorPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Wireless Headphones",
      category: "Electronics",
      price: "₹2,499",
      stock: 25,
    },
    {
      id: 2,
      name: "Smart Watch",
      category: "Electronics",
      price: "₹3,999",
      stock: 18,
    },
    {
      id: 3,
      name: "Cotton T-Shirt",
      category: "Fashion",
      price: "₹799",
      stock: 40,
    },
  ]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Electronics",
    price: "",
    stock: "",
  });

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  const handleInputChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddProduct = (e) => {
    e.preventDefault();

    if (
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.stock
    ) {
      alert("Please fill all product details.");
      return;
    }

    const product = {
      id: Date.now(),
      name: newProduct.name,
      category: newProduct.category,
      price: `₹${newProduct.price}`,
      stock: Number(newProduct.stock),
    };

    setProducts([...products, product]);

    setNewProduct({
      name: "",
      category: "Electronics",
      price: "",
      stock: "",
    });

    setShowForm(false);
  };

  const handleEdit = (product) => {
    alert(`Edit product: ${product.name}`);
  };

  const handleDelete = (product) => {
    const updatedProducts = products.filter(
      (item) => item.id !== product.id
    );

    setProducts(updatedProducts);
  };

  return (
    <div className="vendor-page">

      <header className="vendor-header">
        <h1>Vendor Dashboard</h1>
        <p>Manage your store, products and orders from one place.</p>
      </header>

      <main>

        <section className="overview">

          <div className="stat-card">
            <h3>Total Products</h3>
            <p>{products.length}</p>
          </div>

          <div className="stat-card">
            <h3>Total Orders</h3>
            <p>0</p>
          </div>

          <div className="stat-card">
            <h3>Total Sales</h3>
            <p>₹0</p>
          </div>

        </section>

        <section className="product-management">

          <div className="section-header">

            <div>
              <h2>Product Management</h2>
              <p>Search and manage your store products.</p>
            </div>

            <button
              className="add-product"
              onClick={() => setShowForm(true)}
            >
              + Add Product
            </button>

          </div>

          <div className="product-filters">

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
            </select>

          </div>

          <div className="product-grid">

            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (

                <div className="product-card" key={product.id}>

                  <div className="product-icon">
                    🛍️
                  </div>

                  <h3>{product.name}</h3>

                  <p className="category">
                    {product.category}
                  </p>

                  <div className="product-details">
                    <span>Price</span>
                    <strong>{product.price}</strong>
                  </div>

                  <div className="product-details">
                    <span>Stock</span>
                    <strong>{product.stock}</strong>
                  </div>

                  <div className="product-actions">

                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(product)}
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))
            ) : (
              <p className="no-products">
                No products found.
              </p>
            )}

          </div>

        </section>

      </main>

      {showForm && (
        <div className="modal-overlay">

          <div className="product-form">

            <h2>Add New Product</h2>
            <p>Enter the details of your new product.</p>

            <form onSubmit={handleAddProduct}>

              <label>Product Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter product name"
                value={newProduct.name}
                onChange={handleInputChange}
              />

              <label>Category</label>

              <select
                name="category"
                value={newProduct.category}
                onChange={handleInputChange}
              >
                <option value="Electronics">
                  Electronics
                </option>

                <option value="Fashion">
                  Fashion
                </option>
              </select>

              <label>Price</label>

              <input
                type="number"
                name="price"
                placeholder="Enter price"
                value={newProduct.price}
                onChange={handleInputChange}
              />

              <label>Stock</label>

              <input
                type="number"
                name="stock"
                placeholder="Enter stock quantity"
                value={newProduct.stock}
                onChange={handleInputChange}
              />

              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                >
                  Add Product
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default VendorPage;
