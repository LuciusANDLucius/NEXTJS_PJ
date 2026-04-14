import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import { CartProvider } from "@/context/CartContext";
import WeatherWidget from "@/components/shop/WeatherWidget"; 

export default function ShopLayout({ children }) {
return (
<>
<CartProvider>
<div className="container mx-auto px-4 mt-4 flex justify-end">
             <WeatherWidget />
        </div>
        <Header />
        <main>{children}</main>
        <Footer />
</CartProvider>
</>
);
}