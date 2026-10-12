import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, Store, ShoppingCart, IndianRupee, LogOut, Search, ShieldCheck, RefreshCw } from "lucide-react";
import "./SuperAdminDashboard.css";
import { api, clearAuth } from "../api";

function SuperAdminDashboard() {
  const nav = useNavigate();
  const [tab, setTab] = React.useState("customers");
  const [query, setQuery] = React.useState("");
  const [customers, setCustomers] = React.useState([]);
  const [vendors, setVendors] = React.useState([]);
  const [stats, setStats] = React.useState({ customers: 0, vendors: 0, orders: 0, sales: 0 });
  const [loading, setLoading] = React.useState(true);

  const loadData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [overview, customerRows, vendorRows] = await Promise.all([
        api("/admin/overview"),
        api("/admin/customers"),
        api("/admin/vendors"),
      ]);
      setStats(overview);
      setCustomers(customerRows);
      setVendors(vendorRows);
    } catch (err) {
      if (err.message.toLowerCase().includes("authentication") || err.message.toLowerCase().includes("token")) {
        clearAuth();
        nav("/admin-login", { replace: true });
      } else {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  }, [nav]);

  React.useEffect(() => {
    if (sessionStorage.getItem("novacart-super-admin") !== "true") nav("/admin-login", { replace: true });
    else loadData();
  }, [nav, loadData]);

  const toggleVendor = async (id, status) => {
    try {
      await api(`/admin/vendors/${id}/${status === 'inactive' ? 'activate' : 'suspend'}`, { method: 'PATCH' });
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const logout = () => {
    clearAuth();
    nav("/admin-login");
  };

  const rows = tab === "customers" ? customers : vendors;
  const filtered = rows.filter((row) => JSON.stringify(row).toLowerCase().includes(query.toLowerCase()));

  return (
    <main className="super-admin-page">
      <header className="super-admin-header">
        <div className="super-admin-brand"><span><ShieldCheck size={18}/></span> Nova<span>Cart</span> <em>SUPER ADMIN</em></div>
        <div className="super-admin-actions">
          <button title="Refresh demo data"><RefreshCw size={16}/></button>
          <button onClick={logout} className="logout-admin"><LogOut size={16}/> Logout</button>
        </div>
      </header>

      <section className="super-admin-content">
        <div className="admin-title-row">
          <div><p>CONTROL CENTER</p><h1>Platform Overview</h1><span>Manage customer and vendor data from one protected area.</span></div>
          <div className="admin-live-badge"><i></i> Admin session active</div>
        </div>

        <div className="admin-stat-grid">
          <Stat icon={<Users/>} label="Total Customers" value={stats.customers} />
          <Stat icon={<Store/>} label="Total Vendors" value={stats.vendors} />
          <Stat icon={<ShoppingCart/>} label="Orders" value={stats.orders} />
          <Stat icon={<IndianRupee/>} label="Gross Sales" value={`₹${Number(stats.sales || 0).toLocaleString("en-IN")}`} />
        </div>

        <div className="admin-data-card">
          <div className="admin-data-toolbar">
            <div className="admin-tabs">
              <button className={tab === "customers" ? "active" : ""} onClick={() => setTab("customers")}>Customer Data</button>
              <button className={tab === "vendors" ? "active" : ""} onClick={() => setTab("vendors")}>Vendor Data</button>
            </div>
            <div className="admin-search"><Search size={15}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${tab}...`} /></div>
          </div>

          <div className="admin-table-wrap">
            {loading ? <p style={{ padding: 24 }}>Loading data...</p> : tab === "customers" ? <CustomerTable rows={filtered}/> : <VendorTable rows={filtered} onToggle={toggleVendor}/>} 
          </div>
          <p className="admin-api-note">Live data from MongoDB through the NovaCart backend.</p>
        </div>
      </section>
    </main>
  );
}

function Stat({icon,label,value}) { return <div className="admin-stat"><div className="admin-stat-icon">{React.cloneElement(icon,{size:18})}</div><div><strong>{value}</strong><span>{label}</span></div></div>; }
function CustomerTable({rows}) { return <table><thead><tr><th>ID</th><th>Customer</th><th>Email</th><th>Phone</th><th>Status</th></tr></thead><tbody>{rows.map(r=><tr key={r._id}><td>{String(r._id).slice(-8)}</td><td><b>{r.fullName}</b></td><td>{r.email}</td><td>{r.phone}</td><td><Status value={r.status}/></td></tr>)}</tbody></table>; }
function VendorTable({rows, onToggle}) { return <table><thead><tr><th>ID</th><th>Store</th><th>Owner</th><th>Email</th><th>Status</th><th>Action</th></tr></thead><tbody>{rows.map(r=><tr key={r._id}><td>{String(r._id).slice(-8)}</td><td><b>{r.businessName}</b></td><td>{r.fullName}</td><td>{r.email}</td><td><Status value={r.tenantId?.status || r.status}/></td><td><button onClick={()=>onToggle(r._id,r.status)}>{r.status === "inactive" ? "Activate" : "Suspend"}</button></td></tr>)}</tbody></table>; }
function Status({value}) { return <span className={`status status-${value.toLowerCase()}`}>{value}</span>; }

export default SuperAdminDashboard;
