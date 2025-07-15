import { Link } from "wouter";
import { useLanguage } from "../../hooks/use-language";
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Equi Saddles</h3>
            <p className="text-gray-400 mb-4">
              {t("footer.aboutDescription")}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("footer.products")}</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/catalog?category=obstacle" className="hover:text-white transition-colors">{t("categories.obstacle")}</Link></li>
              <li><Link href="/catalog?category=dressage" className="hover:text-white transition-colors">{t("categories.dressage")}</Link></li>
              <li><Link href="/catalog?category=cross" className="hover:text-white transition-colors">{t("categories.cross")}</Link></li>
              <li><Link href="/catalog?category=mixte" className="hover:text-white transition-colors">{t("categories.mixte")}</Link></li>
              <li><Link href="/catalog?category=poney" className="hover:text-white transition-colors">{t("categories.poney")}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("footer.support")}</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">{t("footer.privacy")}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t("footer.terms")}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t("footer.returns")}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t("footer.shipping")}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t("footer.customerService")}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("footer.contact")}</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                123 Rue de l'Équitation, 75000 Paris
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                +33 1 23 45 67 89
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                contact@equi-saddles.com
              </li>
              <li className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {t("footer.opening")}
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-700 my-8" />
        <div className="text-center text-gray-400">
          <p>&copy; 2024 Equi Saddles. {t("footer.allRightsReserved")}.</p>
        </div>
      </div>
    </footer>
  );
}
