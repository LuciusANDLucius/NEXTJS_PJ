'use client'
import { createContext, useContext, useState, useEffect } from "react";
const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        if (typeof window !== "undefined") {
            const savedCart = localStorage.getItem("cart");
            return savedCart ? JSON.parse(savedCart) : [];
        }
        return [];
    });

    const [toast, setToast] = useState({ id: 0, show: false, message: '' });

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }, [cart]);

    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.id, toast.show]);

    const addToCart = (product, qty = 1) => {
        const parsedQty = Number(qty) || 1;
        setCart(prev => {
            const exist = prev.find(item => item.product_id === product.product_id);
            if (exist) {
                return prev.map(item =>
                    item.product_id === product.product_id
                        ? { ...item, quantity: Number(item.quantity) + parsedQty }
                        : item
                );
            }
            return [...prev, { ...product, quantity: parsedQty }];
        });
        setToast({ id: Date.now(), show: true, message: "Thêm vào giỏ hàng thành công" });
    };

    const removeFromCart = (product_id) => {
        setCart(prev => prev.filter(item => item.product_id !== product_id));
    };

    const updateQuantity = (product_id, quantity) => {
        const parsedQty = Number(quantity);
        if (parsedQty < 1) return;
        setCart(prev => prev.map(item =>
            item.product_id === product_id ? { ...item, quantity: parsedQty } : item
        ));
    };

    const clearCart = () => setCart([]);


    const total = cart.reduce(
        (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
        0
    );

    const totalItems = cart.reduce(
        (sum, item) => sum + (Number(item.quantity) || 1),
        0
    );

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total, totalItems }}>
            {children}
            {/* Modern Toast UI */}
            {toast.show && (
                <div style={{
                    position: 'fixed',
                    bottom: '32px',
                    right: '32px',
                    zIndex: 9999,
                    background: '#10b981',
                    color: 'white',
                    padding: '14px 24px',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '15px',
                    fontWeight: 600,
                    animation: 'cartToastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                }}>
                    <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '50%', padding: '4px' }}>
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    {toast.message}
                </div>
            )}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes cartToastSlideIn {
                    0% { transform: translateY(40px) scale(0.95); opacity: 0; }
                    100% { transform: translateY(0) scale(1); opacity: 1; }
                }
            `}} />
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);