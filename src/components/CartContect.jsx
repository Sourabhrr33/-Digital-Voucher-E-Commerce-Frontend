import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (voucher) => {
    setCart((prev) => {
      // Prevent duplicates
      if (prev.find((v) => v._id === voucher._id)) return prev;
      return [...prev, { ...voucher, quantity: 1 }];
    });
  };

  const removeFromCart = (voucherId) => {
    setCart((prev) => prev.filter((v) => v._id !== voucherId));
  };

  const toggleCart = (voucher) => {
    setCart((prev) => {
      const exists = prev.find((v) => v._id === voucher._id);
      if (exists) {
        // remove it
        return prev.filter((v) => v._id !== voucher._id);
      } else {
        // add it
        return [...prev, { ...voucher, quantity: 1 }];
      }
    });
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, setCart, addToCart, removeFromCart, toggleCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
