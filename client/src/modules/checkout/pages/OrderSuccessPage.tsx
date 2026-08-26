import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { OrderPayload } from "../types/checkout";
import CheckoutHeader from "../components/CheckoutHeader";
import Footer from "@/modules/core/components/Footer";
import { CheckCircle2, ShoppingBag, ArrowRight, MapPin, CreditCard, Calendar, Truck, FileText } from "lucide-react";

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const [order, setOrder] = useState<OrderPayload | null>(() => {
    if (location.state?.order) {
      return location.state.order;
    }
    // Fallback: try finding from LocalStorage
    try {
      const saved = localStorage.getItem("aaramly_orders_v1");
      if (saved) {
        const list: OrderPayload[] = JSON.parse(saved);
        return list.find((o) => o.orderId === orderId) || null;
      }
    } catch {}
    return null;
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const displayOrderId = orderId || order?.orderId || "#AAR-SUCCESS";

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans flex flex-col justify-between selection:bg-black selection:text-white">
      <CheckoutHeader activeStep={3} />

      <main className="py-12 sm:py-16 flex-1">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* SUCCESS BANNER */}
          <div className="p-8 sm:p-10 bg-emerald-50/70 border border-emerald-200 rounded-3xl text-center space-y-4 animate-in fade-in">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2]" />
            </div>

            <div className="space-y-1">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-emerald-950 uppercase tracking-tight">
                Order Placed Successfully!
              </h1>
              <p className="text-xs sm:text-sm text-emerald-800 font-medium">
                Thank you for shopping with AARAMLY. Confirmation details have been sent to your email.
              </p>
            </div>

            <div className="inline-block bg-white px-4 py-2 rounded-xl border border-emerald-200 shadow-2xs">
              <span className="text-xs text-zinc-500 font-medium block">Order Number</span>
              <span className="font-mono font-extrabold text-sm sm:text-base text-zinc-900 tracking-wider">
                {displayOrderId}
              </span>
            </div>
          </div>

          {/* ORDER DETAILS CARD */}
          {order ? (
            <div className="p-6 sm:p-8 bg-white rounded-2xl border border-zinc-200 shadow-2xs space-y-6">
              {/* DETAILS HEADER INFO GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-zinc-50 rounded-xl border border-zinc-100 text-xs">
                <div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase block">Date</span>
                  <span className="font-bold text-zinc-900">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase block">Payment Method</span>
                  <span className="font-bold text-zinc-900 uppercase">
                    {order.paymentMethod} ({order.paymentStatus})
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase block">Estimated Delivery</span>
                  <span className="font-bold text-emerald-700">
                    {order.estimatedDeliveryDate}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase block">Total Amount</span>
                  <span className="font-bold text-zinc-900 font-mono text-sm">
                    ₹{order.grandTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* ORDERED ITEMS LIST */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                  Ordered Items ({order.items.length})
                </h3>

                <div className="divide-y divide-zinc-100 border-t border-b border-zinc-100">
                  {order.items.map((item, idx) => (
                    <div key={item.id || idx} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || "https://images.unsplash.com/photo-1571513722275-4b41940f54b8"}
                          alt={item.productName}
                          className="w-14 h-16 rounded-lg object-cover bg-zinc-100 shrink-0 border border-zinc-200"
                        />
                        <div>
                          <h4 className="font-bold text-zinc-900 text-xs">{item.productName}</h4>
                          <p className="text-[11px] text-zinc-500 font-normal mt-0.5">
                            Color: <strong className="text-zinc-800">{item.colorName || "Standard"}</strong> | Size: <strong className="text-zinc-800">{item.size || "M"}</strong> | Qty: <strong className="text-zinc-800">{item.quantity}</strong>
                          </p>
                          {item.sku && (
                            <span className="font-mono text-[10px] text-zinc-400 block">SKU: {item.sku}</span>
                          )}
                        </div>
                      </div>

                      <div className="text-right font-mono font-bold text-zinc-900">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SHIPPING ADDRESS SUMMARY */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 text-xs">
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 space-y-1.5">
                  <span className="font-bold text-zinc-900 uppercase tracking-wider block text-[11px]">
                    Shipping Destination
                  </span>
                  <p className="text-zinc-700 font-medium leading-relaxed">
                    <strong>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</strong>
                    <br />
                    {order.shippingAddress.addressLine1}
                    {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
                    <br />
                    Phone: {order.shippingAddress.phone}
                  </p>
                </div>

                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 space-y-2 text-zinc-700">
                  <span className="font-bold text-zinc-900 uppercase tracking-wider block text-[11px]">
                    Payment Summary
                  </span>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-mono font-bold">₹{order.subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  {order.couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Coupon Discount:</span>
                      <span className="font-mono font-bold">-₹{order.couponDiscount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span className="font-mono font-bold">{order.shipping === 0 ? "FREE" : `₹${order.shipping}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-zinc-900 border-t border-zinc-200 pt-1.5">
                    <span>Total Paid:</span>
                    <span className="font-mono">₹{order.grandTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-zinc-50 rounded-2xl border border-zinc-200 text-xs text-zinc-500">
              Order confirmation details generated. Check your account dashboard for order history.
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/account">
              <button
                type="button"
                className="w-full sm:w-auto px-8 py-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-zinc-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-zinc-700" />
                <span>View My Orders</span>
              </button>
            </Link>

            <Link to="/shop">
              <button
                type="button"
                className="w-full sm:w-auto px-8 py-3.5 bg-zinc-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-white" />
                <span>Continue Shopping</span>
              </button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccessPage;
