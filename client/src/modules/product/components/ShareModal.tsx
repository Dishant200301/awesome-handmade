import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiCopy,
  FiCheck,
  FiShare2,
} from "react-icons/fi";
import {
  FaWhatsapp,
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
} from "react-icons/fa";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  productName,
}) => {
  const [copied, setCopied] = useState(false);
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(`Check out ${productName} on Awesome Handmade!`);

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      bg: "bg-emerald-500 hover:bg-emerald-600",
      url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      name: "Facebook",
      icon: FaFacebookF,
      bg: "bg-blue-600 hover:bg-blue-700",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "Twitter / X",
      icon: FaTwitter,
      bg: "bg-sky-500 hover:bg-sky-600",
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      name: "Pinterest",
      icon: FaPinterestP,
      bg: "bg-rose-600 hover:bg-rose-700",
      url: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl z-10 border border-neutral-100 space-y-5"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-900 font-bold text-base">
              <FiShare2 size={18} />
              <span>Share Product</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
            >
              <FiX size={18} />
            </button>
          </div>

          <p className="text-xs text-neutral-500 font-medium line-clamp-2">
            {productName}
          </p>

          {/* Social Icons Grid */}
          <div className="grid grid-cols-4 gap-3 py-2">
            {shareLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div
                    className={`w-12 h-12 rounded-full text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 ${item.bg}`}
                  >
                    <Icon size={20} />
                  </div>
                  <span className="text-[10px] font-semibold text-neutral-600 group-hover:text-black">
                    {item.name}
                  </span>
                </a>
              );
            })}
          </div>

          {/* Copy Link Input */}
          <div className="space-y-1.5 pt-2 border-t border-neutral-100">
            <span className="text-[11px] font-bold text-neutral-700">Page Link</span>
            <div className="flex items-center gap-2 p-1.5 bg-neutral-100 rounded-xl border border-neutral-200">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="w-full bg-transparent text-xs font-mono text-neutral-600 px-2 focus:outline-none truncate"
              />
              <button
                onClick={handleCopy}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                  copied
                    ? "bg-emerald-600 text-white"
                    : "bg-black text-white hover:bg-neutral-800"
                }`}
              >
                {copied ? (
                  <>
                    <FiCheck size={14} /> Copied!
                  </>
                ) : (
                  <>
                    <FiCopy size={14} /> Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
