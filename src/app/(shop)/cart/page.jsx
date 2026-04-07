"use client"
import CartItem from "@/components/shop/cart/CartItem";
import { useCart } from "@/context/CartContext";
export default function CartPage() {
const { cart, total } = useCart();
console.log(cart);
return (
<div>
{cart.map(item => (
<CartItem key={item.product_id} item={item} />
))}
<h2>Tổng: {total.toLocaleString("vi-VN")} đ</h2>
</div>
);
}