# Equi Saddles E-commerce Application

## Overview

This is a full-stack e-commerce application specializing in selling equestrian saddles. The application supports multiple languages and integrates with Stripe for payments. It includes an admin panel for content management and features comprehensive DPD shipping integration with real API implementation and real-time calculation capabilities. The application is fully responsive and optimized for mobile devices with complete PWA support. The business vision is to provide a modern, reliable platform for equestrian enthusiasts to purchase high-quality saddles and related accessories, aiming for significant market penetration in Europe.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query for server state, React Context for client state
- **Routing**: Wouter
- **Forms**: React Hook Form with Zod validation
- **Payment UI**: Stripe integration using `@stripe/stripe-js` and `@stripe/react-stripe-js`
- **UI/UX Decisions**: Responsive design for mobile/tablet/desktop, PWA support with intelligent installation prompts, dark mode optimization, clear product categorization (saddles/accessories), elegant typography (Cinzel/Playfair Display for logo), consistent golden accents for interactive elements, accessible components (WCAG compliant).

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL via Drizzle ORM
- **API**: RESTful endpoints
- **Session Management**: PostgreSQL session store
- **Authentication**: Local admin authentication (username: admin, password: Justine1234!)
- **Key Technical Implementations**: Real-time chat with WebSocket and email notifications (Brevo), comprehensive DPD API integration for shipping calculations and label generation, secure Stripe webhook handling, robust error handling, multilinguage support system.

### System Design Choices
- **Monorepo Structure**: `client/`, `server/`, `shared/`, `public/` for organized codebase.
- **Type Safety**: End-to-end type safety using TypeScript and Drizzle ORM.
- **Component-Based UI**: Reusable and accessible UI components built with shadcn/ui.
- **Internationalization**: JSON translation files for comprehensive multi-language support (FR, EN, NL, ES, DE).
- **Session Management**: Secure, persistent user sessions.
- **Admin Panel**: Dedicated interface for CRUD operations on products and content management.

## External Dependencies

- **Payment Gateway**: Stripe (for processing payments)
- **Database**: PostgreSQL (hosted on Neon serverless)
- **Email Service**: Brevo (for automated email notifications)
- **Shipping API**: DPD (for real-time shipping calculations and label generation)
- **Frontend Libraries**: React, Vite, Tailwind CSS, shadcn/ui, React Query, Wouter, React Hook Form, Zod.
- **Backend Libraries**: Node.js, Express.js, Drizzle ORM, connect-pg-simple.