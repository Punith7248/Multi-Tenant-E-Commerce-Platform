import React from "react";
import "./VendorPage.css";

const VendorPage = () => {
  const handleManageProducts = () => {
    alert("Manage Products clicked");
  };

  const handleViewOrders = () => {
    alert("View Orders clicked");
  };

  const handleStoreProfile = () => {
    alert("Store Profile clicked");
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
            <p>0</p>
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

        <section className="management">
          <h2>Vendor Management</h2>

          <button onClick={handleManageProducts}>
            Manage Products
          </button>

          <button onClick={handleViewOrders}>
            View Orders
          </button>

          <button onClick={handleStoreProfile}>
            Store Profile
          </button>
        </section>

      </main>

    </div>
  );
};

export default VendorPage;
