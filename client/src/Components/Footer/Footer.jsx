import React, { useState, useEffect } from "react";
import logo from "/MartXpresslogo-removebg-preview.png";
import {
  ShoppingBag,
  CreditCard,
  Shield,
  Truck,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Sun,
  Moon,
  Building,
  Package,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-linear-to-b from-gray-100 to-white dark:from-gray-900 dark:to-black text-gray-900 dark:text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section: Brand & Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-full bg-linear-to-r  flex items-center justify-center overflow-hidden">
                <img
                  src={logo}
                  alt="martXpress Logo"
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  mart<span className="text-primary">Xpress</span>
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Fastest Delivery, Best Prices
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Your one-stop destination for all shopping needs. Quality
              products, lightning-fast delivery, and unbeatable prices.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 bg-gray-200 dark:bg-gray-800 hover:bg-primary dark:hover:bg-primary rounded-lg transition-colors duration-300"
                aria-label="Facebook"
              >
                <Facebook
                  size={20}
                  className="text-gray-700 dark:text-gray-300"
                />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-200 dark:bg-gray-800 hover:bg-blue-500 rounded-lg transition-colors duration-300"
                aria-label="Twitter"
              >
                <Twitter
                  size={20}
                  className="text-gray-700 dark:text-gray-300"
                />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-200 dark:bg-gray-800 hover:bg-pink-600 rounded-lg transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram
                  size={20}
                  className="text-gray-700 dark:text-gray-300"
                />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-200 dark:bg-gray-800 hover:bg-red-600 rounded-lg transition-colors duration-300"
                aria-label="YouTube"
              >
                <Youtube
                  size={20}
                  className="text-gray-700 dark:text-gray-300"
                />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-200 dark:bg-gray-800 hover:bg-blue-700 rounded-lg transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin
                  size={20}
                  className="text-gray-700 dark:text-gray-300"
                />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-2 border-b border-gray-300 dark:border-gray-800">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                "Home",
                "Shop",
                "Categories",
                "Deals",
                "New Arrivals",
                "Best Sellers",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-2 border-b border-gray-300 dark:border-gray-800">
              Customer Service
            </h3>
            <ul className="space-y-3">
              {[
                "Contact Us",
                "FAQ",
                "Shipping Policy",
                "Return Policy",
                "Privacy Policy",
                "Terms of Service",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-2 border-b border-gray-300 dark:border-gray-800">
              Contact Info
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-primary mt-1 shrink-0" />
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  029, Gaya, Bihar 800023
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-primary shrink-0" />
                <a
                  href="tel:+919142364660"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors duration-300 text-sm"
                >
                  +91 91423 64660
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-primary shrink-0" />
                <a
                  href="mailto:support@martxpress.com"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors duration-300 text-sm"
                >
                  support@martxpress.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Features Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="p-3 rounded-full bg-primary/20">
              <Truck size={24} className="text-primary" />
            </div>
            <div>
              <h4 className="font-semibold">Free Shipping</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                On orders over ₹999
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="p-3 rounded-full bg-primary/20">
              <CreditCard size={24} className="text-primary" />
            </div>
            <div>
              <h4 className="font-semibold">Secure Payment</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                100% Secure & Safe
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="p-3 rounded-full bg-primary/20">
              <Shield size={24} className="text-primary" />
            </div>
            <div>
              <h4 className="font-semibold">Quality Products</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Guaranteed Quality
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="p-3 rounded-full bg-primary/20">
              <Phone size={24} className="text-primary" />
            </div>
            <div>
              <h4 className="font-semibold">24/7 Support</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Dedicated Support
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-linear-to-r from-primary/10 to-primary/5 border border-primary/20 dark:border-primary/30 rounded-xl p-6 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Get the latest updates on new products and upcoming sales
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-3 rounded-lg bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent grow md:grow-0 md:w-64"
              />
              <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors duration-300 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Payment Methods with Authentic Logos */}
        <div className="border-t border-gray-300 dark:border-gray-800 pt-8 mb-8">
          <h4 className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            We Accept
          </h4>
          <div className="flex flex-wrap gap-3 items-center">
            {/* Visa Logo */}
            <div className="px-3 py-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-800 flex items-center gap-2">
              <div className="w-16 h-6 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 100 32" fill="none">
                  <path d="M40 0H60V32H40V0Z" fill="#1434CB" />
                  <path d="M25.6 0H34.4V32H25.6V0Z" fill="#F79E1B" />
                  <path d="M11.2 0H20V32H11.2V0Z" fill="#ED1C24" />
                  <path d="M0 0H8.8V32H0V0Z" fill="#231F20" />
                </svg>
              </div>
            </div>

            {/* MasterCard Logo */}
            <div className="px-3 py-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-800 flex items-center gap-2">
              <div className="w-16 h-6 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 100 32" fill="none">
                  <circle cx="20" cy="16" r="12" fill="#EB001B" />
                  <circle cx="35" cy="16" r="12" fill="#F79E1B" />
                </svg>
              </div>
            </div>

            {/* PayPal Logo */}
            <div className="px-3 py-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-800 flex items-center gap-2">
              <div className="w-16 h-6 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 100 32" fill="none">
                  <path d="M80 0H100V32H80V0Z" fill="#253B80" />
                  <path d="M20 0H40V32H20V0Z" fill="#179BD7" />
                  <path d="M0 0H20V32H0V0Z" fill="#222D65" />
                </svg>
              </div>
            </div>

            {/* Apple Pay Logo */}
            <div className="px-3 py-2 bg-black dark:bg-gray-900 rounded-lg border border-gray-800 flex items-center gap-2">
              <div className="w-16 h-6 flex items-center justify-center">
                <span className="text-white font-bold text-sm"> Pay</span>
              </div>
            </div>

            {/* Google Pay Logo */}
            <div className="px-3 py-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-800 flex items-center gap-2">
              <div className="w-16 h-6 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 100 32" fill="none">
                  <path d="M30 0H70V32H30V0Z" fill="#4285F4" />
                  <path d="M70 0H100V32H70V0Z" fill="#34A853" />
                  <path d="M0 0H30V32H0V0Z" fill="#FBBC05" />
                  <path d="M30 0H70V16H30V0Z" fill="#EA4335" />
                </svg>
              </div>
            </div>

            {/* UPI */}
            <div className="px-3 py-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-800 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-2">
                <span className="text-white font-bold text-xs">UPI</span>
              </div>
              <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                UPI
              </span>
            </div>

            {/* Net Banking */}
            <div className="px-3 py-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-800 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center mr-2">
                <Building size={12} className="text-white" />
              </div>
              <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                Net Banking
              </span>
            </div>

            {/* COD */}
            <div className="px-3 py-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-800 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center mr-2">
                <Package size={12} className="text-white" />
              </div>
              <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                COD
              </span>
            </div>
          </div>
        </div>
        {/* Bottom Bar with Credentials */}
        <div className="border-t border-gray-300 dark:border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                © {new Date().getFullYear()}{" "}
                <span className="text-primary font-semibold">martXpress</span>.
                All rights reserved.
              </p>
            </div>

            <div className="flex items-center gap-4 flex-col sm:flex-row">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                  Designed & Developed by
                </p>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <div className="w-8 h-8 rounded-full bg-linear-to-r bg-primary flex items-center justify-center">
                    <span className="text-white font-bold text-xs">BP</span>
                  </div>
                  <p className="text-gray-900 dark:text-white font-medium">
                    <span className="text-primary">Bishwa Bandhu</span> Parmar
                  </p>
                </div>
              </div>

              <div className="h-8 w-px bg-gray-300 dark:bg-gray-700 hidden md:block"></div>

              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm transition-colors duration-300"
                >
                  Privacy
                </a>
                <span className="text-gray-400 dark:text-gray-600">•</span>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm transition-colors duration-300"
                >
                  Terms
                </a>
                <span className="text-gray-400 dark:text-gray-600">•</span>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm transition-colors duration-300"
                >
                  Sitemap
                </a>
              </div>
            </div>
          </div>

          {/* Download Apps with Images */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Download Our App
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Google Play Button with Image */}
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-800 flex items-center gap-2 transition-colors duration-300 hover:shadow-md"
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <img src="/ODF.png" alt="Google Play" className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Get it on
                  </p>
                  <p className="text-gray-900 dark:text-white text-sm font-semibold">
                    Google Play
                  </p>
                </div>
              </a>

              {/* App Store Button with Image */}
              <a
                href="https://www.apple.com/app-store/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-800 flex items-center gap-2 transition-colors duration-300 hover:shadow-md"
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <img src="/OIP.webp" alt="App Store" className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Download on the
                  </p>
                  <p className="text-gray-900 dark:text-white text-sm font-semibold">
                    App Store
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Border */}
      <div className="h-1 bg-linear-to-r from-transparent via-primary to-transparent"></div>
    </footer>
  );
};

export default Footer;
