import React, { useState } from "react";
import "./VendorPage.css";

const VendorPage = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Sample Product",
      category: "General",
      price: 999,
      stock: 10,
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
  });

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddProduct = (e) => {
    e.preventDefault();

    const newProduct = {
      id: products.length + 1,
      name: product.name,
      category: product.category,
      price: Number(product.price),
      stock: Number(product.stock),
    };

    setProducts([...products, newProduct]);

    setProduct({
      name: "",
      category: "",
      price: "",
      stock: "",
    });

    setShowForm(false);
  };

  const handleDelete = (id) => {
    setProducts(products.filter((item) => item.id !== id));
  };

  return (
    <div className="vendor-page">

      <header className="vendor-header">
        <h1>Vendor Dashboard</h1>
        <p>Manage your store, products and orders from one place.</p>
      </header>

      <main>

        {/* Dashboard Overview */}
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

        {/* Product Management */}
        <section className="management">

          <h2>Product Management</h2>

          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Close Form" : "Add Product"}
          </button>

          {/* Add Product Form */}
          {showForm && (
            <form onSubmit={handleAddProduct}>

              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={product.name}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="category"
                placeholder="Category"
                value={product.category}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="price"
                placeholder="Price"
                value={product.price}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={product.stock}
                onChange={handleChange}
                required
              />

              <button type="submit">
                Save Product
              </button>

            </form>
          )}

          {/* Product List */}
          <div>
            <h3>Product List</h3>

            {products.map((item) => (
              <div key={item.id}>

                <h4>{item.name}</h4>

                <p>Category: {item.category}</p>

                <p>Price: ₹{item.price}</p>

                <p>Stock: {item.stock}</p>

                <button onClick={() => handleDelete(item.id)}>
                  Delete
                </button>

              </div>
            ))}

          </div>

        </section>

      </main>

    </div>
  );
};

export default VendorPage;
