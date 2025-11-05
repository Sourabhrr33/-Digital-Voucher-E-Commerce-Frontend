import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState("");

  const fetchWallet = async () => {
    const { data } = await api.get("/wallet");
    setWallet(data);
  };

const handleTopUp = async () => {
  if (!amount || Number(amount) <= 0) return;

  try {
    const res = await api.post("/wallet/topup", { amount: Number(amount) });

    // Wait a small delay before fetching updated wallet
    setTimeout(() => {
      fetchWallet();
    }, 300); // 300ms delay ensures DB update is reflected

    toast.success(res.data.message || "Wallet topped up successfully");
  } catch (err) {
    toast.error(err.response?.data?.message || "Top-up failed");
  } finally {
    setAmount("");
  }
};

useEffect(() => {
  console.log("Wallet balance:", wallet?.balance);
}, [wallet]);


  useEffect(() => {
    fetchWallet();
  }, []);

  // 🧩 Prevent negative or undefined wallet balance display
  const displayBalance = Math.max(0, wallet?.balance || 0);

  return (
    <div className="p-6">
    <h2 className="text-xl mb-2">Wallet Balance: ₹{wallet?.balance <= 0 ? 0 : wallet?.balance}</h2>


      <div className="flex gap-2 mb-4">
        <input
          className="border p-2"
          type="number"
          value={amount}
          placeholder="Amount"
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          onClick={handleTopUp}
          className="bg-green-500 text-white p-2 rounded"
        >
          Top Up
        </button>
      </div>

      <h3 className="font-semibold mb-2">Transaction History</h3>
      <ul>
        {wallet?.transactions?.length > 0 ? (
          wallet.transactions.map((t, i) => (
            <li key={i} className="border p-2 mb-1 rounded">
              <b>{t.type}</b> — ₹{t.amount} — {t.description}
            </li>
          ))
        ) : (
          <p>No transactions yet.</p>
        )}
      </ul>
    </div>
  );
}
