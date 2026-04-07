'use client';
import { useCart } from "@/context/CartContext";
export default function CartItem({ item }) {
  const {removeFromCart}=useCart();
  return (
  <div className="cart-item">
      <span>{item.product_name}</span>
      
      {/* Thêm readOnly để tránh lỗi cảnh báo value mà không có onChange */}
      <input type="number" value={item.quantity} min="1" readOnly />
      
      <span>{item.price?.toLocaleString()}đ</span>
      
      <div>
        {/* 3. Bây giờ hàm này đã tồn tại và có thể chạy được */}
        <button onClick={() => removeFromCart(item.product_id)}>
          Delete
        </button>
      </div>
    </div>
  );
  }