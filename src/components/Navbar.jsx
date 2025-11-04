import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-gray-100 shadow-sm">
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="font-semibold text-blue-600 hover:text-blue-700 text-lg"
        >
          🎟️ Voucher Store
        </Link>

        {user && (
          <>
            <Link
              to="/vouchers"
              className={`hover:text-blue-600 ${
                location.pathname === "/vouchers" ? "font-semibold" : ""
              }`}
            >
              Vouchers
            </Link>
            <Link
              to="/wallet"
              className={`hover:text-blue-600 ${
                location.pathname === "/wallet" ? "font-semibold" : ""
              }`}
            >
              Wallet
            </Link>
            <Link
              to="/orders"
              className={`hover:text-blue-600 ${
                location.pathname === "/orders" ? "font-semibold" : ""
              }`}
            >
              Orders
            </Link>
          </>
        )}
      </div>

      <div>
        {user ? (
          <button
            onClick={logout}
            className="text-red-500 font-semibold hover:text-red-600"
          >
            Logout
          </button>
        ) : (
          !isAuthPage && (
            <Link
              to="/login"
              className="text-blue-500 font-semibold hover:text-blue-600"
            >
              Login
            </Link>
          )
        )}
      </div>
    </nav>
  );
}
