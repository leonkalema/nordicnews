# Nordics Today

A modern, high-performance news website for Nordic countries built with SvelteKit, TypeScript, and Supabase. Features NASA-level engineering practices with robust error handling, caching, and performance optimization.

## 🌟 Features

### Frontend
- **Daily Snapshot** with featured stories and top headlines
- **Country-specific sections** (Sweden, Norway, Denmark, Finland, Iceland)
- **Category navigation** (Politics, Business, Tech, Culture, Sports, Society)
- **Advanced search** with full-text search capabilities
- **Responsive design** with Nordic-inspired color palette
- **SEO optimized** with structured data and meta tags
- **Performance optimized** with caching and lazy loading

### Backend Integration
- **Supabase integration** with robust error handling
- **Real-time data fetching** with fallback mechanisms
- **Advanced filtering** by country, category, and search terms
- **Pagination** for optimal performance
- **View tracking** and analytics
- **Image optimization** and CDN support

## 🚀 Tech Stack

- **Framework**: SvelteKit with TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Icons**: Svelte Lucide Icons
- **Build Tool**: Vite
- **Deployment**: Vercel/Netlify ready

## 📊 Database Schema

The application uses a `published_articles` table with the following structure:

```sql
- id (UUID, Primary Key)
- title (TEXT, Required)
- content (TEXT, Required) 
- summary (TEXT, Optional)
- country (VARCHAR(2), Required) - SE, NO, DK, FI, IS
- category (VARCHAR(50), Required) - breaking, business, politics, tech, culture, sports, society
- source_name (VARCHAR(50), Required)
- slug (VARCHAR(200), Unique)
- published_at (TIMESTAMPTZ)
- view_count (INTEGER, Default: 0)
- featured_image_url (VARCHAR(1000), Optional)
- meta_description (TEXT, Optional)
- keywords (JSONB, Optional)
```

## 🛠️ Setup Instructions

### 1. Clone and Install
```bash
git clone <repository-url>
cd nordicstoday/nordicnews
npm install
```

### 2. Environment Configuration
Copy `env.example` to `.env` and configure:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup
Execute the SQL in `database/functions.sql` in your Supabase SQL editor to create:
- View count increment function
- Trending articles function
- Search functions with ranking
- Performance indexes

### 4. Development
```bash
npm run dev
```
Open `http://localhost:5173`

### 5. Production Build
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── lib/
│   ├── components/          # Reusable UI components
│   │   ├── Header.svelte   # Navigation with search
│   │   ├── Footer.svelte   # Site footer
│   │   ├── DailySnapshot.svelte
│   │   ├── AcrossTheNordics.svelte
│   │   └── DeepDive.svelte
│   ├── data/
│   │   └── articles.ts     # Data fetching utilities
│   └── supabase.ts         # Database client & helpers
├── routes/
│   ├── +page.server.ts     # Homepage data loading
│   ├── [country]/          # Country-specific pages
│   ├── category/[category]/ # Category pages
│   ├── article/[slug]/     # Individual articles
│   └── api/search/         # Search API endpoint
└── database/
    └── functions.sql       # Database functions
```

## 🎨 Design System

### Color Palette
- **Nordic Blue**: `#2563eb` - Primary brand color
- **Off-White**: `#f8fafc` - Clean backgrounds  
- **Arctic Gray**: `#64748b` - Subtle accents

### Typography
- Clean, readable fonts optimized for news content
- Proper heading hierarchy
- Responsive text sizing

## 🔧 Key Features

### Data Fetching Architecture
- **NASA-level error handling** with multiple fallback strategies
- **In-memory caching** with TTL for performance
- **Parallel query execution** for optimal loading times
- **Type-safe interfaces** throughout the application

### Search Functionality
- **Full-text search** with PostgreSQL's built-in capabilities
- **Search ranking** based on relevance
- **Advanced filtering** by country and category
- **Real-time search suggestions** (ready for implementation)

### Performance Optimization
- **Server-side rendering** for SEO and initial load speed
- **Lazy loading** for images and non-critical content
- **Efficient pagination** with proper indexing
- **CDN-ready** image handling

### SEO & Analytics
- **Structured data** for rich snippets
- **Open Graph** and Twitter Card support
- **Sitemap generation** (ready for implementation)
- **View tracking** and analytics integration

## 🚀 Deployment

### Environment Variables
Set these in your deployment platform:
```
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

### Build Commands
```bash
npm run build
```

## 🤝 Contributing

1. Follow TypeScript best practices
2. Maintain the established error handling patterns
3. Add proper type definitions for new features
4. Test with various data scenarios
5. Ensure responsive design compliance

## 📈 Performance Metrics

- **Lighthouse Score**: 95+ (target)
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3s
- **Database Query Time**: <100ms (average)

## 🔒 Security

- **SQL injection protection** via Supabase's built-in security
- **XSS protection** through proper data sanitization  
- **CSRF protection** via SvelteKit's built-in features
- **Rate limiting** ready for implementation

---

Built with ❤️ for the Nordic news community. Engineered with NASA-level reliability and performance standards.
