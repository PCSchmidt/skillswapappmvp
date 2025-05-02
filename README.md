# SkillSwap MVP

SkillSwap is a platform that enables users to trade skills in a hyper-local community, fostering knowledge exchange and community building.

## Project Overview

This repository contains the Minimum Viable Product (MVP) implementation of the SkillSwap platform. The application is built with:

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Backend**: Supabase for authentication, database, and storage
- **AI Integration**: OpenAI for enhancing user experience and recommendations

## Key Features

- User authentication and profile management
- Skill listing (offering and seeking)
- Skill discovery with filters and search
- Skill matching and trade proposals
- In-app messaging
- Rating system for completed trades
- Responsive design for all devices

## Project Structure

```
skillswap_mvp/
├── config/                  # Configuration files
├── context/                 # Domain context files
├── docs/                    # Documentation
├── memory/                  # Memory Bank storage
├── public/                  # Static assets
├── src/
│   ├── ai/                  # AI integration components
│   │   ├── context/         # AI context management
│   │   ├── memory/          # Memory Bank implementation
│   │   └── tools/           # AI tools and utilities
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   │   ├── auth/            # Authentication components
│   │   ├── skills/          # Skill-related components
│   │   └── ...              # Other UI components
│   ├── lib/                 # Utility libraries
│   │   └── supabase/        # Supabase client and helpers
│   └── types/               # TypeScript type definitions
├── supabase/                # Supabase configuration
│   ├── migrations/          # Database migration scripts
│   └── seed/                # Seed data for development
└── tests/                   # Test files
```

## Database Schema

The application uses a relational database with the following core tables:

- `users`: User profiles and authentication
- `skills`: Skills offered or sought by users
- `trades`: Trade proposals and agreements
- `messages`: In-app messaging between users
- `ratings`: User ratings for completed trades

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- A Supabase account and project
- An OpenAI API key (for AI features)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/username/skillswap-mvp.git
   cd skillswap-mvp
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local` and fill in your credentials

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database Setup

1. Create a new Supabase project
2. Run the migration scripts in the `supabase/migrations` directory
3. (Optional) Seed the database with test data using scripts in `supabase/seed`

## Development Guidelines

- Follow the project structure
- Use TypeScript for type safety
- Write unit tests for new features
- Follow the component design patterns established in the codebase

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributors

- SkillSwap Team
