# Equi Saddles E-commerce Application

## Overview

This is a full-stack e-commerce application specialized in selling equestrian saddles. The application is built with a modern tech stack featuring React with TypeScript on the frontend, Express.js backend, and PostgreSQL database. The application supports multiple languages (FR, EN, NL, ES, DE), integrates with Stripe for payments, includes an admin panel for content management, and features comprehensive DPD shipping integration with real-time calculation capabilities. The application is now fully responsive and optimized for mobile devices.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### July 23, 2025 - Legal Protection Pages Implementation
- Created comprehensive legal protection framework for business liability protection
- Added 6 complete legal pages: Support, Privacy Policy, Terms & Conditions, Returns & Exchanges, Delivery Information, and Customer Service Excellence
- Implemented clear limitation of liability clauses, specifically excluding responsibility for transport damages
- Established professional customer service standards and satisfaction guarantees
- Added comprehensive GDPR-compliant privacy policy with data protection measures
- Created detailed return policy with clear conditions and procedures
- Integrated DPD shipping information with transport responsibility limitations
- Updated footer navigation with links to all legal pages
- Enhanced business credibility and customer trust through professional legal framework
- Added complete multi-language translations for all legal pages across 5 languages (FR, EN, NL, ES, DE)
- Integrated translation system for all legal page titles and subtitles

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