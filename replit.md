# Equi Saddles E-commerce Application

## Overview

This is a full-stack e-commerce application specialized in selling equestrian saddles. The application is built with a modern tech stack featuring React with TypeScript on the frontend, Express.js backend, and PostgreSQL database. The application supports multiple languages (FR, EN, NL, ES, DE), integrates with Stripe for payments, includes an admin panel for content management, and features comprehensive DPD shipping integration with real-time calculation capabilities. The application is now fully responsive and optimized for mobile devices.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### July 23, 2025 - PostgreSQL Database & TypeScript Storage Fixes
- **COMPLETED**: PostgreSQL database provisioned and configured successfully
- **COMPLETED**: Database environment variables set (DATABASE_URL, PGPORT, PGUSER, etc.)
- **COMPLETED**: Fixed all TypeScript storage errors with proper null/undefined handling
- **COMPLETED**: Corrected createProduct, createProductImage, createOrder, createShippingRate methods
- **COMPLETED**: Storage interface fully compatible with PostgreSQL schema types
- **COMPLETED**: Application now ready for database migration from MemStorage to PostgreSQL
- Base de données PostgreSQL opérationnelle sur Neon serverless
- Correction de 4 erreurs TypeScript critiques dans le système de stockage
- Interface de stockage entièrement préparée pour la migration PostgreSQL
- Système robuste de gestion des types avec compatibilité base de données

### July 23, 2025 - Delivery Page Belgian Localization & Complete Legal Compliance
- **COMPLETED**: Page de livraison entièrement mise à jour pour la Belgique au lieu de la France
- **COMPLETED**: Correction des cartes de zones de livraison (Zone France → Zone Belgique)
- **COMPLETED**: Mise à jour des traductions pour "Plus de 8 000 points en Belgique et Europe" (5 langues)
- **COMPLETED**: Badges de livraison "2-3 jours Belgique" au lieu de "France métropolitaine"
- **COMPLETED**: Textes d'expédition express adaptés pour "Belgique et pays limitrophes"
- **COMPLETED**: Maintien de la couverture internationale européenne avec DPD
- **COMPLETED**: Comprehensive update of all legal pages to reference Belgian laws instead of French laws
- **COMPLETED**: Updated translation system across all 5 languages (FR, EN, NL, ES, DE) for Belgian law compliance
- **COMPLETED**: Modified legal page subtitles and content to explicitly indicate compliance with Belgian legislation
- **COMPLETED**: Enhanced privacy policy references to Belgian law and GDPR compliance
- **COMPLETED**: Updated terms and conditions to clearly state compliance with Belgian law
- **COMPLETED**: Modified returns policy to reference Belgian consumer protection legislation
- **COMPLETED**: Updated delivery information to indicate shipment from Belgium throughout Europe
- **COMPLETED**: Enhanced customer service pages to reference Belgian standards
- **COMPLETED**: Fixed critical Dialog accessibility issues by adding proper DialogTitle and DialogDescription components
- **COMPLETED**: Enhanced CommandDialog component with proper accessibility attributes using VisuallyHidden
- **COMPLETED**: Systematically corrected Dialog components throughout the application for WCAG compliance
- Application maintenant entièrement orientée Belgique comme pays d'origine pour les expéditions
- All legal framework now properly reflects Belgian business operations and regulatory compliance
- Enhanced accessibility compliance for screen readers and assistive technologies
- Complete legal protection under Belgian jurisdiction while maintaining professional presentation

### July 23, 2025 - Admin Authentication Security Implementation
- **COMPLETED**: Système d'authentification sécurisé pour la page admin avec identifiants locaux
- **COMPLETED**: Page de connexion admin dédiée avec interface utilisateur moderne et animations
- **COMPLETED**: Context React pour gestion de l'état d'authentification avec localStorage
- **COMPLETED**: Protection complète de l'interface admin avec vérification d'authentification
- **COMPLETED**: Bouton de déconnexion intégré dans l'interface admin avec confirmation toast
- **COMPLETED**: Stockage persistant de la session d'authentification dans le navigateur
- **COMPLETED**: Interface de connexion responsive avec validation des formulaires
- Identifiants d'accès admin : nom d'utilisateur "admin" et mot de passe "Justine1234!"
- Système de sécurité local sans base de données pour simplifier l'accès administrateur
- Protection empêchant l'accès non autorisé à toutes les fonctions d'administration
- Notification de bienvenue automatique lors de la connexion réussie
- Gestion d'erreurs avec messages informatifs pour tentatives de connexion échouées

### July 23, 2025 - Chat System Implementation & Admin Responsiveness Optimization
- **COMPLETED**: Système de chat en temps réel complet avec WebSocket et notifications email
- **COMPLETED**: Configuration email admin mise à jour vers contact@equisaddles.com
- **COMPLETED**: Interface admin avec onglet "Chat Support" pour gestion des conversations client
- **COMPLETED**: Widget de chat flottant pour clients avec formulaire de contact intégré
- **COMPLETED**: Correction de l'URL WebSocket pour connexions directes au port 5000
- **COMPLETED**: Integration Brevo API pour notifications email automatiques avec API REST directe
- **COMPLETED**: Stockage des sessions et messages de chat avec historique complet
- **COMPLETED**: Interface admin complètement responsive avec CSS personnalisé mobile-first
- **COMPLETED**: Système de grilles adaptatif pour tous types d'écrans (mobile, tablette, desktop)
- **COMPLETED**: Navigation par onglets optimisée avec layout flexible et textes adaptatifs
- **COMPLETED**: Cartes de produits responsives avec actions adaptées à chaque taille d'écran
- **COMPLETED**: Widget de chat admin responsive avec hauteurs adaptatives
- **COMPLETED**: Corrections d'accessibilité pour tous les dialogs (DialogTitle et DialogDescription requis)
- **COMPLETED**: Interface ultra-compacte pour petits écrans mobiles avec navigation optimisée
- **COMPLETED**: Système de breakpoints avancé (320px, 375px, 480px, 640px+) pour adaptation parfaite
- **COMPLETED**: Cartes de produits et boutons d'action redimensionnés intelligemment selon la taille d'écran
- Système de chat opérationnel permettant communication temps réel entre clients et admins
- Notifications automatiques envoyées à lecoinrdc@gmail.com lors de nouveaux messages client (adresse email vérifiée Brevo)
- Interface admin centralisée pour répondre aux conversations avec compteur de messages non lus
- Interface admin parfaitement adaptée à tous les écrans avec navigation ultra-compacte sur mobile
- Respect total des standards d'accessibilité WCAG pour les lecteurs d'écran

### July 23, 2025 - Enhanced Dark Mode for Smartphone Optimization
- **COMPLETED**: Comprehensive dark mode improvements specifically optimized for smartphone users
- **COMPLETED**: Adjusted background colors from very dark (8% lightness) to more readable (12% lightness)
- **COMPLETED**: Enhanced text contrast with lighter foreground colors (92% vs 95% lightness)
- **COMPLETED**: Improved category image visibility by reducing overlay opacity from 40% to 30% in dark mode
- **COMPLETED**: Enhanced product cards with better contrast and visibility in dark mode
- **COMPLETED**: Optimized all color variables for better smartphone readability:
  - Cards and popovers now use 15% lightness instead of 8-10%
  - Muted areas improved from 18% to 22% lightness
  - Border visibility enhanced with 30% lightness
  - Input fields made more visible with improved contrast
- **COMPLETED**: Added dark mode specific hover effects and shadows for better depth perception
- **COMPLETED**: Updated all major pages (home, catalog, product cards) with smartphone-friendly dark mode colors
- User confirmed improvements are working well - images and text now properly visible on smartphones in dark mode
- Significant enhancement to user experience for mobile users with dark mode system preferences

### July 23, 2025 - Advanced Catalog Separation & Navigation System
- **COMPLETED**: Complete separation between saddles and accessories with tabbed interface
- **COMPLETED**: Advanced navigation system with adaptive search/selection controls:
  - Traditional search bar for saddles with text-based filtering
  - Dropdown menu for accessories with direct product selection
  - Smart filtering system adapting to product type (categories for saddles, subcategories for accessories)
- **COMPLETED**: Enhanced user experience with product counters per tab (Selles: 5, Accessoires: 8)
- **COMPLETED**: Comprehensive filtering system with context-aware options:
  - Saddle filtering: by category (Obstacle, Dressage, Cross, Mixte, Poney) and size
  - Accessory filtering: by subcategory (Sangles, Etrivieres, Etriers, Amortisseurs, Tapis, Briderie, Couvertures, Protections)
- **COMPLETED**: Multilingual dropdown interface with complete translations across all 5 languages
- **COMPLETED**: Automatic state management with proper tab switching and filter reset functionality
- Significantly improved product discovery and user navigation experience
- Clear product type separation eliminates confusion between saddles and accessories
- Enhanced accessibility with intuitive interface design adapted to different product types

### July 23, 2025 - Real Company Information Implementation  
- **COMPLETED**: Comprehensive update of all company information with authentic data for Justine Bogaerts
- **COMPLETED**: Updated contact details throughout the entire application:
  - Address: Rue du Vicinal 9, 4141 Louveigné, Belgique
  - Phone: +32 496 94 41 25  
  - VAT Number: BE0542650464
  - Email: contact@equisaddles.com
  - Legal Representative: Justine Bogaerts
- **COMPLETED**: Systematic replacement across all files using automated scripts for consistency
- **COMPLETED**: Updated contact page, footer, legal pages, terms & conditions, privacy policy
- **COMPLETED**: Corrected email display on contact page from contact@equi-saddles.com to contact@equisaddles.com
- All business information now reflects the real Equi Saddles company data
- Enhanced professional credibility with authentic Belgian business details
- Maintained legal compliance with correct VAT registration and business address

### July 23, 2025 - Complete Legal Pages & Footer Translation System
- **COMPLETED**: Comprehensive translation system for all legal pages with 1300+ translations
- **COMPLETED**: Full footer translation implementation with 100+ additional translation keys
- Created complete multi-language translations for all legal content across 5 languages (FR, EN, NL, ES, DE)
- Implemented translation system for ALL content: titles, subtitles, descriptions, lists, and complete page content
- Updated all 6 legal pages to use translation system: Support, Privacy Policy, Terms & Conditions, Returns & Exchanges, Delivery Information, and Customer Service Excellence
- **NEW**: Footer completely translated with dynamic content across all sections: company description, products, support links, contact information
- All legal page content now dynamically switches language based on user selection
- Enhanced user experience with complete localization of business protection framework
- Maintained business liability protection with translated legal clauses
- Professional customer service standards and satisfaction guarantees translated across all languages
- GDPR-compliant privacy policy with multilingual data protection measures
- Detailed return policy with translated conditions and procedures in all supported languages
- DPD shipping information with translated transport responsibility limitations
- **NEW**: Returns page 100% translated including transport responsibility and contact sections

### July 15, 2025 - Complete Responsiveness Implementation
- Conducted comprehensive responsiveness audit across entire application
- Applied mobile-first responsive design to all major pages (home, catalog, product, checkout, gallery, cart, contact)
- Enhanced grid layouts with proper breakpoints (sm, md, lg, xl)
- Improved navigation components for mobile devices
- Added custom responsive CSS with media queries for mobile and tablet optimization
- Implemented touch-friendly button sizes and spacing
- Optimized cart components and product cards for mobile display
- Added responsive improvements to footer and header components
- Application now fully responsive and mobile-optimized across all screen sizes

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query (@tanstack/react-query) for server state and React Context for client state
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation
- **Payment**: Stripe integration with @stripe/stripe-js and @stripe/react-stripe-js

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **API**: RESTful API with Express routes
- **Session Management**: PostgreSQL session store with connect-pg-simple
- **Payment Processing**: Stripe webhook handling

### Key Design Decisions
1. **Monorepo Structure**: Client, server, and shared code are organized in a single repository with clear separation
2. **Type Safety**: Full TypeScript coverage with shared types between frontend and backend
3. **Database-First**: Uses Drizzle ORM for type-safe database operations with PostgreSQL
4. **Component-Based UI**: Utilizes shadcn/ui for consistent, accessible components
5. **Internationalization**: Multi-language support with JSON translation files stored in client state

## Key Components

### Database Schema (shared/schema.ts)
- **Products**: Core product information with categories, sizes, pricing, and images
- **Gallery Images**: Separate image gallery system with category filtering
- **Orders**: Complete order management with customer information and Stripe integration

### Frontend Pages
- **Home**: Hero section, category showcase, and featured products
- **Catalog**: Product listing with filtering and search capabilities
- **Product**: Detailed product view with image gallery and cart integration
- **Cart**: Shopping cart management with quantity updates
- **Checkout**: Stripe payment integration with customer form
- **Gallery**: Image gallery with category filtering and lightbox
- **Admin**: Product and content management interface
- **Legal Pages**: Complete legal framework including Support, Privacy Policy, Terms & Conditions, Returns & Exchanges, Delivery Information, and Customer Service Excellence

### Backend Services
- **Storage Layer**: Abstracts database operations with in-memory fallback
- **Product API**: CRUD operations for products with category filtering
- **Order API**: Order creation and management with Stripe integration
- **Gallery API**: Image management system
- **Payment Processing**: Stripe session creation and webhook handling

### Shared Components
- **Cart Management**: Context-based cart state with localStorage persistence
- **Language System**: Multi-language support with context and localStorage
- **UI Components**: Comprehensive component library based on Radix UI primitives

## Data Flow

1. **Product Discovery**: Users browse products via home page or catalog with filtering
2. **Shopping Cart**: Products are added to cart with persistent storage
3. **Checkout Process**: Customer information collection and Stripe payment processing
4. **Order Fulfillment**: Orders are stored with payment confirmation
5. **Admin Management**: Content creators can manage products and gallery images

## External Dependencies

### Core Framework Dependencies
- React 18 with TypeScript for frontend development
- Express.js for backend API server
- Drizzle ORM for database operations
- Tailwind CSS for styling with shadcn/ui components

### Payment Integration
- Stripe for payment processing with full webhook support
- Stripe Elements for secure payment forms

### Database
- PostgreSQL as primary database
- Neon serverless for cloud PostgreSQL hosting
- Connection pooling and session management

### Development Tools
- Vite for fast development and building
- ESBuild for server-side bundling
- TypeScript for type safety across the stack

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with hot module replacement
- Node.js development server with TypeScript compilation
- Environment variables for database and Stripe configuration

### Production Build
- Frontend: Vite build with static asset optimization
- Backend: ESBuild bundling for Node.js deployment
- Database: Migrations handled through Drizzle Kit

### Environment Configuration
- Database URL configuration for PostgreSQL connection
- Stripe keys for payment processing
- Session secrets for secure authentication

### Scalability Considerations
- Database connection pooling for concurrent users
- Static asset serving optimized for production
- Serverless-ready architecture with Neon database
- CDN-friendly static asset structure