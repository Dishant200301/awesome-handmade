import { CartItem } from "@/modules/product/types/product";

export interface CheckoutContact {
  email: string;
  phone: string;
}

export interface ShippingAddress {
  id?: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  phone: string;
  saveAddress?: boolean;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  estimatedDays: string;
  price: number;
}

export type PaymentMethodType = 'upi' | 'card' | 'netbanking' | 'cod';

export interface UPIPaymentDetails {
  vpa: string;
}

export interface CardPaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

export interface Coupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  freeShipping?: boolean;
}

export interface OrderPayload {
  orderId: string;
  customer: CheckoutContact;
  shippingAddress: ShippingAddress;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethodType;
  paymentDetails?: {
    upiVpa?: string;
    cardLast4?: string;
  };
  coupon?: {
    code: string;
    discountAmount: number;
  };
  items: (CartItem & {
    itemTotal: number;
    attributesSummary?: string;
  })[];
  subtotal: number;
  discount: number;
  couponDiscount: number;
  shipping: number;
  tax: number;
  grandTotal: number;
  status: 'Processing' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  createdAt: string;
  estimatedDeliveryDate: string;
}
