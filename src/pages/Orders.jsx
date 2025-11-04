import { useEffect, useState } from "react";
import api from "../api/axios";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders");
      setOrders(data);
    } catch (err) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order, idx) => (
            <div key={idx} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between mb-2">
                <p><b>Status:</b> {order.status}</p>
                <p><b>Total:</b> ₹{order.totalAmount}</p>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <table className="w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Voucher</th>
                    <th className="border p-2">Price</th>
                    <th className="border p-2">Status</th>
                    <th className="border p-2">Code</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, i) => (
                    <tr key={i}>
                      <td className="border p-2">{item.voucherName}</td>
                      <td className="border p-2">₹{item.price}</td>
                      <td
                        className={`border p-2 font-semibold ${
                          item.status === "SUCCESS"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {item.status}
                      </td>
                      <td className="border p-2">
                        {item.code ? item.code : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
