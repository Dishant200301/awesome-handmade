import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  Image as ImageIcon, 
  FileText, 
  BookOpen, 
  HelpCircle, 
  Plus, 
  Trash2, 
  Check, 
  ExternalLink,
  Search,
  Sparkles
} from 'lucide-react';
import { HeroSlide, HomepageBanner, ContentPageItem, BlogPost, FaqItem } from '../types/admin';

interface ContentPagesProps {
  initialSubTab?: 'hero-slider' | 'homepage-banners' | 'content-pages' | 'content-blog' | 'content-faq';
}

export const ContentPages: React.FC<ContentPagesProps> = ({ initialSubTab = 'hero-slider' }) => {
  const [subTab, setSubTab] = useState(initialSubTab);

  // 1. Hero Sliders State
  const [slides, setSlides] = useState<HeroSlide[]>([
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
  ]);

  // 2. Banners State
  const [banners, setBanners] = useState<HomepageBanner[]>([
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
  ]);

  // 3. Static Pages State
  const [pages, setPages] = useState<ContentPageItem[]>([
    {
      id: "page-1",
      title: "About Awesome Handmade",
      slug: "about-us",
      content: "Awesome Handmade is India's premier artisanal handcrafted fashion and accessories brand crafted with love and authentic craftsmanship in Surat, Gujarat.",
      metaTitle: "About Us - Awesome Handmade",
      metaDescription: "Learn about Awesome Handmade's story, artisan roots, and authentic handcrafting.",
      status: "Published",
      updatedAt: "2026-08-01"
    },
    {
      id: "page-2",
      title: "Privacy Policy",
      slug: "privacy-policy",
      content: "We protect your personal data with SSL encryption.",
      metaTitle: "Privacy Policy - Awesome Handmade",
      metaDescription: "Read Awesome Handmade's privacy and data protection terms.",
      status: "Published",
      updatedAt: "2026-08-01"
    }
  ]);

  // 4. Blog Posts State
  const [blogs, setBlogs] = useState<BlogPost[]>([
    {
      id: "blog-1",
      title: "The Art of Handcrafted Mirror Latkans & Navratri Cholis",
      slug: "art-of-handcrafted-mirror-latkans",
      category: "Artisan Stories",
      author: "Awesome Handmade Specialist",
      excerpt: "Step-by-step styling guide for bridal latkans, mirror jewellery and traditional cholis.",
      content: "Full detailed guide on handcrafted accessories made by women artisans in Gujarat...",
      featuredImage: "/images/category/Latkan.webp",
      readTime: "4 min read",
      status: "Published",
      publishedDate: "2026-07-28"
    }
  ]);

  // 5. FAQ Items State
  const [faqs, setFaqs] = useState<FaqItem[]>([
    {
      id: "faq-1",
      question: "What is Awesome Handmade's return & exchange policy?",
      answer: "We offer hassle-free 7-day exchanges on unused, unworn items with original tags intact.",
      category: "Shipping & Returns",
      sortOrder: 1,
      status: "Active"
    },
    {
      id: "faq-2",
      question: "How long does standard dispatch & delivery take across India?",
      answer: "Artisan handmade orders are dispatched within 24-48 hours and delivered in 2-5 business days across India.",
      category: "Delivery",
      sortOrder: 2,
      status: "Active"
    }
  ]);

  // Search filter
  const [search, setSearch] = useState('');

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-[1400px] mx-auto pb-24 font-sans">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <span>Store Content Management</span>
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Manage homepage hero slides, promo banners, static pages, blog articles, and FAQs live on the storefront.
          </p>
        </div>

        {/* SUBTAB SWITCHER */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 overflow-x-auto">
          <button
            type="button"
            onClick={() => setSubTab('hero-slider')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              subTab === 'hero-slider' ? 'bg-zinc-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Hero Slider</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('homepage-banners')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              subTab === 'homepage-banners' ? 'bg-zinc-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Banners</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('content-pages')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              subTab === 'content-pages' ? 'bg-zinc-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Pages</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('content-blog')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              subTab === 'content-blog' ? 'bg-zinc-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Blog</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('content-faq')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              subTab === 'content-faq' ? 'bg-zinc-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FAQ</span>
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-xs font-bold text-slate-900 outline-none"
        />
      </div>

      {/* SUBMODULE 1: HERO SLIDERS */}
      {subTab === 'hero-slider' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">Hero Carousel Slides ({slides.length})</h3>
            <button
              type="button"
              onClick={() => {
                const newSlide: HeroSlide = {
                  id: `slide-${Date.now()}`,
                  title: "New Promo Slide",
                  subtitle: "Slide subtitle highlight description",
                  image: "/images/banner/banner.png",
                  buttonText: "Shop Now",
                  link: "/collections/latkan",
                  status: "Active",
                  sortOrder: slides.length + 1
                };
                setSlides([...slides, newSlide]);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Hero Slide</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {slides.map((s) => (
              <div key={s.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-slate-100 relative border border-slate-200">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-zinc-900/90 text-white text-[10px] font-extrabold rounded-lg backdrop-blur-xs">
                    Order #{s.sortOrder}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">Slide Title</label>
                    <input
                      type="text"
                      value={s.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSlides(slides.map((item) => (item.id === s.id ? { ...item, title: val } : item)));
                      }}
                      className="w-full bg-slate-50 p-2.5 text-xs font-extrabold text-slate-900 rounded-xl border border-slate-200 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={s.subtitle}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSlides(slides.map((item) => (item.id === s.id ? { ...item, subtitle: val } : item)));
                      }}
                      className="w-full bg-slate-50 p-2 text-xs text-slate-700 rounded-xl border border-slate-200 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">CTA Button Text</label>
                      <input
                        type="text"
                        value={s.buttonText}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSlides(slides.map((item) => (item.id === s.id ? { ...item, buttonText: val } : item)));
                        }}
                        className="w-full bg-slate-50 p-2 text-xs font-bold text-slate-900 rounded-xl border border-slate-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">Status</label>
                      <select
                        value={s.status}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          setSlides(slides.map((item) => (item.id === s.id ? { ...item, status: val } : item)));
                        }}
                        className="w-full bg-slate-50 p-2 text-xs font-bold text-slate-800 rounded-xl border border-slate-200 cursor-pointer"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-mono text-slate-400">{s.link}</span>
                    <button
                      type="button"
                      onClick={() => setSlides(slides.filter((item) => item.id !== s.id))}
                      className="p-1.5 text-rose-500 hover:text-rose-700 font-bold text-xs cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBMODULE 2: HOMEPAGE BANNERS */}
      {subTab === 'homepage-banners' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">Homepage Banners ({banners.length})</h3>
            <button
              type="button"
              onClick={() => {
                const newB: HomepageBanner = {
                  id: `banner-${Date.now()}`,
                  title: "New Promo Banner",
                  subtitle: "Special category promotion",
                  image: "/images/banner/banner.png",
                  badge: "PROMO",
                  link: "/collections/latkan",
                  gridPosition: "Middle Wide",
                  status: "Active"
                };
                setBanners([...banners, newB]);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Banner</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banners.map((b) => (
              <div key={b.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 relative border border-slate-200">
                  <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                  {b.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-rose-600 text-white text-[10px] font-extrabold rounded-lg uppercase tracking-wider">
                      {b.badge}
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">Banner Title</label>
                    <input
                      type="text"
                      value={b.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setBanners(banners.map((item) => (item.id === b.id ? { ...item, title: val } : item)));
                      }}
                      className="w-full bg-slate-50 p-2.5 text-xs font-extrabold text-slate-900 rounded-xl border border-slate-200 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">Grid Slot</label>
                      <select
                        value={b.gridPosition}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          setBanners(banners.map((item) => (item.id === b.id ? { ...item, gridPosition: val } : item)));
                        }}
                        className="w-full bg-slate-50 p-2 text-xs font-bold text-slate-800 rounded-xl border border-slate-200 cursor-pointer"
                      >
                        <option value="Hero Side Upper">Hero Side Upper</option>
                        <option value="Hero Side Lower">Hero Side Lower</option>
                        <option value="Middle Wide">Middle Wide</option>
                        <option value="Grid Left">Grid Left</option>
                        <option value="Grid Right">Grid Right</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">Status</label>
                      <select
                        value={b.status}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          setBanners(banners.map((item) => (item.id === b.id ? { ...item, status: val } : item)));
                        }}
                        className="w-full bg-slate-50 p-2 text-xs font-bold text-slate-800 rounded-xl border border-slate-200 cursor-pointer"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-mono text-slate-400">{b.link}</span>
                    <button
                      type="button"
                      onClick={() => setBanners(banners.filter((item) => item.id !== b.id))}
                      className="p-1.5 text-rose-500 hover:text-rose-700 font-bold text-xs cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBMODULE 3: PAGES */}
      {subTab === 'content-pages' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">Static Pages ({pages.length})</h3>
            <button
              type="button"
              onClick={() => {
                const newP: ContentPageItem = {
                  id: `page-${Date.now()}`,
                  title: "New Policy Page",
                  slug: "new-policy-page",
                  content: "Full page copy content text...",
                  metaTitle: "New Policy Page - Awesome Handmade",
                  metaDescription: "Page description...",
                  status: "Published",
                  updatedAt: new Date().toISOString().split('T')[0]
                };
                setPages([...pages, newP]);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Page</span>
            </button>
          </div>

          <div className="space-y-4">
            {pages.map((p) => (
              <div key={p.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">{p.title}</h4>
                    <p className="text-[11px] font-mono text-slate-400">/pages/{p.slug}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-[10px] rounded-lg border border-emerald-200">
                    {p.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">Page Title</label>
                    <input
                      type="text"
                      value={p.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPages(pages.map((item) => (item.id === p.id ? { ...item, title: val } : item)));
                      }}
                      className="w-full bg-slate-50 p-2.5 text-xs font-bold text-slate-900 rounded-xl border border-slate-200 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">Page Body Content</label>
                    <textarea
                      rows={3}
                      value={p.content}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPages(pages.map((item) => (item.id === p.id ? { ...item, content: val } : item)));
                      }}
                      className="w-full bg-slate-50 p-2.5 text-xs text-slate-800 rounded-xl border border-slate-200 outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBMODULE 4: BLOG */}
      {subTab === 'content-blog' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">Blog Articles ({blogs.length})</h3>
            <button
              type="button"
              onClick={() => {
                const newB: BlogPost = {
                  id: `blog-${Date.now()}`,
                  title: "New Styling Guide Article",
                  slug: "new-styling-guide-article",
                  category: "Styling Guide",
                  author: "Awesome Handmade Team",
                  excerpt: "Article summary excerpt...",
                  content: "Full body article copy...",
                  featuredImage: "/images/category/Latkan.webp",
                  readTime: "3 min read",
                  status: "Published",
                  publishedDate: new Date().toISOString().split('T')[0]
                };
                setBlogs([...blogs, newB]);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Blog Post</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogs.map((b) => (
              <div key={b.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img src={b.featuredImage} alt={b.title} className="w-full h-full object-cover" />
                </div>

                <div className="space-y-3">
                  <h4 className="font-extrabold text-slate-900 text-sm">{b.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{b.excerpt}</p>

                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 pt-2 border-t border-slate-100">
                    <span>{b.author} • {b.publishedDate}</span>
                    <button
                      type="button"
                      onClick={() => setBlogs(blogs.filter((item) => item.id !== b.id))}
                      className="text-rose-500 hover:text-rose-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBMODULE 5: FAQ */}
      {subTab === 'content-faq' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">Frequently Asked Questions ({faqs.length})</h3>
            <button
              type="button"
              onClick={() => {
                const newF: FaqItem = {
                  id: `faq-${Date.now()}`,
                  question: "New FAQ Question?",
                  answer: "Answer explanation text...",
                  category: "General",
                  sortOrder: faqs.length + 1,
                  status: "Active"
                };
                setFaqs([...faqs, newF]);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add FAQ</span>
            </button>
          </div>

          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                    {f.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFaqs(faqs.filter((item) => item.id !== f.id))}
                    className="text-rose-500 hover:text-rose-700 text-xs font-bold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>

                <div>
                  <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">Question</label>
                  <input
                    type="text"
                    value={f.question}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFaqs(faqs.map((item) => (item.id === f.id ? { ...item, question: val } : item)));
                    }}
                    className="w-full bg-slate-50 p-2.5 text-xs font-bold text-slate-900 rounded-xl border border-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">Answer</label>
                  <textarea
                    rows={2}
                    value={f.answer}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFaqs(faqs.map((item) => (item.id === f.id ? { ...item, answer: val } : item)));
                    }}
                    className="w-full bg-slate-50 p-2.5 text-xs text-slate-800 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
