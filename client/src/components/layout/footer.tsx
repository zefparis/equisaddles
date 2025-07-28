import { Link } from "wouter";
import { useLanguage } from "../../hooks/use-language";
import { useInstallPrompt } from "../../hooks/use-install-prompt";
import { useToast } from "../../hooks/use-toast";
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin, Clock, Download, Smartphone } from "lucide-react";

export default function Footer() {
  const { t } = useLanguage();
  const { installApp } = useInstallPrompt();
  const { toast } = useToast();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t("footer.company.name")}</h3>
            <p className="text-gray-400 mb-4">
              {t("footer.company.description")}
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
            <h4 className="text-lg font-semibold mb-4">{t("footer.products.title")}</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/catalog?category=obstacle" className="hover:text-white transition-colors">{t("footer.products.jumping")}</Link></li>
              <li><Link href="/catalog?category=dressage" className="hover:text-white transition-colors">{t("footer.products.dressage")}</Link></li>
              <li><Link href="/catalog?category=cross" className="hover:text-white transition-colors">{t("footer.products.cross")}</Link></li>
              <li><Link href="/catalog?category=mixte" className="hover:text-white transition-colors">{t("footer.products.versatile")}</Link></li>
              <li><Link href="/catalog?category=poney" className="hover:text-white transition-colors">{t("footer.products.young")}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("footer.support.title")}</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/privacy" className="hover:text-white transition-colors">{t("footer.support.privacy")}</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">{t("footer.support.terms")}</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">{t("footer.support.returns")}</Link></li>
              <li><Link href="/delivery" className="hover:text-white transition-colors">{t("footer.support.delivery")}</Link></li>
              <li><Link href="/customer-service" className="hover:text-white transition-colors">{t("footer.support.service")}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("footer.contact.title")}</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {t("footer.contact.address")}
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                {t("footer.contact.phone")}
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                {t("footer.contact.email")}
              </li>
              <li className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {t("footer.contact.hours")}
              </li>
              
              {/* PWA Install Link */}
              <li className="mt-4 pt-3 border-t border-gray-700">
                <div
                  onClick={async () => {
                    const success = await installApp();
                    if (success) {
                      toast({
                        title: "Installation réussie",
                        description: "L'application Equi Saddles a été installée sur votre appareil.",
                      });
                    } else {
                      toast({
                        title: "Installation",
                        description: "Vous pouvez installer l'application depuis le menu de votre navigateur.",
                      });
                    }
                  }}
                  className="flex items-center cursor-pointer hover:text-white transition-colors group"
                >
                  <Smartphone className="h-4 w-4 mr-2 group-hover:text-accent transition-colors" />
                  <span className="group-hover:text-accent transition-colors">{t("pwa.install")}</span>
                </div>
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
