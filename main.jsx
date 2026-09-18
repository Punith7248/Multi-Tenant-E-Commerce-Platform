import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useNavigate, useLocation } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, setRole } from "./store";
import { ShoppingBag, ArrowRight, UserRound, Store, ShieldCheck, Truck, Headphones, ChevronLeft } from "lucide-react";
import "./index.css";

function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const role = useSelector((state) => state.role.role);
    const goRole = (value) => { dispatch(setRole(value)); navigate("/login"); };

    if (location.pathname === "/login") {
        return <Login role={role} onBack={() => navigate("/")} onContinue={() => navigate("/")} />;
    }

    return (
        <div className="min-h-screen bg-[#f5f6fb] p-3">
            <div className="mx-auto max-w-[1200px] overflow-hidden rounded-[18px] border border-white bg-[#fafaff] shadow-[0_10px_45px_rgba(52,48,100,.12)]">
                <header className="flex h-[66px] items-center justify-between px-5 sm:px-8">
                    <button onClick={() => navigate("/")} className="flex items-center gap-2 font-extrabold text-[18px]">
                        <span className="grid h-7 w-7 place-items-center rounded-md bg-[#6254df] text-white"><ShoppingBag size={15} /></span>
                        Nova<span className="text-[#6254df]">Cart</span>
                    </button>
                    <nav className="hidden items-center gap-8 text-[11px] font-medium text-slate-700 md:flex"><button>Explore</button><button>Stores</button><button>About</button><button>Contact</button></nav>
                    <button onClick={() => navigate("/login")} className="rounded-md border border-[#dddafe] bg-white px-3 py-2 text-[10px] font-semibold text-[#6254df]">Log in</button>
                </header>
                <main className="grid gap-8 px-6 pb-7 pt-5 sm:px-9 lg:grid-cols-[1.05fr_.95fr] lg:gap-5 lg:px-10 lg:pt-9">
                    <section className="flex min-h-[600px] flex-col justify-between">
                        <div><p className="mb-3 text-[9px] font-bold tracking-[.28em] text-slate-500">ONE PLATFORM. MANY STORES.</p><h1 className="max-w-[480px] text-[38px] font-extrabold leading-[1.02] tracking-[-.045em] sm:text-[46px]">Shop. Support.<br />Grow <span className="text-[#5d50dc]">Together.</span></h1><p className="mt-4 max-w-[350px] text-[12px] leading-5 text-slate-600">Discover amazing products from independent businesses and be part of a bigger community.</p><div className="mt-8 flex gap-7"><Stat number="10K+" text="Happy Customers" /><Stat number="500+" text="Active Stores" /><Stat number="50K+" text="Products" /></div></div>
                        <div className="relative mt-10 hidden h-[300px] overflow-hidden rounded-[100%_100%_0_0] border-t border-[#aaa4ee] bg-[#f3f2ff] sm:block"><div className="absolute left-[9%] top-[40%] rotate-[-8deg] text-[15px] italic leading-5 text-slate-700">Good<br /><b>Products</b><br />Better People<div className="ml-4 h-1 w-16 -rotate-6 rounded bg-[#6254df]" /></div><div className="absolute bottom-[-8px] left-[44%] h-[150px] w-[185px] rounded-t-[55%] bg-[#b99d82] opacity-60" /><div className="absolute bottom-5 right-[7%] h-32 w-28 rounded-2xl bg-white/80 p-4 shadow-lg"><div className="text-[9px] font-bold">Quality</div><div className="text-[9px] text-slate-500">Products<br />Strong<br />Community</div></div></div>
                    </section>
                    <section className="pt-3 lg:pt-5"><div className="mb-6 flex items-center gap-3 text-[9px] font-bold tracking-[.25em] text-[#6254df]"><span className="h-[2px] w-5 bg-[#6254df]" />GET STARTED</div><h2 className="text-[21px] font-extrabold">Choose your account type</h2><p className="mt-1 text-[11px] text-slate-600">Select how you want to continue with NovaCart.</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><RoleCard customer onClick={() => goRole("customer")} /><RoleCard onClick={() => goRole("vendor")} /></div><div className="mt-12 grid grid-cols-3 gap-5 border-t border-slate-200 pt-7"><Feature icon={<ShieldCheck />} text="Secure Payments" /><Feature icon={<Truck />} text="Fast Delivery" /><Feature icon={<Headphones />} text="Support Small Businesses" /></div></section>
                </main>
            </div>
        </div>
    );
}

function Stat({n,t}){return <div><div className="text-[17px] font-extrabold">{n}</div><div className="mt-1 text-[8px] text-slate-500">{t}</div></div>}
function RoleCard({customer,onClick}){return <button onClick={onClick} className={`group relative min-h-[190px] rounded-2xl p-5 text-left transition hover:-translate-y-1 hover:shadow-lg ${customer?'bg-[#f0efff]':'bg-[#eaf8f0]'}`}><div className={`grid h-10 w-10 place-items-center rounded-full ${customer?'bg-[#cfc9ff] text-[#6254df]':'bg-[#b9ebcb] text-[#17633d]'}`}>{customer?<UserRound size={22}/>:<Store size={22}/>}</div><h3 className="mt-4 text-[13px] font-extrabold">I'm a {customer?'Customer':'Vendor'}</h3><p className="mt-2 max-w-[150px] text-[9px] leading-4 text-slate-600">{customer?'Shop from multiple stores, explore great products and enjoy exclusive deals.':'Create your own store, manage products, track orders and grow your business.'}</p><span className={`absolute bottom-4 left-5 grid h-7 w-7 place-items-center rounded-full text-white ${customer?'bg-[#6254df]':'bg-[#17633d]'}`}><ArrowRight size={13}/></span></button>}
function Feature({icon,t}){return <div className="flex flex-col items-center gap-2 text-center text-[8px] font-semibold"><span className="text-[#6254df]">{React.cloneElement(icon,{size:18})}</span>{t}</div>}
function Login({role,onBack,onContinue}){return <main className="grid min-h-[650px] place-items-center px-6 py-12"><div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_15px_50px_rgba(50,45,100,.1)]"><button onClick={onBack} className="mb-8 flex items-center gap-1 text-xs text-slate-500"><ChevronLeft size={15}/> Back</button><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#eeeefe] text-[#6254df]">{role==='vendor'?<Store/>:<UserRound/>}</div><h1 className="mt-5 text-center text-2xl font-extrabold">Welcome to NovaCart</h1><p className="mt-2 text-center text-xs text-slate-500">Continue as a {role||'customer'}.</p><label className="mt-7 block text-xs font-semibold">Email</label><input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#6254df]" placeholder="you@example.com"/><label className="mt-4 block text-xs font-semibold">Password</label><input type="password" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#6254df]" placeholder="••••••••"/><button onClick={onContinue} className="mt-6 w-full rounded-xl bg-[#6254df] py-3 text-sm font-bold text-white shadow-lg shadow-[#6254df]/20">Continue</button></div></main>}
createRoot(document.getElementById("root")).render(<Provider store={store}><BrowserRouter><App /></BrowserRouter></Provider>);
