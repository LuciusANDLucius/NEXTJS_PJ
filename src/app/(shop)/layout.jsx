import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import { CartProvider } from "@/context/CartContext";

export default function ShopLayout({ children }) {
return (
<>
<CartProvider>
        <Header />
        <main>{children}</main>
        <Footer />
</CartProvider>
</>
);
}