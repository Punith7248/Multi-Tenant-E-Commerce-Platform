import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { BarChart3, Box, Check, ChevronDown, Edit3, LogOut, Package, Plus, Search, ShoppingBag, Store, Trash2, TrendingUp, Users, X } from 'lucide-react';
import { api, clearAuth, getToken, setAuth } from './api';
import store, { addToCart, clearCart, decrement, increment, removeFromCart } from './store';
import CustomerLogin from './pages/CustomerLogin';
import CustomerSignup from './pages/CustomerSignup';
import VendorLogin from './pages/VendorLogin';
import VendorSignup from './pages/VendorSignup';
import AdminLogin from './pages/AdminLogin';
import './index.css';
import './app.css';

const money = value => `₹${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
const currentUser = () => JSON.parse(localStorage.getItem('novacart-user') || 'null');

function Shell({ children, title = 'NovaCart', user, onLogout, cartCount = 0, className = '' }) {
  return <div className={`app-shell ${className}`}><header className="app-header"><Link to="/" className="brand"><span><ShoppingBag size={18}/></span>NovaCart</Link><nav>{user?.role === 'customer' && <Link to="/customer">Shop</Link>}{user?.role === 'vendor' && <Link to="/vendor">Dashboard</Link>}{user?.role === 'super_admin' && <Link to="/super-admin">Admin</Link>}<button onClick={onLogout}><LogOut size={16}/> Logout</button>{user?.role === 'customer' && <Link className="cart-pill" to="/customer/cart"><ShoppingBag size={16}/> {cartCount}</Link>}</nav></header><main className="page-wrap"><div className="page-heading"><div><p className="eyebrow">NOVACART</p><h1>{title}</h1></div></div>{children}</main></div>;
}

function Home() {
  return <div className="landing"><div className="landing-overlay"><header className="landing-header"><Link to="/" className="brand light"><span><ShoppingBag size={18}/></span>NovaCart</Link><div><Link to="/customer-login" className="text-link">Customer Login</Link><Link to="/login" className="outline-link">Vendor Login</Link></div></header><section className="hero"><p className="eyebrow">MULTI-TENANT COMMERCE</p><h1>One place for customers.<br/><em>Many stores.</em></h1><p>Discover independent businesses, shop their products, and let every vendor run a powerful store from one platform.</p><div className="hero-actions"><Link to="/customer" className="primary-btn">Start Shopping <span>→</span></Link><Link to="/vendor-signup" className="secondary-btn">Open a Store</Link></div><div className="hero-stats"><span><b>Local</b> businesses</span><span><b>Secure</b> checkout</span><span><b>Real-time</b> orders</span></div></section><Link to="/admin-login" className="admin-login-link">Admin Login</Link></div></div>;
}

function CustomerShop() {
  const user = currentUser(); const navigate = useNavigate(); const dispatch = useDispatch();
  const items = useSelector(s => s.cart.items); const [products, setProducts] = useState([]); const [stores, setStores] = useState([]); const [q, setQ] = useState(''); const [category, setCategory] = useState(''); const [storeSlug, setStoreSlug] = useState(''); const [loading, setLoading] = useState(true);
  const load = async () => { setLoading(true); try { const [p, s] = await Promise.all([api(`/products/public?q=${encodeURIComponent(q)}&category=${encodeURIComponent(category)}&store=${encodeURIComponent(storeSlug)}`), api('/products/stores')]); setProducts(p.products); setStores(s.stores); } finally { setLoading(false); } };
  useEffect(() => { load(); }, [q, category, storeSlug]);
  const cats = [...new Set(products.map(p => p.category).filter(Boolean))];
  const add = p => { const existingTenant = items[0]?.tenantId; if (existingTenant && existingTenant !== p.tenantId._id) { if (!confirm('Your cart contains products from another store. Clear it and add this product?')) return; dispatch(clearCart()); } dispatch(addToCart({ productId: p._id, name: p.name, price: p.price, imageUrl: p.imageUrl, tenantId: p.tenantId._id, storeName: p.tenantId.name })); };
  return <Shell title="Discover products" user={user} onLogout={() => { clearAuth(); navigate('/'); }} cartCount={items.reduce((a,b)=>a+b.quantity,0)}><div className="shop-toolbar"><div className="search"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search products..."/></div><select value={storeSlug} onChange={e=>setStoreSlug(e.target.value)}><option value="">All stores</option>{stores.map(s=><option key={s.slug} value={s.slug}>{s.name}</option>)}</select><select value={category} onChange={e=>setCategory(e.target.value)}><option value="">All categories</option>{cats.map(c=><option key={c}>{c}</option>)}</select></div>{loading ? <div className="empty">Loading products...</div> : products.length ? <div className="product-grid">{products.map(p=><article className="product-card" key={p._id}><div className="product-image">{p.imageUrl ? <img src={p.imageUrl} alt={p.name}/> : <Package size={44}/>}</div><div className="product-info"><div className="tag">{p.category}</div><h3>{p.name}</h3><p>{p.description || 'Quality product from a NovaCart store.'}</p><small>{p.tenantId?.name} · {p.stock} left</small><div className="product-bottom"><strong>{money(p.price)}</strong><button onClick={()=>add(p)} disabled={!p.stock}>Add</button></div></div></article>)}</div> : <div className="empty">No products found. Vendors can add products from their dashboard.</div>}<Link className="floating-cart" to="/customer/cart"><ShoppingBag size={18}/> Cart ({items.reduce((a,b)=>a+b.quantity,0)})</Link></Shell>;
}

const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) : null;

function StripePaymentForm({ orderId, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submit = async e => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setBusy(true);
    setError('');
    try {
      const result = await stripe.confirmPayment({ elements, redirect: 'if_required' });
      if (result.error) {
        setError(result.error.message || 'Payment could not be completed.');
      } else if (result.paymentIntent?.status === 'succeeded') {
        await onSuccess(result.paymentIntent.id);
      } else {
        setError('Payment is not completed yet. Please check the payment status.');
      }
    } catch (e) {
      setError(e.message || 'Payment failed.');
    } finally {
      setBusy(false);
    }
  };
  return <form onSubmit={submit} className="stripe-payment-form">
    <p className="eyebrow">SECURE PAYMENT</p>
    <PaymentElement />
    {error && <div className="notice">{error}</div>}
    <button className="primary-btn full" disabled={!stripe || busy}>{busy ? 'Processing payment...' : 'Pay securely'}</button>
    <button type="button" className="secondary-btn full" onClick={onCancel} disabled={busy}>Back to delivery details</button>
  </form>;
}

function CartPage() {
  const user = currentUser();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector(s => s.cart.items);
  const total = items.reduce((a,b) => a + b.price*b.quantity, 0);
  const [open, setOpen] = useState(false);
  const [shipping, setShipping] = useState({name:user?.fullName||'',phone:user?.phone||'',address:'',city:'Bengaluru',pincode:''});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [pendingOrderId, setPendingOrderId] = useState('');
  const checkout = async e => {
    e.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const { order } = await api('/orders', { method:'POST', body:JSON.stringify({items,shipping}) });
      const payment = await api('/payments/create-intent', { method:'POST', body:JSON.stringify({orderId:order._id}) });
      if (payment.configured) {
        if (!stripePromise) {
          setMessage('Stripe is configured on the server, but the frontend publishable key is missing. Add VITE_STRIPE_PUBLISHABLE_KEY to the root .env and restart the app.');
          return;
        }
        setPendingOrderId(order._id);
        setClientSecret(payment.clientSecret);
        setMessage('');
      } else {
        await api('/payments/confirm-demo', { method:'POST', body:JSON.stringify({orderId:order._id}) });
        setMessage('Demo order confirmed. Configure Stripe keys to accept card payments.');
        dispatch(clearCart());
        setTimeout(() => navigate('/customer/orders'), 900);
      }
    } catch(err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  };
  const finishStripePayment = async paymentIntentId => {
    await api('/payments/confirm-stripe', { method:'POST', body:JSON.stringify({orderId:pendingOrderId,paymentIntentId}) });
    dispatch(clearCart());
    setMessage('Payment successful. Your order is confirmed.');
    setClientSecret('');
    setOpen(false);
    setTimeout(() => navigate('/customer/orders'), 700);
  };
  return <Shell title="Your cart" user={user} onLogout={()=>{clearAuth();navigate('/')}} cartCount={items.reduce((a,b)=>a+b.quantity,0)}>
    {items.length ? <div className="cart-layout">
      <div className="cart-list">{items.map(i=><div className="cart-row" key={i.productId}>
        <div className="mini-image">{i.imageUrl?<img src={i.imageUrl} alt=""/>:<Package size={24}/>}</div>
        <div className="cart-name"><b>{i.name}</b><span>{money(i.price)} each</span></div>
        <div className="qty"><button onClick={()=>dispatch(decrement(i.productId))}>−</button><span>{i.quantity}</span><button onClick={()=>dispatch(increment(i.productId))}>+</button></div>
        <strong>{money(i.price*i.quantity)}</strong>
        <button className="icon-btn" onClick={()=>dispatch(removeFromCart(i.productId))}><Trash2 size={17}/></button>
      </div>)}</div>
      <aside className="summary"><p>STORE</p><h3>{items[0]?.storeName}</h3><div className="summary-line"><span>Subtotal</span><b>{money(total)}</b></div><div className="summary-line"><span>Delivery</span><b>Free</b></div><div className="summary-total"><span>Total</span><b>{money(total)}</b></div><button className="primary-btn full" onClick={()=>{setOpen(true);setMessage('');setClientSecret('')}}>Checkout</button></aside>
    </div> : <div className="empty"><ShoppingBag size={40}/><h2>Your cart is empty</h2><Link className="primary-btn" to="/customer">Continue shopping</Link></div>}
    {open && <div className="modal-backdrop"><div className="modal">
      <button type="button" className="modal-close" onClick={()=>{setOpen(false);setClientSecret('')}}><X/></button>
      {!clientSecret ? <form onSubmit={checkout}>
        <p className="eyebrow">CHECKOUT</p><h2>Delivery details</h2>
        <div className="form-grid">
          <input placeholder="Full name" value={shipping.name} onChange={e=>setShipping({...shipping,name:e.target.value})} required/>
          <input placeholder="Phone" value={shipping.phone} onChange={e=>setShipping({...shipping,phone:e.target.value})} required/>
          <input className="wide" placeholder="Address" value={shipping.address} onChange={e=>setShipping({...shipping,address:e.target.value})} required/>
          <input placeholder="City" value={shipping.city} onChange={e=>setShipping({...shipping,city:e.target.value})} required/>
          <input placeholder="Pincode" value={shipping.pincode} onChange={e=>setShipping({...shipping,pincode:e.target.value})} required/>
        </div>
        {message&&<div className="notice">{message}</div>}
        <button className="primary-btn full" disabled={busy}>{busy?'Preparing checkout...':`Continue to payment · ${money(total)}`}</button>
      </form> : <><p className="eyebrow">CHECKOUT</p><h2>Complete your payment</h2><p className="summary-total">Total: {money(total)}</p>
        {stripePromise && <Elements stripe={stripePromise} options={{clientSecret}}>
          <StripePaymentForm orderId={pendingOrderId} onSuccess={finishStripePayment} onCancel={()=>setClientSecret('')}/>
        </Elements>}
      </>}
    </div></div>}
  </Shell>;
}

function CustomerOrders() { const user=currentUser(); const navigate=useNavigate(); const [orders,setOrders]=useState([]); useEffect(()=>{api('/orders/mine').then(d=>setOrders(d.orders)).catch(()=>{})},[]); return <Shell title="My orders" user={user} onLogout={()=>{clearAuth();navigate('/')}}><div className="orders-list">{orders.map(o=><div className="order-card" key={o._id}><div><b>#{o._id.slice(-8).toUpperCase()}</b><span>{o.tenantId?.name}</span><small>{new Date(o.createdAt).toLocaleString()}</small></div><div><strong>{money(o.total)}</strong><span className={`status ${o.status}`}>{o.status}</span></div></div>)}{!orders.length&&<div className="empty">No orders yet.</div>}</div></Shell>; }

function VendorDashboard(){ const user=currentUser(); const navigate=useNavigate(); const [tab,setTab]=useState('overview'); const [products,setProducts]=useState([]); const [orders,setOrders]=useState([]); const [editing,setEditing]=useState(null); const [form,setForm]=useState({name:'',description:'',category:'General',price:'',stock:'',imageUrl:''}); const [stats,setStats]=useState(null); const [uploadingImage,setUploadingImage]=useState(false); const uploadProductImage=async e=>{const input=e.target;const file=input.files?.[0];if(!file)return;if(!file.type.startsWith('image/')){alert('Please select an image file.');input.value='';return;}if(file.size>8*1024*1024){alert('Choose an image smaller than 8 MB.');input.value='';return;}const reader=new FileReader();reader.onerror=()=>{alert('The image could not be read. Please try another file.');input.value=''};reader.onload=async()=>{setUploadingImage(true);try{const result=await api('/media/upload',{method:'POST',body:JSON.stringify({dataUri:reader.result})});if(!result.url)throw new Error('Cloudinary did not return an image URL. Check your Cloudinary credentials.');setForm(current=>({...current,imageUrl:result.url}));alert('Image uploaded successfully. Save the product listing to keep it.')}catch(error){alert(`Image upload failed: ${error.message}`)}finally{setUploadingImage(false);input.value=''}};reader.readAsDataURL(file)}; const load=async()=>{const [p,o]=await Promise.all([api('/products'),api('/orders/vendor')]);setProducts(p.products);setOrders(o.orders);setStats({revenue:o.orders.filter(x=>x.paymentStatus==='paid').reduce((a,b)=>a+b.total,0),pending:o.orders.filter(x=>!['delivered','cancelled'].includes(x.status)).length,stock:p.products.reduce((a,b)=>a+b.stock,0)})}; useEffect(()=>{load().catch(e=>alert(e.message))},[]); const save=async e=>{e.preventDefault();try{if(editing) await api(`/products/${editing}`,{method:'PUT',body:JSON.stringify(form)});else await api('/products',{method:'POST',body:JSON.stringify(form)});setEditing(null);setForm({name:'',description:'',category:'General',price:'',stock:'',imageUrl:''});load()}catch(e){alert(e.message)}}; const edit=p=>{setEditing(p._id);setForm({name:p.name,description:p.description,category:p.category,price:p.price,stock:p.stock,imageUrl:p.imageUrl||''})}; const remove=async id=>{if(confirm('Remove this product?')){try{await api(`/products/${id}`,{method:'DELETE'});await load()}catch(e){alert(e.message)}}}; const toggleListing=async p=>{try{await api(`/products/${p._id}`,{method:'PUT',body:JSON.stringify({active:!p.active})});await load()}catch(e){alert(e.message)}}; const status=async(id,s)=>{await api(`/orders/${id}/status`,{method:'PATCH',body:JSON.stringify({status:s})});load()}; return <Shell title={tab==='products'?'Products':tab==='orders'?'Orders':'Store dashboard'} user={user} onLogout={()=>{clearAuth();navigate('/')}}><div className="dashboard-tabs"><button className={tab==='overview'?'active':''} onClick={()=>setTab('overview')}>Overview</button><button className={tab==='products'?'active':''} onClick={()=>setTab('products')}>Products</button><button className={tab==='orders'?'active':''} onClick={()=>setTab('orders')}>Orders</button></div>{tab==='overview'&&<><div className="stat-grid"><Stat icon={<TrendingUp/>} label="Revenue" value={money(stats?.revenue)}/><Stat icon={<Package/>} label="Products" value={products.length}/><Stat icon={<Box/>} label="Stock units" value={stats?.stock||0}/><Stat icon={<ShoppingBag/>} label="Open orders" value={stats?.pending||0}/></div><div className="dashboard-card"><h2>Recent orders</h2>{orders.slice(0,6).map(o=><div className="order-card compact" key={o._id}><div><b>#{o._id.slice(-8).toUpperCase()}</b><span>{o.customerId?.fullName}</span></div><div><strong>{money(o.total)}</strong><span className={`status ${o.status}`}>{o.status}</span></div></div>)}{!orders.length&&<div className="empty">No orders yet.</div>}</div></>}{tab==='products'&&<div className="dashboard-card"><div className="section-head"><h2>Manage products</h2><button className="primary-btn" onClick={()=>{setEditing(null);setForm({name:'',description:'',category:'General',price:'',stock:'',imageUrl:''})}}><Plus size={16}/> Add product</button></div><form className="product-form" onSubmit={save}><input placeholder="Product name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/><input placeholder="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}/><input placeholder="Price" type="number" min="0" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} required/><input placeholder="Stock" type="number" min="0" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})}/><input className="wide" placeholder="Image URL (or upload through Cloudinary config)" value={form.imageUrl} onChange={e=>setForm({...form,imageUrl:e.target.value})}/><label className="wide">Upload product image to Cloudinary<input type="file" accept="image/*" onChange={uploadProductImage} disabled={uploadingImage}/>{uploadingImage&&<small>Uploading image to Cloudinary...</small>}{form.imageUrl&&<small>Image ready: {form.imageUrl}</small>}<small>Choose an image under 8 MB. After upload, save the product listing.</small></label><textarea className="wide" placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/><div className="wide form-actions"><button className="primary-btn">{editing?'Update product':'Create product'}</button>{editing&&<button type="button" className="secondary-btn" onClick={()=>setEditing(null)}>Cancel</button>}</div></form><div className="table-wrap"><table><thead><tr><th>Product listing</th><th>Category</th><th>Price</th><th>Stock</th><th>Visibility</th><th>Actions</th></tr></thead><tbody>{products.map(p=><tr key={p._id}><td><div className="listing-name"><b>{p.name}</b><small>{p.description||"No description added"}</small></div></td><td>{p.category||"General"}</td><td>{money(p.price)}</td><td>{p.stock}</td><td><span className={`status ${p.active===false?"inactive":"active"}`}>{p.active===false?"Hidden":"Visible"}</span><button className="secondary-btn listing-toggle" onClick={()=>toggleListing(p)}>{p.active===false?"Publish":"Hide"}</button></td><td><div className="listing-actions"><button className="secondary-btn" onClick={()=>edit(p)}><Edit3 size={14}/> Edit listing</button><button className="icon-btn danger" aria-label={`Remove ${p.name}`} title="Remove listing" onClick={()=>remove(p._id)}><Trash2 size={16}/></button></div></td></tr>)}</tbody></table></div></div>}{tab==='orders'&&<div className="dashboard-card"><h2>Store orders</h2>{orders.map(o=><div className="vendor-order" key={o._id}><div><b>#{o._id.slice(-8).toUpperCase()}</b><span>{o.customerId?.fullName} · {o.customerId?.email}</span><small>{o.items.length} item(s) · {new Date(o.createdAt).toLocaleString()}</small></div><div className="order-actions"><strong>{money(o.total)}</strong><select value={o.status} onChange={e=>status(o._id,e.target.value)}><option>pending</option><option>paid</option><option>processing</option><option>shipped</option><option>delivered</option><option>cancelled</option></select></div></div>)}{!orders.length&&<div className="empty">No orders yet.</div>}</div>}</Shell> }

function Stat({icon,label,value}){return <div className="stat-card"><span>{icon}</span><div><small>{label}</small><b>{value}</b></div></div>}

function AdminDashboard(){ const user=currentUser();const navigate=useNavigate();const [data,setData]=useState(null);const [vendors,setVendors]=useState([]);const [customers,setCustomers]=useState([]);const [analytics,setAnalytics]=useState(null);const load=async()=>{const [o,v,c,a]=await Promise.all([api('/admin/overview'),api('/admin/vendors'),api('/admin/customers'),api('/admin/analytics')]);setData(o);setVendors(v.vendors);setCustomers(c.customers);setAnalytics(a)};useEffect(()=>{load().catch(e=>alert(e.message))},[]);const action=async(id,type)=>{try{await api(`/admin/vendors/${id}/${type}`,{method:'PATCH'});await load()}catch(e){alert(e.message)}};return <Shell title="Super Admin" user={user} className="admin-shell" onLogout={()=>{clearAuth();navigate('/')}}><div className="stat-grid"><Stat icon={<Users/>} label="Customers" value={data?.customers||0}/><Stat icon={<Store/>} label="Vendors" value={data?.vendors||0}/><Stat icon={<Package/>} label="Products" value={data?.products||0}/><Stat icon={<TrendingUp/>} label="Sales" value={money(data?.sales)}/></div><div className="admin-grid"><div className="dashboard-card"><div className="section-head"><h2>Vendor approvals</h2><span className="muted">{vendors.filter(v=>v.status==='pending').length} pending</span></div>{vendors.map(v=><div className="vendor-row" key={v._id}><div><b>{v.businessName}</b><span>{v.fullName} · {v.email}</span><small>{v.tenantId?.status || v.status}</small></div><div>{v.status==='pending'?<button className="primary-btn small" onClick={()=>action(v._id,'approve')}><Check size={15}/> Approve</button>:v.status==='inactive'?<button className="primary-btn small" onClick={()=>action(v._id,'activate')}>Activate</button>:<button className="secondary-btn small" onClick={()=>action(v._id,'suspend')}>Suspend</button>}</div></div>)}</div><div className="dashboard-card"><h2>Platform analytics</h2>{analytics?.byStatus.map(x=><div className="bar-row" key={x._id}><span>{x._id}</span><div><i style={{width:`${Math.min(100,x.count*10)}%`}}/></div><b>{x.count}</b></div>)}</div></div><div className="dashboard-card"><h2>Recent customers</h2><div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th></tr></thead><tbody>{customers.slice(0,10).map(c=><tr key={c._id}><td>{c.fullName}</td><td>{c.email}</td><td>{c.phone}</td><td>{new Date(c.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table></div></div></Shell>}

function Guard({role,children}){if(!getToken())return <Navigate to={role==='vendor'?'/login':role==='customer'?'/customer-login':'/admin-login'} replace/>;const u=currentUser();if(role&&u?.role!==role)return <Navigate to="/" replace/>;return children}

function App(){return <Routes><Route path="/" element={<Home/>}/><Route path="/customer-login" element={<CustomerLogin/>}/><Route path="/customer-signup" element={<CustomerSignup/>}/><Route path="/login" element={<VendorLogin/>}/><Route path="/vendor-signup" element={<VendorSignup/>}/><Route path="/admin-login" element={<AdminLogin/>}/><Route path="/customer" element={<Guard role="customer"><CustomerShop/></Guard>}/><Route path="/customer/cart" element={<Guard role="customer"><CartPage/></Guard>}/><Route path="/customer/orders" element={<Guard role="customer"><CustomerOrders/></Guard>}/><Route path="/vendor" element={<Guard role="vendor"><VendorDashboard/></Guard>}/><Route path="/super-admin" element={<Guard role="super_admin"><AdminDashboard/></Guard>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes>}

ReactDOM.createRoot(document.getElementById('root')).render(<Provider store={store}><BrowserRouter><App/></BrowserRouter></Provider>);
