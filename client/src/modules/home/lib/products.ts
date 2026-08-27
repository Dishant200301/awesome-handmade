import { type Product } from "../components/ProductCard";
import { products } from "@/data/catalog";

export const PRODUCTS: Product[] = products.map((p) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  price: p.price,
  originalPrice: p.originalPrice || p.price * 2,
  image: p.image,
  hoverImage: p.images && p.images[1] ? p.images[1] : p.image,
  rating: p.rating,
  reviews: p.reviewsCount,
  isNew: p.isNew,
  isBestSeller: p.isBest,
  discount: p.discountPercentage ? `${p.discountPercentage}% OFF` : "50% OFF",
}));

export const CATEGORY_TABS = [
  { key: "all", label: "All Items" },
  { key: "latkan", label: "Latkans & Tassels" },
  { key: "earrings", label: "Jewellery & Earrings" },
  { key: "choli", label: "Navratri Choli" },
  { key: "gift-hamper", label: "Gift Hampers" },
  { key: "necklace", label: "Necklaces" },
  { key: "bracelet", label: "Bracelets & Payal" },
];
