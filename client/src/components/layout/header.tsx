import { useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "../../hooks/use-language";
import { useCart } from "../../hooks/use-cart";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Badge } from "../ui/badge";
import { Menu, ShoppingCart, Globe, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import CartModal from "../cart/cart-modal";
import { InstallButton } from "../pwa/install-button";
import { InstallButtonDesktop } from "../pwa/install-button-desktop";

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
            {/* PWA Install Button - Hidden on mobile */}
            <div className="hidden md:block">
              <InstallButtonDesktop />
            </div>
            
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 hover:text-accent text-white">
                  <Globe className="h-4 w-4 text-white" />
                  <span className="flex items-center">{currentLanguage?.flag}</span>
                  <span className="text-sm text-white">{language.toUpperCase()}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border shadow-lg">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`cursor-pointer text-black ${language === lang.code ? 'bg-accent' : ''}`}
                  >
                    <span className="mr-2 flex items-center">{lang.flag}</span>
                    {lang.name}
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

            {/* Mobile Menu Toggle */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden text-white">
                  <Menu className="h-5 w-5 text-white" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg hover:text-accent transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  {/* PWA Install Button in Mobile Menu */}
                  <div className="pt-4 border-t">
                    <InstallButton />
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
