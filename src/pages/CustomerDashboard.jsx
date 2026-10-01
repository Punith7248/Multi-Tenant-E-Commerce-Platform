import {
    Home,
    ShoppingBag,
    Heart,
    MapPin,
    CreditCard,
    User,
    HelpCircle,
    LogOut,
} from "lucide-react";
import { useSelector } from "react-redux";

function CustomerDashboard() {
    const { totalOrders, activeOrders, wishlist, totalSpent } = useSelector(
        (state) => state.dashboard
    );
    return (
        <div className="min-h-screen bg-[#f7f8fc] flex">

            {/* Sidebar */}
            <aside className="w-[240px] min-h-screen bg-white border-r border-gray-200 px-5 py-6 flex flex-col">

                {/* Logo */}
                <div className="flex items-center gap-2 mb-10">
                    <div className="w-9 h-9 rounded-lg bg-[#5744df] flex items-center justify-center">
                        <ShoppingBag size={19} className="text-white" />
                    </div>

                    <span className="text-xl font-bold text-[#11112f]">
                        NovaCart
                    </span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2">

                    <a
                        href="#"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#f0edff] text-[#5744df] text-sm font-medium"
                    >
                        <Home size={18} />
                        Dashboard
                    </a>

                    <a
                        href="#"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 text-sm"
                    >
                        <ShoppingBag size={18} />
                        My Orders
                    </a>

                    <a
                        href="#"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 text-sm"
                    >
                        <Heart size={18} />
                        Wishlist
                    </a>

                    <a
                        href="#"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 text-sm"
                    >
                        <MapPin size={18} />
                        Addresses
                    </a>

                    <a
                        href="#"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 text-sm"
                    >
                        <CreditCard size={18} />
                        Payment Methods
                    </a>

                    <a
                        href="#"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 text-sm"
                    >
                        <User size={18} />
                        My Account
                    </a>

                </nav>

                {/* Bottom navigation */}
                <div className="border-t border-gray-200 pt-4 space-y-2">

                    <a
                        href="#"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 text-sm"
                    >
                        <HelpCircle size={18} />
                        Help & Support
                    </a>

                    <button
                        type="button"
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 text-sm"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>

                </div>

            </aside>


            {/* Dashboard content */}
            <main className="flex-1 p-8">

                {/* Top Header */}
                <div className="flex items-center justify-between mb-8">

                    <div>
                        <p className="text-sm text-gray-500">
                            Customer Dashboard
                        </p>

                        <h1 className="text-2xl font-bold text-[#11112f] mt-1">
                            Welcome back, Purnima! 👋
                        </h1>
                    </div>

                    {/* Profile */}
                    <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-[#5744df] flex items-center justify-center text-white font-semibold">
                            P
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-[#11112f]">
                                Purnima
                            </p>

                            <p className="text-xs text-gray-500">
                                Customer
                            </p>
                        </div>

                    </div>

                </div>


                {/* Welcome Banner */}
                <div className="bg-[#5744df] rounded-2xl p-6 text-white mb-8">

                    <h2 className="text-2xl font-bold">
                        Shop More, Smile More!
                    </h2>

                    <p className="text-white/80 mt-2">
                        Discover your favorite products and enjoy a seamless shopping experience.
                    </p>

                    <button
                        type="button"
                        className="mt-5 bg-white text-[#5744df] px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-100"
                    >
                        Start Shopping
                    </button>

                </div>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

                    {/* Orders */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Total Orders
                                </p>

                                <h3 className="text-2xl font-bold text-[#11112f] mt-2">
                                    {totalOrders}
                                </h3>
                            </div>

                            <div className="w-11 h-11 rounded-xl bg-[#f0edff] flex items-center justify-center">
                                <ShoppingBag size={21} className="text-[#5744df]" />
                            </div>
                        </div>

                        <p className="text-xs text-green-600 mt-4">
                            +12% from last month
                        </p>
                    </div>


                    {/* Active Orders */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Active Orders
                                </p>

                                <h3 className="text-2xl font-bold text-[#11112f] mt-2">
                                    {activeOrders}
                                </h3>
                            </div>

                            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                                <ShoppingBag size={21} className="text-blue-500" />
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 mt-4">
                            Currently processing
                        </p>
                    </div>


                    {/* Wishlist */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Wishlist
                                </p>

                                <h3 className="text-2xl font-bold text-[#11112f] mt-2">
                                    {wishlist}
                                </h3>
                            </div>

                            <div className="w-11 h-11 rounded-xl bg-pink-50 flex items-center justify-center">
                                <Heart size={21} className="text-pink-500" />
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 mt-4">
                            Saved products
                        </p>
                    </div>


                    {/* Total Spent */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Total Spent
                                </p>

                                <h3 className="text-2xl font-bold text-[#11112f] mt-2">
                                    ₹{totalSpent.toLocaleString("en-IN")}
                                </h3>
                            </div>

                            <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
                                <CreditCard size={21} className="text-green-500" />
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 mt-4">
                            This year
                        </p>
                    </div>

                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-2xl border border-gray-100 mt-6 overflow-hidden">

                    {/* Section Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">

                        <div>
                            <h2 className="text-lg font-bold text-[#11112f]">
                                Recent Orders
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Your latest purchases
                            </p>
                        </div>

                        <button
                            type="button"
                            className="text-sm font-medium text-[#5744df] hover:underline"
                        >
                            View All
                        </button>

                    </div>


                    {/* Orders Table */}
                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead>
                                <tr className="text-left text-xs text-gray-500 bg-gray-50">
                                    <th className="px-6 py-4 font-medium">
                                        Order ID
                                    </th>

                                    <th className="px-6 py-4 font-medium">
                                        Product
                                    </th>

                                    <th className="px-6 py-4 font-medium">
                                        Date
                                    </th>

                                    <th className="px-6 py-4 font-medium">
                                        Amount
                                    </th>

                                    <th className="px-6 py-4 font-medium">
                                        Status
                                    </th>
                                </tr>
                            </thead>


                            <tbody>

                                <tr className="border-t border-gray-100">

                                    <td className="px-6 py-4 text-sm font-medium text-[#11112f]">
                                        #NC-1024
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        Wireless Headphones
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        Sep 28, 2026
                                    </td>

                                    <td className="px-6 py-4 text-sm font-medium text-[#11112f]">
                                        ₹2,499
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="inline-flex px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-medium">
                                            Delivered
                                        </span>
                                    </td>

                                </tr>


                                <tr className="border-t border-gray-100">

                                    <td className="px-6 py-4 text-sm font-medium text-[#11112f]">
                                        #NC-1023
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        Smart Watch
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        Sep 25, 2026
                                    </td>

                                    <td className="px-6 py-4 text-sm font-medium text-[#11112f]">
                                        ₹3,999
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="inline-flex px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 text-xs font-medium">
                                            Processing
                                        </span>
                                    </td>

                                </tr>


                                <tr className="border-t border-gray-100">

                                    <td className="px-6 py-4 text-sm font-medium text-[#11112f]">
                                        #NC-1022
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        Running Shoes
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        Sep 21, 2026
                                    </td>

                                    <td className="px-6 py-4 text-sm font-medium text-[#11112f]">
                                        ₹2,799
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="inline-flex px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                                            Shipped
                                        </span>
                                    </td>

                                </tr>

                            </tbody>

                        </table>

                    </div>

                </div>
                {/* Order Summary */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">

                    {/* Spending Summary */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">

                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-[#11112f]">
                                    Order Summary
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Your spending overview
                                </p>
                            </div>

                            <select
                                className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none"
                                defaultValue="year"
                            >
                                <option value="year">This Year</option>
                                <option value="month">This Month</option>
                            </select>
                        </div>

                        {/* Simple Chart */}
                        <div className="h-48 flex items-end gap-4 px-2">

                            <div className="flex-1 bg-[#e9e5ff] rounded-t-lg h-[35%]"></div>

                            <div className="flex-1 bg-[#e9e5ff] rounded-t-lg h-[55%]"></div>

                            <div className="flex-1 bg-[#e9e5ff] rounded-t-lg h-[45%]"></div>

                            <div className="flex-1 bg-[#e9e5ff] rounded-t-lg h-[70%]"></div>

                            <div className="flex-1 bg-[#5744df] rounded-t-lg h-[85%]"></div>

                            <div className="flex-1 bg-[#e9e5ff] rounded-t-lg h-[60%]"></div>

                        </div>

                        <div className="flex justify-between text-xs text-gray-400 mt-3 px-2">
                            <span>Jan</span>
                            <span>Feb</span>
                            <span>Mar</span>
                            <span>Apr</span>
                            <span>May</span>
                            <span>Jun</span>
                        </div>

                    </div>


                    {/* Order Status */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">

                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-[#11112f]">
                                Order Status
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Current order overview
                            </p>
                        </div>

                        <div className="space-y-5">

                            {/* Delivered */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-gray-600">
                                        Delivered
                                    </span>

                                    <span className="text-sm font-semibold text-[#11112f]">
                                        16
                                    </span>
                                </div>

                                <div className="h-2 bg-gray-100 rounded-full">
                                    <div className="h-2 w-[75%] bg-green-500 rounded-full"></div>
                                </div>
                            </div>


                            {/* Processing */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-gray-600">
                                        Processing
                                    </span>

                                    <span className="text-sm font-semibold text-[#11112f]">
                                        5
                                    </span>
                                </div>

                                <div className="h-2 bg-gray-100 rounded-full">
                                    <div className="h-2 w-[35%] bg-yellow-400 rounded-full"></div>
                                </div>
                            </div>


                            {/* Shipped */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-gray-600">
                                        Shipped
                                    </span>

                                    <span className="text-sm font-semibold text-[#11112f]">
                                        3
                                    </span>
                                </div>

                                <div className="h-2 bg-gray-100 rounded-full">
                                    <div className="h-2 w-[25%] bg-blue-500 rounded-full"></div>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default CustomerDashboard;