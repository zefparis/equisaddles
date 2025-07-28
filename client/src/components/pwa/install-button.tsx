import { Download, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { useInstallPrompt } from '../../hooks/use-install-prompt';
import { useToast } from '../../hooks/use-toast';
import { useLanguage } from '../../hooks/use-language';

export function InstallButton() {
  const { canInstall, isInstalled, installApp } = useInstallPrompt();
  const { toast } = useToast();
  const { t } = useLanguage();

  if (isInstalled) {
    return (
      <Button variant="outline" size="sm" disabled className="gap-2">
        <Check className="h-4 w-4" />
        {t("pwa.install")} ✓
      </Button>
    );
  }

  if (!canInstall) {
    return null;
  }

  const handleInstall = async () => {
    const success = await installApp();
    
    if (success) {
      toast({
        title: "Installation réussie",
        description: "L'application Equi Saddles a été installée sur votre appareil.",
      });
    } else {
      toast({
        title: "Installation annulée",
        description: "Vous pouvez installer l'application plus tard depuis le menu de votre navigateur.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={handleInstall}
      variant="outline" 
      size="sm" 
      className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
    >
      <Download className="h-4 w-4" />
      {t("pwa.install")}
    </Button>
  );
}