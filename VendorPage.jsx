import React from "react";

const VendorPage = () => {
  return (
    <div>
      <h1>Vendor Dashboard</h1>
      <p>Welcome to the Vendor Page</p>
    </div>
  );
};

export default VendorPage;
import React from "react";

const VendorPage = () => {
  return (
    <div>
      <header>
        <h1>Vendor Dashboard</h1>
        <p>Manage your store from one place</p>
      </header>

      <main>
        <section>
          <h2>Overview</h2>

          <div>
            <h3>Total Products</h3>
            <p>0</p>
          </div>

          <div>
            <h3>Total Orders</h3>
            <p>0</p>
          </div>

          <div>
            <h3>Total Sales</h3>
            <p>₹0</p>
          </div>
        </section>

        <section>
          <h2>Vendor Management</h2>

          <button>Manage Products</button>
          <button>View Orders</button>
          <button>Store Profile</button>
        </section>
      </main>
    </div>
  );
};

export default VendorPage;
