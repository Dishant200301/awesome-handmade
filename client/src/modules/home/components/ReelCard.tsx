import { useState, useRef } from "react";
import { FiEye, FiPlay, FiHeart } from "react-icons/fi";

export interface RelatedProduct {
  name: string;
  price: string;
  img: string;
  link: string;
}

export interface ReelItem {
  title: string;
  views: string;
  likes: number;
  img: string;
  video: string;
  relatedProduct?: RelatedProduct;
}

export default function ReelCard({ r }: { r: ReelItem }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Helper to extract YouTube ID
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const ytId = getYouTubeId(r.video);

  const handleMouseEnter = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => { });
    }
  };

  const handleMouseLeave = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="reel-card group relative w-full h-[120vw] sm:h-[75vw] lg:w-[22vw] lg:h-[40vw] flex-none lg:snap-start overflow-hidden bg-zinc-950 shadow-md select-none cursor-pointer rounded-2xl"
    >
      {/* Background Image */}
      <img
        src={r.img}
        alt={r.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />

      {/* Video Overlay (YouTube IFrame or HTML5 Video) */}
      {ytId && isPlaying ? (
        <div className="absolute inset-0 w-full h-full overflow-hidden z-10 pointer-events-none">
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytId}&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&enablejsapi=1`}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[316%] h-[116%] pointer-events-none border-0"
            allow="autoplay; encrypted-media"
          />
        </div>
      ) : !ytId ? (
        <video
          ref={videoRef}
          src={r.video}
          loop
          muted
          playsInline
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 z-10 ${isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
        />
      ) : null}

      {/* Frosted Glass Overlay (active by default, fades out on hover/play) */}
      <div className={`absolute inset-0 bg-white/5 backdrop-blur-[3px] transition-all duration-500 z-10 pointer-events-none ${isPlaying ? "opacity-0 backdrop-blur-none" : "opacity-100"
        }`} />

      {/* Premium Vignette Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/25 via-transparent to-black/75 z-10 pointer-events-none" />

      {/* View count pill with backdrop blur */}
      <div className="absolute right-3.5 top-3.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 px-2.5 py-1 text-[10px] font-medium text-white flex items-center gap-1 shadow-sm z-20">
        <FiEye className="text-white/90" size={11} />
        <span>{r.views}</span>
      </div>

      {/* Centered Logo & Play Button (fades out when video is playing) */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center z-20 transition-all duration-500 ${isPlaying ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
        }`}>
        {/* Logo Image */}
        <div className="flex flex-col items-center mb-3 transition-transform duration-500 group-hover:scale-105">
          <img
            src="/images/logo/logo.webp"
            alt="Awesome Handmade Logo"
            className="w-12 h-12 object-contain mb-1 drop-shadow-md rounded-full bg-white/20 p-1"
          />
          <span className="font-heading text-sm tracking-[0.2em] text-white drop-shadow-md select-none opacity-95 uppercase font-bold">
            Awesome Handmade
          </span>
        </div>
        {/* Play Icon - Borderless and Center Positioned */}
        <div className="text-white drop-shadow-md transition-all duration-300 group-hover:scale-110 cursor-pointer flex items-center justify-center">
          <FiPlay className="text-white fill-white" size={32} />
        </div>
      </div>

      {/* Bottom info section */}
      <div className={`absolute inset-x-0 bottom-0 p-4.5 flex items-end justify-between text-white z-20 bg-linear-to-t from-black/85 via-black/20 to-transparent pt-12 transition-all duration-500 ${isPlaying ? "opacity-0 translate-y-3 pointer-events-none" : "opacity-100 translate-y-0"}`}>
        <p className="text-xs md:text-sm font-semibold tracking-wide drop-shadow-sm line-clamp-1">{r.title}</p>
        <div className="flex items-center gap-1 text-[11px] opacity-90 shrink-0 bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/5 shadow-sm">
          <FiHeart className="text-white fill-white/25 transition-colors group-hover:fill-red-500 group-hover:text-red-500" size={11} />
          <span className="font-medium">{r.likes}</span>
        </div>
      </div>

      {/* Related Product Card (floating overlay visible on hover/play) */}
      {r.relatedProduct && (
        <div className={`absolute bottom-3.5 left-3.5 right-3.5 z-25 bg-white/95 backdrop-blur-md border border-white/20 rounded-xl p-2.5 flex items-center justify-between shadow-lg transition-all duration-500 ${isPlaying ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"}`}>
          <div className="flex items-center gap-2">
            <img src={r.relatedProduct.img} alt={r.relatedProduct.name} className="w-10 h-10 object-cover rounded-lg border border-zinc-200" />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-zinc-900 line-clamp-1 leading-tight">{r.relatedProduct.name}</span>
              <span className="text-[10px] text-zinc-500 font-medium mt-0.5">{r.relatedProduct.price}</span>
            </div>
          </div>
          <a href={r.relatedProduct.link} className="bg-[#798A7A] hover:bg-[#687769] text-white text-[9px] font-bold tracking-wider px-3 py-1.5 rounded-lg uppercase shadow-sm transition-all duration-300">
            Shop
          </a>
        </div>
      )}
    </div>
  );
}
