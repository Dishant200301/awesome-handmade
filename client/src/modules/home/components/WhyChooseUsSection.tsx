import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { FiTruck, FiShield, FiAward, FiHeart, FiPhoneCall } from "react-icons/fi";

const WHY = [
  { icon: FiTruck, title: "Free Delivery", desc: "Free delivery on pre-paid orders above ₹999" },
  { icon: FiHeart, title: "100% Handcrafted", desc: "Authentic Gujarati heritage craft made with love in Surat" },
  { icon: FiAward, title: "Artisan Quality", desc: "Premium glass mirrors, zari embroidery & anti-tarnish beads" },
  { icon: FiShield, title: "Secure Checkout", desc: "100% safe & verified payments across all cards & UPI" },
  { icon: FiPhoneCall, title: "Custom Orders", desc: "Direct WhatsApp support & bespoke bridal customization" },
];

export default function WhyChooseUsSection() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".why-card", {
        y: 30, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%" }
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="bg-[#FAF8F4] py-16 md:py-24 border-t border-[#EDE5DA]">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        {/* MOBILE & TABLET VIEW (infinite marquee scroll) */}
        <div className="lg:hidden overflow-hidden w-full relative">
          <div className="flex w-max awesome-marquee gap-6 pb-2">
            {[...WHY, ...WHY].map((w, i) => (
              <div key={i} className="why-card flex flex-col items-center text-center select-none flex-shrink-0 w-[55vw] md:w-[30vw]">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-brand-gold text-brand-maroon mb-3 bg-white shadow-sm">
                  <w.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-semibold tracking-wide text-brand-ink font-heading mb-1">{w.title}</h3>
                <p className="text-xs font-normal text-brand-ink/70 max-w-[200px] leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* DESKTOP/LAPTOP GRID VIEW */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-y-12 gap-x-6">
          {WHY.map((w, i) => (
            <div key={i} className="why-card flex flex-col items-center text-center select-none group">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-brand-gold/40 text-brand-maroon mb-3 bg-white shadow-sm group-hover:bg-brand-maroon group-hover:text-white group-hover:border-brand-maroon transition-all duration-300">
                <w.icon size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-base md:text-lg font-bold tracking-wide text-brand-ink font-heading mb-1">{w.title}</h3>
              <p className="text-xs md:text-sm font-normal text-brand-ink/70 max-w-[200px] leading-relaxed">{w.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
