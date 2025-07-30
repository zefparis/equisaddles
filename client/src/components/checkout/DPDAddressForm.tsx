import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/use-language";

interface Country {
  code: string;
  name: string;
  postalCodeFormat: string;
  postalCodeExample: string;
  postalCodePattern: RegExp;
  maxLength: number;
  zone: 'domestic' | 'europe' | 'international';
}

// Configuration DPD officielle avec formats de codes postaux par pays
const DPD_COUNTRIES: Country[] = [
  { code: 'BE', name: 'Belgique', postalCodeFormat: '9999', postalCodeExample: '4141', postalCodePattern: /^\d{4}$/, maxLength: 4, zone: 'domestic' },
  { code: 'LU', name: 'Luxembourg', postalCodeFormat: '9999', postalCodeExample: '1234', postalCodePattern: /^\d{4}$/, maxLength: 4, zone: 'domestic' },
  { code: 'FR', name: 'France', postalCodeFormat: '99999', postalCodeExample: '75001', postalCodePattern: /^\d{5}$/, maxLength: 5, zone: 'europe' },
  { code: 'NL', name: 'Pays-Bas', postalCodeFormat: '9999 AA', postalCodeExample: '1234 AB', postalCodePattern: /^\d{4}\s?[A-Z]{2}$/i, maxLength: 7, zone: 'europe' },
  { code: 'DE', name: 'Allemagne', postalCodeFormat: '99999', postalCodeExample: '10115', postalCodePattern: /^\d{5}$/, maxLength: 5, zone: 'europe' },
  { code: 'ES', name: 'Espagne', postalCodeFormat: '99999', postalCodeExample: '28001', postalCodePattern: /^\d{5}$/, maxLength: 5, zone: 'europe' },
  { code: 'IT', name: 'Italie', postalCodeFormat: '99999', postalCodeExample: '00118', postalCodePattern: /^\d{5}$/, maxLength: 5, zone: 'europe' },
  { code: 'AT', name: 'Autriche', postalCodeFormat: '9999', postalCodeExample: '1010', postalCodePattern: /^\d{4}$/, maxLength: 4, zone: 'europe' },
  { code: 'CH', name: 'Suisse', postalCodeFormat: '9999', postalCodeExample: '8001', postalCodePattern: /^\d{4}$/, maxLength: 4, zone: 'europe' },
  { code: 'GB', name: 'Royaume-Uni', postalCodeFormat: 'AA99 9AA', postalCodeExample: 'SW1A 1AA', postalCodePattern: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i, maxLength: 8, zone: 'international' },
  { code: 'US', name: 'États-Unis', postalCodeFormat: '99999', postalCodeExample: '10001', postalCodePattern: /^\d{5}(-\d{4})?$/, maxLength: 10, zone: 'international' },
  { code: 'CA', name: 'Canada', postalCodeFormat: 'A9A 9A9', postalCodeExample: 'K1A 0A6', postalCodePattern: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i, maxLength: 7, zone: 'international' }
];

interface DPDAddressFormProps {
  register: any;
  errors: any;
  control: any;
  setValue: any;
  watch: any;
}

export const DPDAddressForm: React.FC<DPDAddressFormProps> = ({
  register,
  errors,
  control,
  setValue,
  watch
}) => {
  const { t } = useLanguage();
  const [selectedCountry, setSelectedCountry] = useState<Country>(DPD_COUNTRIES[0]);
  const [postalCodeValidation, setPostalCodeValidation] = useState<{
    isValid: boolean;
    message: string;
    suggestion?: string;
  }>({ isValid: true, message: '' });

  const watchedCountry = watch('country') || 'BE';
  const watchedPostalCode = watch('postalCode') || '';
  const watchedCity = watch('city') || '';

  // Mettre à jour le pays sélectionné quand il change
  useEffect(() => {
    const country = DPD_COUNTRIES.find(c => c.code === watchedCountry);
    if (country) {
      setSelectedCountry(country);
      // Reset postal code when country changes
      if (watchedPostalCode) {
        setValue('postalCode', '');
      }
    }
  }, [watchedCountry, setValue, watchedPostalCode]);

  // Validation en temps réel du code postal
  useEffect(() => {
    if (watchedPostalCode && selectedCountry) {
      validatePostalCode(watchedPostalCode, selectedCountry);
    }
  }, [watchedPostalCode, selectedCountry]);

  const validatePostalCode = async (postalCode: string, country: Country) => {
    if (!postalCode) {
      setPostalCodeValidation({ isValid: true, message: '' });
      return;
    }

    const isFormatValid = country.postalCodePattern.test(postalCode);
    
    if (!isFormatValid) {
      setPostalCodeValidation({
        isValid: false,
        message: `Format invalide pour ${country.name}. Attendu: ${country.postalCodeExample}`,
        suggestion: `Format attendu: ${country.postalCodeFormat}`
      });
      return;
    }

    // Simulation d'appel DPD API pour validation (en attendant les vrais identifiants)
    try {
      // En production, ici on appellerait l'API DPD de géorouting
      // const result = await dpdGeoroutingService.validatePostcode(country.code, postalCode);
      setPostalCodeValidation({
        isValid: true,
        message: `✓ Code postal valide pour ${country.name}`
      });
    } catch (error) {
      setPostalCodeValidation({
        isValid: false,
        message: 'Code postal non reconnu par DPD'
      });
    }
  };

  const formatPostalCode = (value: string, country: Country): string => {
    // Nettoyer la valeur
    let cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    switch (country.code) {
      case 'NL':
        // Pays-Bas: 1234AB -> 1234 AB
        if (cleaned.length >= 4) {
          return cleaned.slice(0, 4) + (cleaned.length > 4 ? ' ' + cleaned.slice(4, 6) : '');
        }
        return cleaned;
        
      case 'GB':
        // Royaume-Uni: SW1A1AA -> SW1A 1AA
        if (cleaned.length > 4) {
          const firstPart = cleaned.slice(0, -3);
          const lastPart = cleaned.slice(-3);
          return firstPart + ' ' + lastPart;
        }
        return cleaned;
        
      case 'CA':
        // Canada: K1A0A6 -> K1A 0A6
        if (cleaned.length >= 3) {
          return cleaned.slice(0, 3) + (cleaned.length > 3 ? ' ' + cleaned.slice(3, 6) : '');
        }
        return cleaned;
        
      default:
        return cleaned;
    }
  };

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formatted = formatPostalCode(rawValue, selectedCountry);
    setValue('postalCode', formatted);
  };

  const getZoneBadgeColor = (zone: string) => {
    switch (zone) {
      case 'domestic': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'europe': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'international': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête DPD avec informations de zone */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-red-600 font-bold text-sm">DPD</span>
            </div>
            <div>
              <h3 className="font-semibold">Adresse de livraison DPD</h3>
              <p className="text-sm opacity-90">Expédition depuis Louveigné, Belgique</p>
            </div>
          </div>
          <Badge className={getZoneBadgeColor(selectedCountry.zone)}>
            Zone {selectedCountry.zone}
          </Badge>
        </div>
      </div>

      {/* Formulaire d'adresse */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Ville */}
        <div>
          <Label htmlFor="city">{t("checkout.city")} *</Label>
          <Input
            id="city"
            {...register("city")}
            placeholder={t("checkout.cityPlaceholder")}
            className={`${errors.city ? "border-red-500" : ""} bg-blue-50 dark:bg-gray-800`}
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
          )}
        </div>

        {/* Code postal avec validation DPD */}
        <div>
          <Label htmlFor="postalCode">
            {t("checkout.postalCode")} *
            <span className="text-xs text-muted-foreground ml-1">
              ({selectedCountry.postalCodeFormat})
            </span>
          </Label>
          <Input
            id="postalCode"
            value={watchedPostalCode}
            onChange={handlePostalCodeChange}
            placeholder={selectedCountry.postalCodeExample}
            maxLength={selectedCountry.maxLength}
            className={`${
              errors.postalCode || !postalCodeValidation.isValid ? "border-red-500" : 
              postalCodeValidation.isValid && watchedPostalCode ? "border-green-500" : ""
            } bg-blue-50 dark:bg-gray-800`}
          />
          {/* Validation feedback */}
          {watchedPostalCode && (
            <p className={`text-xs mt-1 ${
              postalCodeValidation.isValid ? 'text-green-600' : 'text-red-500'
            }`}>
              {postalCodeValidation.message}
            </p>
          )}
          {errors.postalCode && (
            <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Format: {selectedCountry.postalCodeExample} ({selectedCountry.name})
          </p>
        </div>

        {/* Pays avec zones DPD */}
        <div>
          <Label htmlFor="country">{t("checkout.country")} *</Label>
          <select
            id="country"
            {...register("country")}
            onChange={(e) => {
              setValue("country", e.target.value);
              setValue("postalCode", "");
            }}
            className={`flex h-10 w-full rounded-md border border-input bg-blue-50 dark:bg-gray-800 px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              errors.country ? "border-red-500" : ""
            }`}
          >
            {DPD_COUNTRIES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name} (Zone {country.zone})
              </option>
            ))}
          </select>
          {errors.country && (
            <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
          )}
          
          {/* Informations de zone DPD */}
          <div className="mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Badge className={getZoneBadgeColor(selectedCountry.zone)} variant="secondary">
                {selectedCountry.zone}
              </Badge>
              <span>
                {selectedCountry.zone === 'domestic' && 'Livraison Belgique/Luxembourg'}
                {selectedCountry.zone === 'europe' && 'Livraison Europe'}
                {selectedCountry.zone === 'international' && 'Livraison Internationale'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Informations de validation DPD */}
      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border">
        <div className="flex items-start gap-2">
          <div className="text-red-600 mt-0.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
              Validation d'adresse DPD
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              L'adresse sera validée automatiquement par le système DPD lors de la création de l'étiquette.
              Les formats de codes postaux sont vérifiés en temps réel selon les standards de chaque pays.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};