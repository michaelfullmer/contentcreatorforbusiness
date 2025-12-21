# ContentCreator - AI Content Creation Platform

## Overview

ContentCreator is an AI-powered content creation platform designed for small businesses. It enables users to generate social media posts, emails, blog articles, and presentations using AI with professional templates. The application follows a full-stack TypeScript architecture with a React frontend and Express backend, using PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with CSS custom properties for theming (light/dark mode support)
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Build Tool**: Vite with HMR support

The frontend uses a layout pattern where the landing page is public and dashboard routes share a common sidebar layout. Components are organized under `client/src/components/` with UI primitives in `ui/` subdirectory.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints under `/api/` prefix
- **AI Integration**: OpenAI SDK configured for Replit AI Integrations (custom base URL)
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Storage**: connect-pg-simple for PostgreSQL-backed sessions

The server follows a modular pattern with routes registered in `server/routes.ts`, database operations abstracted through `server/storage.ts`, and reusable AI integrations in `server/replit_integrations/`.

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts` (shared between frontend and backend)
- **Key Tables**:
  - `users` - User accounts with UUID primary keys
  - `templates` - Content templates by category (social, blog, email, presentation)
  - `contentItems` - User-generated content with draft/published status
  - `conversations` and `messages` - Chat history for AI interactions
  - `brandProfiles` - User brand configuration

### Build System
- **Development**: Vite dev server with Express middleware proxy
- **Production**: esbuild bundles server code, Vite builds client to `dist/public`
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

## External Dependencies

### AI Services
- **OpenAI API**: Used via Replit AI Integrations for content generation and image creation
  - Environment variables: `AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`
  - Supports chat completions, streaming responses, and image generation (gpt-image-1)

### Database
- **PostgreSQL**: Primary data store
  - Connection via `DATABASE_URL` environment variable
  - Migrations managed through Drizzle Kit (`drizzle-kit push`)

### Key NPM Packages
- `drizzle-orm` / `drizzle-zod` - Database ORM and schema validation
- `@tanstack/react-query` - Data fetching and caching
- `zod` - Runtime type validation
- `wouter` - Client-side routing
- Radix UI primitives - Accessible UI components
- `p-limit` / `p-retry` - Batch processing utilities for AI requests