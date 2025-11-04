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
    await api.post("/wallet/topup", { amount: Number(amount) });
    setAmount("");
    fetchWallet();
  };

  useEffect(() => { fetchWallet(); }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl mb-2">Wallet Balance: ₹{wallet?.balance || 0}</h2>
      <div className="flex gap-2 mb-4">
        <input
          className="border p-2"
          type="number"
          value={amount}
          placeholder="Amount"
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleTopUp} className="bg-green-500 text-white p-2 rounded">
          Top Up
        </button>
      </div>

      <h3 className="font-semibold mb-2">Transaction History</h3>
      <ul>
        {wallet?.transactions?.map((t, i) => (
          <li key={i} className="border p-2 mb-1 rounded">
            <b>{t.type}</b> — ₹{t.amount} — {t.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
