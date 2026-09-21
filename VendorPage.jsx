import React, { useState } from "react";
import "./VendorPage.css";

const VendorPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);

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
      stock: 8,
    },
    {
      id: 3,
      name: "Cotton T-Shirt",
      category: "Fashion",
      price: "₹799",
      stock: 40,
    },
    {
      id: 4,
      name: "Running Shoes",
      category: "Fashion",
      price: "₹1,999",
      stock: 0,
    },
  ]);

  const [productForm, setProductForm] = useState({
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

  const getStockStatus = (stock) => {
    if (stock === 0) {
      return {
        label: "Out of Stock",
        className: "out-of-stock",
      };
    }

    if (stock <= 10) {
      return {
        label: "Low Stock",
        className: "low-stock",
      };
    }

    return {
      label: "In Stock",
      className: "in-stock",
    };
  };

  const handleInputChange = (e) => {
    setProductForm({
      ...productForm,
      [e.target.name]: e.target.value,
    });
  };

  const openAddForm = () => {
    setEditingProduct(null);

    setProductForm({
      name: "",
      category: "Electronics",
      price: "",
      stock: "",
    });

    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);

    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price.replace("₹", "").replace(",", ""),
      stock: product.stock,
    });

    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !productForm.name ||
      !productForm.price ||
      productForm.stock === ""
    ) {
      alert("Please fill all product details.");
      return;
    }

    if (Number(productForm.stock) < 0) {
      alert("Stock cannot be negative.");
      return;
    }

    if (editingProduct) {
      const updatedProducts = products.map((product) =>
        product.id === editingProduct.id
          ? {
              ...product,
              name: productForm.name,
              category: productForm.category,
              price: `₹${productForm.price}`,
              stock: Number(productForm.stock),
            }
          : product
      );

      setProducts(updatedProducts);
    } else {
      const newProduct = {
        id: Date.now(),
        name: productForm.name,
        category: productForm.category,
        price: `₹${productForm.price}`,
        stock: Number(productForm.stock),
      };

      setProducts([...products, newProduct]);
    }

    closeForm();
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);

    setProductForm({
      name: "",
      category: "Electronics",
      price: "",
      stock: "",
    });
  };

  const handleDelete = (product) => {
    setDeleteProduct(product);
  };

  const confirmDelete = () => {
    setProducts(
      products.filter(
        (item) => item.id !== deleteProduct.id
      )
    );

    setDeleteProduct(null);
  };

  const cancelDelete = () => {
    setDeleteProduct(null);
  };

  return (
    <div className="vendor-page">

      <header className="vendor-header">
        <h1>Vendor Dashboard</h1>

        <p>
          Manage your store, products and orders from one place.
        </p>
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

              <p>
                Search and manage your store products.
              </p>
            </div>

            <button
              className="add-product"
              onClick={openAddForm}
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
              <option value="All">
                All Categories
              </option>

              <option value="Electronics">
                Electronics
              </option>

              <option value="Fashion">
                Fashion
              </option>
            </select>

          </div>

          <div className="product-grid">

            {filteredProducts.length > 0 ? (

              filteredProducts.map((product) => {

                const stockStatus = getStockStatus(
                  product.stock
                );

                return (
                  <div
                    className="product-card"
                    key={product.id}
                  >

                    <div className="product-icon">
                      🛍️
                    </div>

                    <h3>{product.name}</h3>

                    <p className="category">
                      {product.category}
                    </p>

                    <div className="product-details">
                      <span>Price</span>

                      <strong>
                        {product.price}
                      </strong>
                    </div>

                    <div className="product-details">
                      <span>Stock</span>

                      <strong>
                        {product.stock}
                      </strong>
                    </div>

                    <div
                      className={`stock-status ${stockStatus.className}`}
                    >
                      {stockStatus.label}
                    </div>

                    {product.stock > 0 &&
                      product.stock <= 10 && (
                        <p className="stock-warning">
                          ⚠️ Only {product.stock}{" "}
                          item
                          {product.stock > 1
                            ? "s"
                            : ""}{" "}
                          left
                        </p>
                      )}

                    {product.stock === 0 && (
                      <p className="stock-warning">
                        ⚠️ Product is unavailable
                      </p>
                    )}

                    <div className="product-actions">

                      <button
                        className="edit-btn"
                        onClick={() =>
                          openEditForm(product)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(product)
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                );
              })

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

            <h2>
              {editingProduct
                ? "Edit Product"
                : "Add New Product"}
            </h2>

            <p>
              {editingProduct
                ? "Update your product details."
                : "Enter the details of your new product."}
            </p>

            <form onSubmit={handleSubmit}>

              <label>
                Product Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter product name"
                value={productForm.name}
                onChange={handleInputChange}
              />

              <label>
                Category
              </label>

              <select
                name="category"
                value={productForm.category}
                onChange={handleInputChange}
              >
                <option value="Electronics">
                  Electronics
                </option>

                <option value="Fashion">
                  Fashion
                </option>
              </select>

              <label>
                Price
              </label>

              <input
                type="number"
                name="price"
                placeholder="Enter price"
                min="0"
                value={productForm.price}
                onChange={handleInputChange}
              />

              <label>
                Stock
              </label>

              <input
                type="number"
                name="stock"
                placeholder="Enter stock quantity"
                min="0"
                value={productForm.stock}
                onChange={handleInputChange}
              />

              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                >
                  {editingProduct
                    ? "Save Changes"
                    : "Add Product"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {deleteProduct && (

        <div className="modal-overlay">

          <div className="product-form">

            <h2>
              Delete Product?
            </h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>
                {deleteProduct.name}
              </strong>
              ?
            </p>

            <div className="form-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={cancelDelete}
              >
                Cancel
              </button>

              <button
                type="button"
                className="delete-confirm-btn"
                onClick={confirmDelete}
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default VendorPage;
