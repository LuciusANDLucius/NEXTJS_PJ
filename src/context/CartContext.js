'use client'
import { createContext, useContext, useState, useEffect } from "react";
const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedCart = localStorage.getItem("cart");
            if (savedCart) {
                try {
                    setCart(JSON.parse(savedCart));
                } catch (e) {
                    console.error("Lỗi parse cart:", e);
                }
            }
        }
        setIsLoaded(true);
    }, []);

    const [toast, setToast] = useState({ id: 0, show: false, message: '' });

    useEffect(() => {
        if (isLoaded && typeof window !== "undefined") {
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }, [cart, isLoaded]);

    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.id, toast.show]);

    const addToCart = (product, qty = 1) => {
        const parsedQty = Number(qty) || 1;
        setCart(prev => {
            const prodId = product.product_id ?? product.id ?? product.productId;
            const regularPrice = Number(product.price ?? product.regular_price ?? product.regularPrice ?? product.sale_price ?? product.salePrice ?? 0);
            const salePrice = product.sale_price ?? product.salePrice ?? null;
            const exist = prev.find(item => item.product_id === prodId);
            if (exist) {
                return prev.map(item =>
                    item.product_id === prodId
                        ? { ...item, quantity: Number(item.quantity) + parsedQty }
                        : item
                );
            }
            const newItem = {
                product_id: prodId,
                product_name: product.product_name ?? product.name ?? product.title ?? '',
                image: product.image ?? product.thumbnail ?? null,
                price: regularPrice,
                sale_price: salePrice != null ? Number(salePrice) : null,
                quantity: parsedQty,
                // keep other metadata if present
                ...product
            };
            return [...prev, newItem];
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


    const subtotal = cart.reduce(
        (sum, item) => sum + Number(item.price || 0) * (Number(item.quantity) || 1),
        0
    );

    const discountTotal = cart.reduce(
        (sum, item) => {
            const orig = Number(item.price || 0);
            const sale = Number(item.sale_price ?? item.salePrice ?? orig);
            return sum + (Math.max(orig - sale, 0) * (Number(item.quantity) || 1));
        },
        0
    );

    const total = cart.reduce(
        (sum, item) => sum + Number((item.sale_price ?? item.price) || 0) * (Number(item.quantity) || 1),
        0
    );

    const totalItems = cart.reduce(
        (sum, item) => sum + (Number(item.quantity) || 1),
        0
    );

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, discountTotal, total, totalItems }}>
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