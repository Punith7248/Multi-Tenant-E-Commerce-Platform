import React, { useEffect, useState } from "react";
import "./VendorPage.css";

const VendorPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Default");

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Wireless Headphones",
      category: "Electronics",
      price: "₹2,499",
      stock: 25,
      icon: "🎧",
    },
    {
      id: 2,
      name: "Smart Watch",
      category: "Electronics",
      price: "₹3,999",
      stock: 8,
      icon: "⌚",
    },
    {
      id: 3,
      name: "Cotton T-Shirt",
      category: "Fashion",
      price: "₹799",
      stock: 40,
      icon: "👕",
    },
    {
      id: 4,
      name: "Running Shoes",
      category: "Fashion",
      price: "₹1,999",
      stock: 0,
      icon: "👟",
    },
  ]);

  const [productForm, setProductForm] = useState({
    name: "",
    category: "Electronics",
    price: "",
    stock: "",
    icon: "🎧",
  });

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  const totalProducts = products.length;

  const inStockProducts = products.filter(
    (product) => product.stock > 10
  ).length;

  const lowStockProducts = products.filter(
    (product) =>
      product.stock > 0 && product.stock <= 10
  ).length;

  const outOfStockProducts = products.filter(
    (product) => product.stock === 0
  ).length;

  const totalInventoryUnits = products.reduce(
    (total, product) => total + product.stock,
    0
  );

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

  const getProductIcon = (product) => {
    if (product.icon) {
      return product.icon;
    }

    if (product.category === "Electronics") {
      return "🎧";
    }

    if (product.category === "Fashion") {
      return "👕";
    }

    return "🛍️";
  };

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        product.category === category;

      const matchesStock =
        stockFilter === "All" ||
        (stockFilter === "In Stock" &&
          product.stock > 10) ||
        (stockFilter === "Low Stock" &&
          product.stock > 0 &&
          product.stock <= 10) ||
        (stockFilter === "Out of Stock" &&
          product.stock === 0);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStock
      );
    })
    .sort((a, b) => {
      if (sortBy === "Name A-Z") {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === "Name Z-A") {
        return b.name.localeCompare(a.name);
      }

      if (sortBy === "Price Low-High") {
        return (
          Number(a.price.replace(/[₹,]/g, "")) -
          Number(b.price.replace(/[₹,]/g, ""))
        );
      }

      if (sortBy === "Price High-Low") {
        return (
          Number(b.price.replace(/[₹,]/g, "")) -
          Number(a.price.replace(/[₹,]/g, ""))
        );
      }

      if (sortBy === "Stock Low-High") {
        return a.stock - b.stock;
      }

      if (sortBy === "Stock High-Low") {
        return b.stock - a.stock;
      }

      return 0;
    });

  const hasActiveFilters =
    search.trim() !== "" ||
    category !== "All" ||
    stockFilter !== "All" ||
    sortBy !== "Default";

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setStockFilter("All");
    setSortBy("Default");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setProductForm({
      ...productForm,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;

    let defaultIcon = "🎧";

    if (newCategory === "Fashion") {
      defaultIcon = "👕";
    }

    setProductForm({
      ...productForm,
      category: newCategory,
      icon: defaultIcon,
    });

    setErrors({
      ...errors,
      category: "",
    });
  };

  const validateForm = () => {
    const newErrors = {};

    const productName = productForm.name.trim();
    const price = Number(productForm.price);
    const stock = Number(productForm.stock);

    if (!productName) {
      newErrors.name = "Product name is required.";
    } else if (productName.length < 3) {
      newErrors.name =
        "Product name must be at least 3 characters.";
    }

    if (!productForm.price) {
      newErrors.price = "Price is required.";
    } else if (price <= 0) {
      newErrors.price =
        "Price must be greater than ₹0.";
    }

    if (productForm.stock === "") {
      newErrors.stock = "Stock quantity is required.";
    } else if (stock < 0) {
      newErrors.stock =
        "Stock quantity cannot be negative.";
    }

    if (!productForm.icon) {
      newErrors.icon = "Please select a product icon.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const openAddForm = () => {
    setEditingProduct(null);

    setProductForm({
      name: "",
      category: "Electronics",
      price: "",
      stock: "",
      icon: "🎧",
    });

    setErrors({});
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);

    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price
        .replace("₹", "")
        .replace(",", ""),
      stock: product.stock,
      icon: product.icon || "🛍️",
    });

    setErrors({});
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const cleanName = productForm.name.trim();

    if (editingProduct) {
      const updatedProducts = products.map(
        (product) =>
          product.id === editingProduct.id
            ? {
                ...product,
                name: cleanName,
                category: productForm.category,
                price: `₹${productForm.price}`,
                stock: Number(productForm.stock),
                icon: productForm.icon,
              }
            : product
      );

      setProducts(updatedProducts);

      setSuccessMessage(
        `${cleanName} updated successfully.`
      );
    } else {
      const newProduct = {
        id: Date.now(),
        name: cleanName,
        category: productForm.category,
        price: `₹${productForm.price}`,
        stock: Number(productForm.stock),
        icon: productForm.icon,
      };

      setProducts([...products, newProduct]);

      setSuccessMessage(
        `${cleanName} added successfully.`
      );
    }

    closeForm();
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setErrors({});

    setProductForm({
      name: "",
      category: "Electronics",
      price: "",
      stock: "",
      icon: "🎧",
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

    setSuccessMessage(
      `${deleteProduct.name} deleted successfully.`
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
          Manage your store, products and inventory
          from one place.
        </p>
      </header>

      <main>

        {successMessage && (
          <div className="success-message">
            <span>✓</span>

            <p>{successMessage}</p>

            <button
              onClick={() => setSuccessMessage("")}
              aria-label="Close message"
            >
              ×
            </button>
          </div>
        )}

        <section className="overview">

          <div className="stat-card">
            <h3>Total Products</h3>
            <p>{totalProducts}</p>
          </div>

          <div className="stat-card">
            <h3>In Stock</h3>
            <p>{inStockProducts}</p>
          </div>

          <div className="stat-card">
            <h3>Low Stock</h3>
            <p>{lowStockProducts}</p>
          </div>

          <div className="stat-card">
            <h3>Out of Stock</h3>
            <p>{outOfStockProducts}</p>
          </div>

          <div className="stat-card">
            <h3>Inventory Units</h3>
            <p>{totalInventoryUnits}</p>
          </div>

        </section>

        <section className="product-management">

          <div className="section-header">

            <div>
              <h2>Product Management</h2>

              <p>
                Search, filter and sort your store
                products.
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
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
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

            <select
              value={stockFilter}
              onChange={(e) =>
                setStockFilter(e.target.value)
              }
            >
              <option value="All">
                All Stock
              </option>

              <option value="In Stock">
                In Stock
              </option>

              <option value="Low Stock">
                Low Stock
              </option>

              <option value="Out of Stock">
                Out of Stock
              </option>
            </select>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
            >
              <option value="Default">
                Sort By
              </option>

              <option value="Name A-Z">
                Name A-Z
              </option>

              <option value="Name Z-A">
                Name Z-A
              </option>

              <option value="Price Low-High">
                Price Low-High
              </option>

              <option value="Price High-Low">
                Price High-Low
              </option>

              <option value="Stock Low-High">
                Stock Low-High
              </option>

              <option value="Stock High-Low">
                Stock High-Low
              </option>
            </select>

          </div>

          <div className="product-count">
            Showing {filteredProducts.length} of{" "}
            {products.length} products
          </div>

          <div className="product-grid">

            {filteredProducts.length > 0 ? (

              filteredProducts.map((product) => {

                const stockStatus =
                  getStockStatus(product.stock);

                return (
                  <div
                    className="product-card"
                    key={product.id}
                  >

                    <div className="product-card-top">

                      <div className="product-icon">
                        {getProductIcon(product)}
                      </div>

                      <span className="category-badge">
                        {product.category}
                      </span>

                    </div>

                    <h3>{product.name}</h3>

                    <div className="product-details">
                      <span>Price</span>

                      <strong>
                        {product.price}
                      </strong>
                    </div>

                    <div className="product-details">
                      <span>Stock</span>

                      <strong>
                        {product.stock} units
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

              <div className="empty-state">

                <div className="empty-state-icon">
                  🔍
                </div>

                <h3>No Products Found</h3>

                <p>
                  We couldn't find any products
                  matching your current filters.
                </p>

                {hasActiveFilters && (
                  <button
                    className="clear-filters-btn"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </button>
                )}

              </div>

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

              {errors.name && (
                <span className="form-error">
                  {errors.name}
                </span>
              )}

              <label>
                Category
              </label>

              <select
                name="category"
                value={productForm.category}
                onChange={handleCategoryChange}
              >
                <option value="Electronics">
                  Electronics
                </option>

                <option value="Fashion">
                  Fashion
                </option>
              </select>

              <label>
                Product Icon
              </label>

              <div className="icon-selector">

                {[
                  "🎧",
                  "⌚",
                  "📱",
                  "💻",
                  "👕",
                  "👟",
                  "👜",
                  "🧢",
                ].map((icon) => (
                  <button
                    type="button"
                    key={icon}
                    className={`icon-option ${
                      productForm.icon === icon
                        ? "selected-icon"
                        : ""
                    }`}
                    onClick={() =>
                      setProductForm({
                        ...productForm,
                        icon,
                      })
                    }
                  >
                    {icon}
                  </button>
                ))}

              </div>

              {errors.icon && (
                <span className="form-error">
                  {errors.icon}
                </span>
              )}

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

              {errors.price && (
                <span className="form-error">
                  {errors.price}
                </span>
              )}

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

              {errors.stock && (
                <span className="form-error">
                  {errors.stock}
                </span>
              )}

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
