import { ShippingRate } from "@shared/schema";

// Configuration DPD fictive mais simulation réelle
const DPD_CONFIG = {
  apiUrl: "https://api.dpd.fr/v1", // URL fictive
  username: "EQUI_SADDLES_TEST",
  password: "test_password_123",
  depot: "0174", // Dépôt DPD fictif
  customerId: "TEST123456"
};

export interface DPDShippingOption {
  service: string;
  serviceName: string;
  price: number;
  currency: string;
  deliveryTime: string;
  zone: string;
  description: string;
}

export interface DPDTrackingLabel {
  trackingNumber: string;
  labelUrl: string;
  reference: string;
}

export interface ShippingCalculationRequest {
  weight: number; // en kg
  country: string;
  postalCode: string;
  city: string;
  value: number; // valeur du colis
}

export class DPDService {
  private static instance: DPDService;

  // Zones de livraison DPD
  private static readonly ZONES = {
    domestic: ["FR", "MC"], // France métropolitaine et Monaco
    europe: ["DE", "BE", "NL", "LU", "IT", "ES", "PT", "AT", "CH", "GB", "IE", "DK", "SE", "NO", "FI", "PL", "CZ", "SK", "HU", "SI", "HR", "RO", "BG", "EE", "LV", "LT"],
    international: ["US", "CA", "AU", "JP", "CN", "BR", "IN", "MX", "AR", "CL", "CO", "PE", "UY", "VE", "EC", "BO", "PY", "SR", "GY", "FK"]
  };

  // Services DPD disponibles
  private static readonly SERVICES = {
    DPD_CLASSIC: {
      name: "DPD Classic",
      description: "Livraison standard à domicile",
      domestic: { baseRate: 8.50, deliveryTime: "2-3 jours" },
      europe: { baseRate: 15.90, deliveryTime: "3-5 jours" },
      international: { baseRate: 35.00, deliveryTime: "5-10 jours" }
    },
    DPD_RELAIS: {
      name: "DPD Relais",
      description: "Livraison en point relais",
      domestic: { baseRate: 5.90, deliveryTime: "2-3 jours" },
      europe: { baseRate: 12.90, deliveryTime: "3-5 jours" },
      international: null // Non disponible
    },
    DPD_PREDICT: {
      name: "DPD Predict",
      description: "Livraison avec créneau horaire",
      domestic: { baseRate: 10.90, deliveryTime: "1-2 jours" },
      europe: { baseRate: 18.90, deliveryTime: "2-4 jours" },
      international: null // Non disponible
    },
    DPD_EXPRESS: {
      name: "DPD Express",
      description: "Livraison express avant 12h",
      domestic: { baseRate: 18.90, deliveryTime: "1 jour" },
      europe: { baseRate: 28.90, deliveryTime: "1-2 jours" },
      international: { baseRate: 55.00, deliveryTime: "2-5 jours" }
    }
  };

  public static getInstance(): DPDService {
    if (!DPDService.instance) {
      DPDService.instance = new DPDService();
    }
    return DPDService.instance;
  }

  /**
   * Détermine la zone de livraison basée sur le pays
   */
  private getShippingZone(country: string): string {
    const countryCode = country.toUpperCase();
    
    if (DPDService.ZONES.domestic.includes(countryCode)) {
      return "domestic";
    } else if (DPDService.ZONES.europe.includes(countryCode)) {
      return "europe";
    } else {
      return "international";
    }
  }

  /**
   * Calcule le poids total des articles (simulation)
   */
  private calculateWeight(items: any[]): number {
    // Simulation : chaque selle pèse environ 3-5 kg
    const weights = {
      "Obstacle": 4.2,
      "Dressage": 3.8,
      "Cross": 4.5,
      "Mixte": 4.0,
      "Poney": 2.8
    };

    return items.reduce((total, item) => {
      const weight = weights[item.category as keyof typeof weights] || 4.0;
      return total + (weight * item.quantity);
    }, 0);
  }

  /**
   * Calcule les frais de port selon DPD
   */
  public async calculateShipping(request: ShippingCalculationRequest): Promise<DPDShippingOption[]> {
    const zone = this.getShippingZone(request.country);
    const options: DPDShippingOption[] = [];

    // Simulation d'un appel API DPD
    await new Promise(resolve => setTimeout(resolve, 200));

    for (const [serviceCode, serviceData] of Object.entries(DPDService.SERVICES)) {
      const zoneConfig = serviceData[zone as keyof typeof serviceData];
      
      if (!zoneConfig) continue;

      let price = zoneConfig.baseRate;
      
      // Majoration pour le poids (au-delà de 2kg)
      if (request.weight > 2) {
        price += (request.weight - 2) * 2.50;
      }

      // Majoration pour valeur élevée (assurance)
      if (request.value > 500) {
        price += request.value * 0.01; // 1% de la valeur
      }

      // Majoration pour zones éloignées (simulation)
      if (zone === "international") {
        price += 15.00;
      }

      options.push({
        service: serviceCode,
        serviceName: serviceData.name,
        price: Math.round(price * 100) / 100,
        currency: "EUR",
        deliveryTime: zoneConfig.deliveryTime,
        zone,
        description: serviceData.description
      });
    }

    return options.sort((a, b) => a.price - b.price);
  }

  /**
   * Génère un numéro de suivi DPD (simulation)
   */
  public generateTrackingNumber(): string {
    const prefix = "DPD";
    const depot = DPD_CONFIG.depot;
    const sequence = Math.floor(Math.random() * 9999999).toString().padStart(7, '0');
    return `${prefix}${depot}${sequence}`;
  }

  /**
   * Génère une étiquette d'expédition DPD (simulation)
   */
  public async generateShippingLabel(orderId: number, shippingData: any): Promise<DPDTrackingLabel> {
    // Simulation d'un appel API DPD
    await new Promise(resolve => setTimeout(resolve, 500));

    const trackingNumber = this.generateTrackingNumber();
    const reference = `EQS-${orderId.toString().padStart(6, '0')}`;
    
    // URL fictive pour l'étiquette PDF
    const labelUrl = `${DPD_CONFIG.apiUrl}/labels/${trackingNumber}.pdf`;

    return {
      trackingNumber,
      labelUrl,
      reference
    };
  }

  /**
   * Suivi de colis DPD (simulation)
   */
  public async trackPackage(trackingNumber: string): Promise<any> {
    // Simulation d'un appel API DPD
    await new Promise(resolve => setTimeout(resolve, 300));

    // Simulation d'états de suivi
    const states = [
      { status: "created", date: new Date(), location: "Dépôt DPD Paris" },
      { status: "in_transit", date: new Date(), location: "Centre de tri Lyon" },
      { status: "out_for_delivery", date: new Date(), location: "Agence locale" },
      { status: "delivered", date: new Date(), location: "Domicile" }
    ];

    return {
      trackingNumber,
      status: states[Math.floor(Math.random() * states.length)].status,
      events: states.slice(0, Math.floor(Math.random() * states.length) + 1)
    };
  }

  /**
   * Obtient les tarifs configurés
   */
  public getShippingRates(): ShippingRate[] {
    const rates: ShippingRate[] = [];

    for (const [serviceCode, serviceData] of Object.entries(DPDService.SERVICES)) {
      for (const [zone, config] of Object.entries(serviceData)) {
        if (zone === "name" || zone === "description" || !config) continue;

        rates.push({
          id: 0, // Sera assigné par la base de données
          zone,
          service: serviceCode,
          minWeight: "0",
          maxWeight: "30",
          baseRate: config.baseRate.toString(),
          perKgRate: "2.50",
          deliveryTime: config.deliveryTime,
          description: serviceData.description,
          active: true
        });
      }
    }

    return rates;
  }
}

export const dpdService = DPDService.getInstance();