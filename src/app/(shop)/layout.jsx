import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
export default function ShopLayout({ children }) {
return (
<>
<Header />
<main>{children}</main>
<Footer />
</>
);
}