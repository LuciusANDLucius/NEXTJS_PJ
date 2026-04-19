"use client"
import Link from "next/link";
import CartItem from "@/components/shop/cart/CartItem";
import { useCart } from "@/context/CartContext";
import styles from "./cart.module.css";

export default function CartPage() {
  const { cart, total, totalItems, clearCart } = useCart();

  const shipping = 0; // Removed mock shipping to fix total calculation confusion
  const finalTotal = total + shipping;

  if (cart.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg width="80" height="80" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className={styles.emptyTitle}>Giỏ hàng của bạn đang trống</h2>
          <p className={styles.emptyText}>Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
          <Link href="/" className={styles.shopBtn}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Giỏ hàng</h1>
        <span className={styles.badge}>{totalItems} sản phẩm</span>
        
        <button onClick={clearCart} className={styles.clearCartBtn}>
          Xóa tất cả
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.cartList}>
          {cart.map(item => (
            <CartItem key={item.product_id} item={item} />
          ))}
        </div>

        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>Tổng đơn hàng</h2>
          
          <div className={styles.summaryRow}>
            <span>Tạm tính</span>
            <span className={styles.summaryVal}>{total.toLocaleString("vi-VN")} đ</span>
          </div>
          
          <div className={styles.summaryRow}>
            <span>Phí giao hàng</span>
            <span className={styles.summaryVal}>{shipping.toLocaleString("vi-VN")} đ</span>
          </div>

          <div className={styles.summaryTotal}>
            <span>Tổng cộng</span>
            <span className={styles.totalVal}>{finalTotal.toLocaleString("vi-VN")} đ</span>
          </div>

          <Link href="/checkout" style={{ textDecoration: 'none' }}>
            <button className={styles.checkoutBtn} style={{ width: '100%' }}>
              Tiến hành thanh toán
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}