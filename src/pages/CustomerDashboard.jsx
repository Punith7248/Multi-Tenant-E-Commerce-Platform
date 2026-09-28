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

function CustomerDashboard() {
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

            </main>

        </div>
    );
}

export default CustomerDashboard;