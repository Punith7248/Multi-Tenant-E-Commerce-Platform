import React from "react";

import { createRoot } from "react-dom/client";

import {
    BrowserRouter,
    useNavigate,
    useLocation
} from "react-router-dom";

import {
    Provider,
    useDispatch,
    useSelector
} from "react-redux";

import { store, setRole } from "./store";

import {
    Moon,
    ArrowRight,
    UserRound,
    Store,
    ShieldCheck,
    Truck,
    Headphones,
    Package,
    ShoppingBag,
    BarChart3,
    ChevronLeft,
    Menu,
    X
} from "lucide-react";

import CustomerSignup from "./pages/CustomerSignup";
import CustomerLogin from "./pages/CustomerLogin";
import VendorLogin from "./pages/VendorLogin";
import VendorSignup from "./pages/VendorSignup";

import homeBg from "./assets/home.png";

import "./index.css";


function App() {

    const nav = useNavigate();
    const loc = useLocation();
    const dispatch = useDispatch();

    const role = useSelector((s) => s.role.role);

    const [menu, setMenu] = React.useState(false);

    const [darkMode, setDarkMode] = React.useState(() => {
        return localStorage.getItem("novacart-theme") === "dark";
    });


    React.useEffect(() => {

        if (darkMode) {

            document.documentElement.classList.add("dark-mode");
            document.body.classList.add("dark-mode");

        } else {

            document.documentElement.classList.remove("dark-mode");
            document.body.classList.remove("dark-mode");

        }

        localStorage.setItem(
            "novacart-theme",
            darkMode ? "dark" : "light"
        );

    }, [darkMode]);


    const toggleDarkMode = () => {

        setDarkMode((prev) => !prev);

    };


    const goRole = (r) => {

        dispatch(setRole(r));

        if (r === "customer") {

            nav("/customer-login");

        } else {

            nav("/login");

        }

    };


    return (

        <div
            className={`
                h-screen
                w-screen
                overflow-hidden
                transition-colors
                duration-300
                ${
                    darkMode
                        ? "bg-[#0b0b12] text-white"
                        : "bg-[#f5f6fb] text-[#101329]"
                }
            `}
        >

            <div
                className={`
                    h-full
                    w-full
                    overflow-hidden
                    transition-colors
                    duration-300
                    ${
                        darkMode
                            ? "bg-[#0b0b12]"
                            : "bg-[#fafaff]"
                    }
                `}
            >

                <header
                    className={`
                        relative
                        flex
                        h-[76px]
                        shrink-0
                        items-center
                        justify-between
                        px-5
                        transition-colors
                        duration-300
                        sm:px-8
                        ${
                            darkMode
                                ? "bg-[#0b0b12] text-white"
                                : "bg-[#fafaff] text-[#101329]"
                        }
                    `}
                >

                    <button
                        onClick={() => nav("/")}
                        className="
                            flex
                            items-center
                            gap-2
                            font-extrabold
                            text-[18px]
                            tracking-[-.04em]
                        "
                    >

                        <span
                            className="
                                grid
                                h-7
                                w-7
                                place-items-center
                                rounded-md
                                bg-[#6254df]
                                text-white
                                shadow-sm
                            "
                        >
                            <ShoppingBag size={15} />
                        </span>

                        Nova

                        <span className="text-[#6254df]">
                            Cart
                        </span>

                    </button>


                    <nav
                        className={`
                            hidden
                            items-center
                            gap-8
                            text-[11px]
                            font-medium
                            md:flex
                            ${
                                darkMode
                                    ? "text-slate-300"
                                    : "text-slate-700"
                            }
                        `}
                    >

                        <button
                            onClick={() => nav("/")}
                        >
                            Explore
                        </button>

                        <button>
                            Stores
                        </button>

                        <button>
                            About
                        </button>

                        <button>
                            Contact
                        </button>

                    </nav>


                    <div
                        className="
                            hidden
                            items-center
                            gap-4
                            sm:flex
                        "
                    >

                        <button
                            type="button"
                            onClick={toggleDarkMode}
                            title={
                                darkMode
                                    ? "Switch to light mode"
                                    : "Switch to dark mode"
                            }
                            className={`
                                grid
                                h-8
                                w-8
                                place-items-center
                                rounded-full
                                transition
                                ${
                                    darkMode
                                        ? "bg-[#1d1d2a] text-yellow-300 hover:bg-[#29293a]"
                                        : "bg-[#f0efff] text-[#6254df] hover:bg-[#e6e4ff]"
                                }
                            `}
                        >
                            <Moon size={15} />
                        </button>


                        <span
                            className={`
                                text-[10px]
                                ${
                                    darkMode
                                        ? "text-slate-400"
                                        : "text-slate-600"
                                }
                            `}
                        >
                            Are u a Admin 
                        </span>


                        <button
                            onClick={() => nav("/customer-login")}
                            className={`
                                rounded-md
                                border
                                px-3
                                py-1
                                text-[10px]
                                font-semibold
                                ${
                                    darkMode
                                        ? "border-[#343344] bg-[#171722] text-[#9b91ff]"
                                        : "border-[#dddafe] bg-white text-[#6254df]"
                                }
                            `}
                        >
                            Log in
                        </button>

                    </div>


                    <div className="flex items-center gap-3 sm:hidden">

                        <button
                            type="button"
                            onClick={toggleDarkMode}
                            title={
                                darkMode
                                    ? "Switch to light mode"
                                    : "Switch to dark mode"
                            }
                            className={`
                                grid
                                h-8
                                w-8
                                place-items-center
                                rounded-full
                                ${
                                    darkMode
                                        ? "bg-[#1d1d2a] text-yellow-300"
                                        : "bg-[#f0efff] text-[#6254df]"
                                }
                            `}
                        >
                            <Moon size={15} />
                        </button>


                        <button
                            type="button"
                            onClick={() => setMenu(!menu)}
                        >
                            {menu ? (
                                <X size={20} />
                            ) : (
                                <Menu size={20} />
                            )}
                        </button>

                    </div>


                    {menu && (

                        <div
                            className={`
                                absolute
                                right-4
                                top-16
                                z-50
                                w-44
                                rounded-xl
                                border
                                p-4
                                shadow-xl
                                md:hidden
                                ${
                                    darkMode
                                        ? "border-[#2d2d3c] bg-[#171722] text-white"
                                        : "border-slate-200 bg-white text-slate-800"
                                }
                            `}
                        >

                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-4
                                    text-sm
                                "
                            >

                                <button
                                    onClick={() => {
                                        nav("/");
                                        setMenu(false);
                                    }}
                                >
                                    Explore
                                </button>

                                <button>
                                    Stores
                                </button>

                                <button>
                                    About
                                </button>

                                <button>
                                    Contact
                                </button>

                                <button
                                    onClick={() => {
                                        nav("/customer-login");
                                        setMenu(false);
                                    }}
                                >
                                    Log in
                                </button>

                            </div>

                        </div>

                    )}

                </header>


                <div className="h-[calc(100vh-76px)] min-h-0">

                    {

                        loc.pathname === "/" ? (

                            <Home
                                onRole={goRole}
                                darkMode={darkMode}
                            />

                        ) : loc.pathname === "/customer-login" ? (

                            <CustomerLogin />

                        ) : loc.pathname === "/customer-signup" ? (

                            <CustomerSignup />

                        ) : loc.pathname === "/login" ? (

                            <VendorLogin />

                        ) : loc.pathname === "/vendor-signup" ? (

                            <VendorSignup />

                        ) : role === "vendor" ? (

                            <Dashboard
                                vendor
                                onBack={() => nav("/")}
                            />

                        ) : (

                            <Dashboard
                                onBack={() => nav("/")}
                            />

                        )

                    }

                </div>

            </div>

        </div>

    );

}


function Home({
    onRole,
    darkMode
}) {

    return (

        <main
            className={`
                grid
                h-full
                min-h-0
                grid-cols-1
                overflow-hidden
                transition-colors
                duration-300
                md:grid-cols-2
                ${
                    darkMode
                        ? "bg-[#0b0b12]"
                        : "bg-[#fafaff]"
                }
            `}
        >

            <section
                className="
                    relative
                    h-full
                    min-h-0
                    overflow-hidden
                    bg-cover
                    bg-center
                    bg-no-repeat
                "
                style={{
                    backgroundImage: `url(${homeBg})`
                }}
            >

                <div
                    className="
                        relative
                        z-10
                        flex
                        h-full
                        flex-col
                        justify-between
                        p-8
                        sm:p-10
                        lg:p-12
                    "
                >

                    <div>

                        <p
                            className={`
                                mb-3
                                text-[9px]
                                font-bold
                                tracking-[.28em]
                                ${
                                    darkMode
                                        ? "text-white"
                                        : "text-black"
                                }
                            `}
                        >
                            ONE PLATFORM. MANY STORES.
                        </p>


                        <h1
                            className={`
                                max-w-[480px]
                                text-[38px]
                                font-extrabold
                                leading-[1.02]
                                tracking-[-.045em]
                                sm:text-[46px]
                                ${
                                    darkMode
                                        ? "text-white"
                                        : "text-black"
                                }
                            `}
                        >

                            Shop. Support.

                            <br />

                            Grow{" "}

                            <span
                                className={
                                    darkMode
                                        ? "text-white"
                                        : "text-black"
                                }
                            >
                                Together.
                            </span>

                        </h1>


                        <p
                            className={`
                                mt-4
                                max-w-[350px]
                                text-[12px]
                                leading-5
                                ${
                                    darkMode
                                        ? "text-white/80"
                                        : "text-black/75"
                                }
                            `}
                        >
                            Discover amazing products from independent
                            businesses and be part of a bigger community.
                        </p>


                        <div className="mt-8 flex gap-7">

                            <Stat
                                n="10K+"
                                t="Happy Customers"
                                darkMode={darkMode}
                            />

                            <Stat
                                n="500+"
                                t="Active Stores"
                                darkMode={darkMode}
                            />

                            <Stat
                                n="50K+"
                                t="Products"
                                darkMode={darkMode}
                            />

                        </div>

                    </div>


                    <div className="relative -translate-y-4">

                        <p
                            className={`
                                font-semibold
                                ${
                                    darkMode
                                        ? "text-white"
                                        : "text-black"
                                }
                            `}
                        >
                            Every purchase
                            <br />
                            supports a bigger dream.
                        </p>


                        <div
                            className={`
                                mt-3
                                h-0.5
                                w-7
                                ${
                                    darkMode
                                        ? "bg-white"
                                        : "bg-black"
                                }
                            `}
                        />

                    </div>

                </div>

            </section>


            <section
                className={`
                    h-full
                    min-h-0
                    overflow-hidden
                    px-6
                    py-6
                    transition-colors
                    duration-300
                    sm:px-9
                    lg:px-10
                    lg:py-8
                    ${
                        darkMode
                            ? "bg-[#0f0f18] text-white"
                            : "bg-[#fafaff] text-[#101329]"
                    }
                `}
            >

                <div
                    className="
                        mb-6
                        flex
                        items-center
                        gap-3
                        text-[9px]
                        font-bold
                        tracking-[.25em]
                        text-[#6254df]
                    "
                >

                    <span
                        className="
                            h-[2px]
                            w-5
                            bg-[#6254df]
                        "
                    />

                    GET STARTED

                </div>


                <h2 className="text-[21px] font-extrabold">
                    Choose your account type
                </h2>


                <p
                    className={`
                        mt-1
                        text-[11px]
                        ${
                            darkMode
                                ? "text-slate-400"
                                : "text-slate-600"
                        }
                    `}
                >
                    Select how you want to continue with NovaCart.
                </p>


                <div
                    className="
                        mt-5
                        grid
                        gap-4
                        sm:grid-cols-2
                    "
                >

                    <RoleCard
                        customer
                        onClick={() => onRole("customer")}
                        darkMode={darkMode}
                    />


                    <RoleCard
                        onClick={() => onRole("vendor")}
                        darkMode={darkMode}
                    />

                </div>


                <div
                    className={`
                        mt-12
                        grid
                        grid-cols-3
                        gap-5
                        border-t
                        pt-7
                        ${
                            darkMode
                                ? "border-[#292938]"
                                : "border-slate-200"
                        }
                    `}
                >

                    <Feature
                        icon={<ShieldCheck />}
                        t="Secure Payments"
                        darkMode={darkMode}
                    />


                    <Feature
                        icon={<Truck />}
                        t="Fast Delivery"
                        darkMode={darkMode}
                    />


                    <Feature
                        icon={<Headphones />}
                        t="Support Small Businesses"
                        darkMode={darkMode}
                    />

                </div>

            </section>

        </main>

    );

}


function Stat({
    n,
    t,
    darkMode
}) {

    return (

        <div>

            <div
                className={`
                    text-[17px]
                    font-extrabold
                    ${
                        darkMode
                            ? "text-white"
                            : "text-black"
                    }
                `}
            >
                {n}
            </div>


            <div
                className={`
                    mt-1
                    text-[8px]
                    ${
                        darkMode
                            ? "text-white/65"
                            : "text-black/65"
                    }
                `}
            >
                {t}
            </div>

        </div>

    );

}


function RoleCard({
    customer,
    onClick,
    darkMode
}) {

    return (

        <button
            onClick={onClick}
            className={`
                group
                relative
                min-h-[190px]
                rounded-2xl
                p-5
                text-left
                transition
                hover:-translate-y-1
                hover:shadow-lg
                ${
                    darkMode
                        ? customer
                            ? "bg-[#1d1b30]"
                            : "bg-[#17291f]"
                        : customer
                            ? "bg-[#f0efff]"
                            : "bg-[#eaf8f0]"
                }
            `}
        >

            <div
                className={`
                    grid
                    h-10
                    w-10
                    place-items-center
                    rounded-full
                    ${
                        customer
                            ? "bg-[#cfc9ff] text-[#6254df]"
                            : "bg-[#b9ebcb] text-[#17633d]"
                    }
                `}
            >

                {customer ? (
                    <UserRound size={22} />
                ) : (
                    <Store size={22} />
                )}

            </div>


            <h3
                className={`
                    mt-4
                    text-[13px]
                    font-extrabold
                    ${
                        darkMode
                            ? "text-white"
                            : "text-slate-900"
                    }
                `}
            >
                I'm a {customer ? "Customer" : "Vendor"}
            </h3>


            <p
                className={`
                    mt-2
                    max-w-[150px]
                    text-[9px]
                    leading-4
                    ${
                        darkMode
                            ? "text-slate-400"
                            : "text-slate-600"
                    }
                `}
            >
                {
                    customer
                        ? "Shop from multiple stores, explore great products and enjoy exclusive deals."
                        : "Create your own store, manage products, track orders and grow your business."
                }
            </p>


            <span
                className={`
                    absolute
                    bottom-4
                    left-40
                    grid
                    h-7
                    w-7
                    place-items-center
                    rounded-full
                    text-white
                    ${
                        customer
                            ? "bg-[#6254df]"
                            : "bg-[#17633d]"
                    }
                `}
            >
                <ArrowRight size={13} />
            </span>

        </button>

    );

}


function Feature({
    icon,
    t,
    darkMode
}) {

    return (

        <div
            className={`
                flex
                flex-col
                items-center
                gap-2
                text-center
                text-[8px]
                font-semibold
                ${
                    darkMode
                        ? "text-slate-300"
                        : "text-slate-800"
                }
            `}
        >

            <span className="text-[#6254df]">

                {React.cloneElement(icon, {
                    size: 18
                })}

            </span>

            {t}

        </div>

    );

}


function Dashboard({
    vendor,
    onBack
}) {

    return (

        <main
            className="
                h-full
                min-h-0
                overflow-hidden
                px-6
                py-6
                sm:px-10
            "
        >

            <button
                onClick={onBack}
                className="
                    mb-8
                    flex
                    items-center
                    gap-1
                    text-xs
                    text-slate-500
                "
            >

                <ChevronLeft size={15} />

                Back to home

            </button>


            <div
                className="
                    flex
                    flex-col
                    justify-between
                    gap-4
                    sm:flex-row
                    sm:items-end
                "
            >

                <div>

                    <p
                        className="
                            text-[9px]
                            font-bold
                            tracking-[.25em]
                            text-[#6254df]
                        "
                    >
                        NOVACART
                    </p>


                    <h1
                        className="
                            mt-2
                            text-3xl
                            font-extrabold
                        "
                    >
                        {vendor
                            ? "Vendor Dashboard"
                            : "Customer Dashboard"}
                    </h1>


                    <p
                        className="
                            mt-2
                            text-sm
                            text-slate-500
                        "
                    >
                        {vendor
                            ? "Manage your store, inventory and orders."
                            : "Explore stores, products and your orders."}
                    </p>

                </div>


                <button
                    className="
                        rounded-xl
                        bg-[#6254df]
                        px-5
                        py-3
                        text-xs
                        font-bold
                        text-white
                    "
                >
                    {vendor
                        ? "Add Product"
                        : "Explore Products"}
                </button>

            </div>


            <div
                className="
                    mt-10
                    grid
                    gap-4
                    sm:grid-cols-3
                "
            >

                <DashCard
                    icon={<Package />}
                    n={vendor ? "128" : "24"}
                    t={vendor ? "Products" : "Orders"}
                />


                <DashCard
                    icon={<BarChart3 />}
                    n={vendor ? "₹84.2K" : "₹12.8K"}
                    t={vendor ? "This month" : "Total spent"}
                />


                <DashCard
                    icon={<ShoppingBag />}
                    n={vendor ? "36" : "500+"}
                    t={vendor ? "Orders" : "Stores"}
                />

            </div>


            <div
                className="
                    dashboard-overview
                    mt-6
                    rounded-2xl
                    border
                    p-6
                "
            >

                <h2 className="font-bold">
                    {vendor
                        ? "Store overview"
                        : "Recommended for you"}
                </h2>


                <div
                    className="
                        mt-5
                        grid
                        gap-3
                        sm:grid-cols-3
                    "
                >

                    <div
                        className="
                            h-28
                            rounded-xl
                            bg-[#f0efff]
                        "
                    />

                    <div
                        className="
                            h-28
                            rounded-xl
                            bg-[#eaf8f0]
                        "
                    />

                    <div
                        className="
                            h-28
                            rounded-xl
                            bg-[#fff4e6]
                        "
                    />

                </div>

            </div>

        </main>

    );

}


function DashCard({
    icon,
    n,
    t
}) {

    return (

        <div
            className="
                dashboard-card
                rounded-2xl
                border
                p-5
            "
        >

            <div className="text-[#6254df]">

                {React.cloneElement(icon, {
                    size: 19
                })}

            </div>


            <div
                className="
                    mt-4
                    text-2xl
                    font-extrabold
                "
            >
                {n}
            </div>


            <div
                className="
                    mt-1
                    text-xs
                    text-slate-500
                "
            >
                {t}
            </div>

        </div>

    );

}


createRoot(
    document.getElementById("root")
).render(

    <Provider store={store}>

        <BrowserRouter>

            <App />

        </BrowserRouter>

    </Provider>

);