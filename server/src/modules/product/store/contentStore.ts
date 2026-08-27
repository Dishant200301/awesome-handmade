import { HeroSlide, HomepageBanner, ContentPageItem, BlogPost, FaqItem, StoreSettings } from "../../../types/admin.js";

let heroSlides: HeroSlide[] = [
  {
    id: "slide-1",
    title: "Handcrafted Heritage & Festive Charm",
    subtitle: "Authentic Gujarati mirror embroidery, handcrafted in Surat",
    image: "/images/home/hero/hero-1.webp",
    buttonText: "Shop Latkans",
    link: "/collections/latkan",
    status: "Active",
    sortOrder: 1
  },
  {
    id: "slide-2",
    title: "Navratri Traditional Choli Edit",
    subtitle: "Vibrant festive cholis designed with royal mirror elegance",
    image: "/images/home/hero/hero-2.webp",
    buttonText: "Explore Cholis",
    link: "/collections/choli",
    status: "Active",
    sortOrder: 2
  }
];

let homepageBanners: HomepageBanner[] = [
  {
    id: "banner-1",
    title: "Festive Season Special",
    subtitle: "Flat 20% Off on all Handmade Latkans & Jewellery Sets",
    image: "/images/banner/banner.png",
    badge: "FESTIVE SALE",
    link: "/collections/latkan",
    gridPosition: "Hero Side Upper",
    status: "Active"
  },
  {
    id: "banner-2",
    title: "Customized Gift Hampers",
    subtitle: "Personalized macrame keychains & festive boxes",
    image: "/images/category/Gift Hamper.webp",
    badge: "NEW ARRIVAL",
    link: "/collections/gift-hamper",
    gridPosition: "Hero Side Lower",
    status: "Active"
  }
];

let contentPages: ContentPageItem[] = [
  {
    id: "page-1",
    title: "About AOCIND Handmade",
    slug: "about-us",
    content: "AOCIND is India's premier artisanal handcrafted fashion and accessories brand crafted with love and authentic craftsmanship in Surat, Gujarat.",
    metaTitle: "About Us - AOCIND",
    metaDescription: "Learn about AOCIND's story, artisan roots, and authentic handcrafting.",
    status: "Published",
    updatedAt: "2026-08-01"
  },
  {
    id: "page-2",
    title: "Privacy & Cookie Policy",
    slug: "privacy-policy",
    content: "We protect your personal data with 256-bit SSL encryption.",
    metaTitle: "Privacy Policy - AOCIND",
    metaDescription: "Read AOCIND's privacy and data protection terms.",
    status: "Published",
    updatedAt: "2026-08-01"
  }
];

let blogPosts: BlogPost[] = [
  {
    id: "blog-1",
    title: "The Art of Handcrafted Mirror Latkans & Navratri Cholis",
    slug: "art-of-handcrafted-mirror-latkans",
    category: "Artisan Stories",
    author: "AOCIND Craft Specialist",
    excerpt: "Step-by-step styling guide for bridal latkans, mirror jewellery and traditional cholis.",
    content: "Full detailed guide on handcrafted accessories made by women artisans in Gujarat...",
    featuredImage: "/images/category/Latkan.webp",
    readTime: "4 min read",
    status: "Published",
    publishedDate: "2026-07-28"
  }
];

let faqItems: FaqItem[] = [
  {
    id: "faq-1",
    question: "What is AOCIND's return & exchange policy?",
    answer: "We offer hassle-free 7-day exchanges on unused, unworn items with original tags intact.",
    category: "Shipping & Returns",
    sortOrder: 1,
    status: "Active"
  },
  {
    id: "faq-2",
    question: "How long does standard delivery take across India?",
    answer: "Artisan handmade orders are dispatched within 24-48 hours and delivered in 2-5 business days across India.",
    category: "Delivery",
    sortOrder: 2,
    status: "Active"
  }
];

let storeSettings: StoreSettings = {
  storeName: "AOCIND Handmade",
  storeLogo: "/images/common/logo.png",
  email: "care@aocind.com",
  phone: "+91 98765 43210",
  address: "Surat, Gujarat, India",
  currency: "₹ (INR)",
  taxRate: 18,
  shippingFee: 99,
  freeShippingThreshold: 999,
  facebookUrl: "https://facebook.com/aocind",
  instagramUrl: "https://instagram.com/aocind",
  twitterUrl: "https://twitter.com/aocind",
  metaTitle: "AOCIND Handmade - Artisan Latkans, Cholis & Indian Crafts",
  metaDescription: "Shop authentic handcrafted Indian latkans, Navratri cholis, jewellery, and macrame decor online."
};

// Store getters & setters
export const getHeroSlidesStore = () => heroSlides;
export const getHomepageBannersStore = () => homepageBanners;
export const getContentPagesStore = () => contentPages;
export const getBlogPostsStore = () => blogPosts;
export const getFaqItemsStore = () => faqItems;
export const getStoreSettingsStore = () => storeSettings;

export const updateStoreSettingsStore = (settings: Partial<StoreSettings>) => {
  storeSettings = { ...storeSettings, ...settings };
  return storeSettings;
};
