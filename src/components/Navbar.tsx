
import { useState } from "react";
import { ArrowUpRight, Menu, Orbit, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "About", href: "#about" },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/[0.06] bg-[#080b14]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20">
            <Orbit size={23} className="text-white" />
          </div>

          <span className="text-xl font-bold tracking-tight text-white">
            Career<span className="text-violet-400">Verse</span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center gap-4 md:flex">
          <a
            href="/login"
            className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
          >
            Log in
          </a>

          {/* Improved Get Started Button */}
          <a
            href="/signup"
            className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:from-violet-500 hover:to-blue-500 hover:shadow-violet-500/30"
          >
            Get started
            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg border border-white/10 p-2 text-slate-300 transition hover:bg-white/5 hover:text-white md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-white/[0.06] bg-[#080b14] md:hidden"
          >
            <div className="flex flex-col gap-5 px-6 py-6">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}

              <div className="flex items-center gap-4 border-t border-white/[0.06] pt-5">
                <a
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
                >
                  Log in
                </a>

                <a
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-500/20 transition hover:from-violet-500 hover:to-blue-500"
                >
                  Get started
                  <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
