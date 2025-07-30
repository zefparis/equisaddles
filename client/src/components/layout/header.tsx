import { useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "../../hooks/use-language";
import { useCart } from "../../hooks/use-cart";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Menu, ShoppingCart, Globe, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import CartModal from "../cart/cart-modal";

const languages = [
  { code: "fr", name: "Français", flag: <svg className="w-4 h-4" viewBox="0 0 24 16"><rect width="8" height="16" fill="#002654"/><rect x="8" width="8" height="16" fill="#ffffff"/><rect x="16" width="8" height="16" fill="#ce1126"/></svg> },
  { code: "en", name: "English", flag: <svg className="w-4 h-4" viewBox="0 0 24 16"><rect width="24" height="16" fill="#012169"/><path d="M0 0l24 16M24 0L0 16" stroke="#ffffff" strokeWidth="2"/><path d="M0 0l24 16M24 0L0 16" stroke="#c8102e" strokeWidth="1"/><path d="M12 0v16M0 8h24" stroke="#ffffff" strokeWidth="3"/><path d="M12 0v16M0 8h24" stroke="#c8102e" strokeWidth="1.5"/></svg> },
  { code: "nl", name: "Nederlands", flag: <svg className="w-4 h-4" viewBox="0 0 24 16"><rect width="24" height="5.33" fill="#ae1c28"/><rect width="24" height="5.33" y="5.33" fill="#ffffff"/><rect width="24" height="5.33" y="10.67" fill="#21468b"/></svg> },
  { code: "es", name: "Español", flag: <svg className="w-4 h-4" viewBox="0 0 24 16"><rect width="24" height="4" fill="#aa151b"/><rect width="24" height="8" y="4" fill="#f1bf00"/><rect width="24" height="4" y="12" fill="#aa151b"/></svg> },
  { code: "de", name: "Deutsch", flag: <svg className="w-4 h-4" viewBox="0 0 24 16"><rect width="24" height="5.33" fill="#000000"/><rect width="24" height="5.33" y="5.33" fill="#dd0000"/><rect width="24" height="5.33" y="10.67" fill="#ffce00"/></svg> },
];

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === language);

  const navigation = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.catalog"), href: "/catalog" },
    { name: t("nav.gallery"), href: "/gallery" },
    { name: t("nav.contact"), href: "/contact" },
  ];

  return (
    <header className="bg-primary text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold">Equi Saddles</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="hover:text-accent transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Header Actions */}
          <div className="flex items-center space-x-4">
            {/* PWA Install Button - Simple approach */}
            <button
              onClick={() => {
                if ('serviceWorker' in navigator) {
                  alert('Application PWA disponible ! Ajoutez cette page à votre écran d\'accueil depuis le menu de votre navigateur.');
                } else {
                  alert('Installation PWA disponible depuis le menu de votre navigateur.');
                }
              }}
              className="hidden sm:flex items-center space-x-2 px-3 py-2 text-sm text-white hover:text-accent border border-white/30 rounded-lg transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Installer</span>
            </button>
            
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 hover:text-accent text-white">
                  <Globe className="h-4 w-4 text-white" />
                  <span className="flex items-center">{currentLanguage?.flag}</span>
                  <span className="text-sm text-white">{language.toUpperCase()}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border shadow-lg z-50">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`cursor-pointer text-black hover:bg-gray-100 dark:hover:bg-gray-700 ${language === lang.code ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
                  >
                    <span className="mr-2 flex items-center">{lang.flag}</span>
                    <span className="text-black dark:text-white">{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart */}
            <Button
              variant="ghost"
              onClick={() => setIsCartOpen(true)}
              className="relative hover:text-accent text-white"
            >
              <ShoppingCart className="h-5 w-5 text-white" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-accent text-xs">
                  {totalItems}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu with PWA */}
            <div className="relative">
              <Button 
                variant="ghost" 
                className="md:hidden text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-5 w-5 text-white" />
              </Button>
              
              {isMobileMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border z-50">
                  <nav className="flex flex-col p-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="py-3 text-gray-800 hover:text-accent transition-colors duration-200 border-b border-gray-100"
                      >
                        {item.name}
                      </Link>
                    ))}
                    
                    {/* PWA Mobile Link */}
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        alert('Application PWA disponible ! Ajoutez cette page à votre écran d\'accueil depuis le menu de votre navigateur.');
                      }}
                      className="flex items-center space-x-3 py-3 text-gray-800 hover:text-accent transition-colors duration-200 border-t border-gray-200 mt-2 pt-4"
                    >
                      <Download className="h-5 w-5 text-accent" />
                      <span>Installer l'app</span>
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
