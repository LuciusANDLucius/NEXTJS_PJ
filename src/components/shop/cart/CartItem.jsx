'use client';
import { useCart } from "@/context/CartContext";
import styles from "@/app/(shop)/(others)/cart/cart.module.css";

export default function CartItem({ item }) {
  const { removeFromCart, updateQuantity } = useCart();
  
  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.product_id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    updateQuantity(item.product_id, item.quantity + 1);
  };

  // Safe image path
  const imgUrl = item.image 
    ? (item.image.startsWith('http') ? item.image : `http://localhost:5000/uploads/${item.image}`) 
    : '/placeholder.jpg'; // Dùng fallback nếu ko có

  return (
    <div className={styles.itemCard}>
      <img src={imgUrl} alt={item.product_name} className={styles.itemImage} />
      
      <div className={styles.itemDetails}>
        <h3 className={styles.itemName}>{item.product_name}</h3>
        <p className={styles.itemPrice}>{Number(item.price || 0).toLocaleString('vi-VN')} đ</p>
      </div>
      
      <div className={styles.actionGroup} style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div className={styles.quantityControl}>
          <button 
            className={styles.qtyBtn} 
            onClick={handleDecrease}
            disabled={item.quantity <= 1}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
            </svg>
          </button>
          <span className={styles.qtyVal}>{item.quantity}</span>
          <button 
            className={styles.qtyBtn} 
            onClick={handleIncrease}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        
        <div className={styles.itemTotal}>
          {(Number(item.price || 0) * Number(item.quantity || 1)).toLocaleString('vi-VN')} đ
        </div>
        
        <button 
          className={styles.removeBtn} 
          onClick={() => removeFromCart(item.product_id)}
          title="Xóa sản phẩm"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}