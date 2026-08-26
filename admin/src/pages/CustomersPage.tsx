import React, { useState } from 'react';
import { Users, Mail, Phone, ShoppingBag, Heart, MapPin, Star, Calendar, Clock, Eye, Search } from 'lucide-react';
import { MOCK_CUSTOMERS } from '../data/mockAdminData';
import { Customer } from '../types/admin';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { motion, AnimatePresence } from 'framer-motion';

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'orders' | 'wishlist' | 'addresses' | 'reviews'>('profile');

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6 font-sans selection:bg-black selection:text-white pb-12">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-black tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-black" />
            <span>Customer Relationship Management (CRM)</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Customer profiles, lifetime value, purchase histories, wishlists, and activity timelines.
          </p>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative w-full max-w-md">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search customer name, email, phone..."
          className="w-full bg-white text-xs text-black pl-9 pr-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:border-black shadow-2xs font-normal"
        />
      </div>

      {/* CUSTOMER TABLE */}
      <div className="bg-white border border-neutral-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50/70 border-b border-neutral-200">
                <TableHead className="font-semibold text-black text-xs">Customer Name</TableHead>
                <TableHead className="font-semibold text-black text-xs">Contact Info</TableHead>
                <TableHead className="font-semibold text-black text-xs">Total Orders</TableHead>
                <TableHead className="font-semibold text-black text-xs">Total Spent</TableHead>
                <TableHead className="font-semibold text-black text-xs">Status</TableHead>
                <TableHead className="font-semibold text-black text-xs">Joined Date</TableHead>
                <TableHead className="font-semibold text-black text-xs text-right">View Profile</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((c) => (
                <TableRow
                  key={c.id}
                  onClick={() => {
                    setSelectedCustomer(c);
                    setActiveSubTab('profile');
                  }}
                  className="hover:bg-neutral-50 transition-colors cursor-pointer text-xs"
                >
                  <TableCell className="font-bold text-black flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-black text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {c.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span>{c.name}</span>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-black flex items-center gap-1"><Mail className="w-3 h-3 text-neutral-400" /> {c.email}</p>
                    <p className="text-[10px] text-neutral-500 flex items-center gap-1"><Phone className="w-3 h-3 text-neutral-400" /> {c.phone}</p>
                  </TableCell>
                  <TableCell className="font-semibold text-neutral-800">{c.ordersCount} orders</TableCell>
                  <TableCell className="font-bold text-black">₹{c.totalSpent}</TableCell>
                  <TableCell>
                    <Badge variant="success" className="text-[10px]">
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-neutral-500 font-mono">{c.joinedDate}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCustomer(c);
                        setActiveSubTab('profile');
                      }}
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto"
                    >
                      <Eye className="w-4 h-4 text-neutral-600 hover:text-black" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* RICH CUSTOMER PROFILE MODAL */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-neutral-200 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl my-8 font-sans"
            >
              {/* Profile Header */}
              <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-black text-white font-bold text-base flex items-center justify-center">
                    {selectedCustomer.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-black">{selectedCustomer.name}</h2>
                    <p className="text-xs text-neutral-500">{selectedCustomer.email} &bull; {selectedCustomer.phone}</p>
                  </div>
                </div>
                <Button onClick={() => setSelectedCustomer(null)} variant="outline" size="sm">
                  Close Profile
                </Button>
              </div>

              {/* TABS NAVIGATION */}
              <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
                <button
                  onClick={() => setActiveSubTab('profile')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    activeSubTab === 'profile' ? 'bg-black text-white' : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  Overview &amp; Stats
                </button>
                <button
                  onClick={() => setActiveSubTab('orders')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    activeSubTab === 'orders' ? 'bg-black text-white' : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  Orders History ({selectedCustomer.ordersCount})
                </button>
                <button
                  onClick={() => setActiveSubTab('wishlist')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    activeSubTab === 'wishlist' ? 'bg-black text-white' : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  Wishlist (3 Items)
                </button>
                <button
                  onClick={() => setActiveSubTab('addresses')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    activeSubTab === 'addresses' ? 'bg-black text-white' : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  Saved Addresses
                </button>
              </div>

              {/* TAB CONTENT: OVERVIEW */}
              {activeSubTab === 'profile' && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Total Spent</span>
                      <span className="text-lg font-bold text-black">₹{selectedCustomer.totalSpent}</span>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Total Orders</span>
                      <span className="text-lg font-bold text-black">{selectedCustomer.ordersCount}</span>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Joined Date</span>
                      <span className="text-xs font-bold text-black font-mono mt-1 block">{selectedCustomer.joinedDate}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                    <h4 className="font-semibold text-black">Activity Timeline &amp; History</h4>
                    <ul className="space-y-1.5 text-neutral-600">
                      <li className="flex items-center gap-2">&bull; <span className="font-mono text-neutral-400">2026-07-30:</span> Placed order #AAR-98214 (₹1,897)</li>
                      <li className="flex items-center gap-2">&bull; <span className="font-mono text-neutral-400">2026-06-12:</span> Added 3 items to Wishlist</li>
                      <li className="flex items-center gap-2">&bull; <span className="font-mono text-neutral-400">2026-01-15:</span> Created account &amp; verified email</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: ORDERS */}
              {activeSubTab === 'orders' && (
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between font-medium">
                    <div>
                      <p className="font-bold text-black">Order #AAR-98214</p>
                      <p className="text-[10px] text-neutral-500">2026-07-30 &bull; 2 Items</p>
                    </div>
                    <span className="font-bold text-black">₹1,897 &bull; <Badge variant="success">PAID</Badge></span>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: WISHLIST */}
              {activeSubTab === 'wishlist' && (
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral-200 rounded-lg shrink-0"></div>
                    <div>
                      <p className="font-bold text-black">Women's Seamless Padded Bralette</p>
                      <p className="text-neutral-500">₹799 &bull; Color: Blush Pink</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: ADDRESSES */}
              {activeSubTab === 'addresses' && (
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-1">
                  <p className="font-bold text-black">Default Shipping Address</p>
                  <p className="text-neutral-700">Flat 402, Highline Residency, Bandra West</p>
                  <p className="text-neutral-500">Mumbai, Maharashtra - 400050</p>
                </div>
              )}

              <div className="flex justify-end pt-3 border-t border-neutral-200">
                <Button onClick={() => setSelectedCustomer(null)} variant="default" size="sm" className="bg-black text-white">
                  Close Customer Card
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
