import React from "react";
import "./VendorPage.css";

const VendorPage = () => {
  const products = [
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
  ];

  const handleEdit = (product) => {
    alert(`Edit product: ${product.name}`);
  };

  const handleDelete = (product) => {
    alert(`Delete product: ${product.name}`);
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
            <p>3</p>
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
              <p>Manage your store products.</p>
            </div>

            <button className="add-product">
              + Add Product
            </button>
          </div>

          <div className="product-grid">
            {products.map((product) => (
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
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

export default VendorPage;
