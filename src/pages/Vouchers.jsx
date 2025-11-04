import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function Vouchers() {
  const [vouchers, setVouchers] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchVouchers = async () => {
    try {
      const { data } = await api.get("/vouchers");
      setVouchers(data);
    } catch (err) {
      toast.error("Failed to load vouchers");
    }
  };

  const toggleCart = (voucher) => {
    const exists = cart.find((v) => v._id === voucher._id);
    if (exists) {
      setCart(cart.filter((v) => v._id !== voucher._id));
    } else {
      setCart([...cart, { ...voucher, quantity: 1 }]);
    }
  };

  const handleBuy = async () => {
    if (cart.length === 0) return toast.warn("No vouchers selected");
    setLoading(true);
    try {
      const formatted = cart.map((item) => ({
        voucherId: item._id,
        quantity: item.quantity,
      }));

      const { data } = await api.post("/orders", { items: formatted });

      toast.success(`Order ${data.order.status} ✅`);
      setCart([]);
      fetchVouchers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Purchase failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Available Vouchers</h2>
      {vouchers.length === 0 && <p>No vouchers available 😕</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {vouchers.map((v) => (
          <div
            key={v._id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <h3 className="font-semibold text-lg">{v.name}</h3>
            <p>💰 Price: ₹{v.price}</p>
            <p>🧾 Stock: {v.stock}</p>
            <p>📅 Expiry: {v.expiryDate.split("T")[0]}</p>
            <button
              onClick={() => toggleCart(v)}
              className={`mt-3 w-full p-2 rounded ${
                cart.find((c) => c._id === v._id)
                  ? "bg-red-500 text-white"
                  : "bg-blue-500 text-white"
              }`}
            >
              {cart.find((c) => c._id === v._id)
                ? "Remove from Cart"
                : "Add to Cart"}
            </button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">🛒 Cart Summary</h3>
          <ul className="mb-3">
            {cart.map((item) => (
              <li key={item._id}>
                {item.name} - ₹{item.price} x {item.quantity}
              </li>
            ))}
          </ul>
          <p className="font-bold mb-3">
            Total: ₹{cart.reduce((sum, i) => sum + i.price * i.quantity, 0)}
          </p>
          <button
            disabled={loading}
            onClick={handleBuy}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </div>
      )}
    </div>
  );
}
