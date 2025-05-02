# SkillSwap MVP Project Structure

This document outlines the project structure for the SkillSwap MVP, following Cline's recommended practices and patterns.

## Root Directory Structure

```
skillswap_mvp/
├── context/                 # AI context files
│   ├── rules.md             # Core behavioral rules
│   ├── capabilities.md      # AI capabilities
│   ├── environment.md       # Environment description
│   └── domain/              # Domain-specific context
│       ├── skill_categories.md
│       └── barter_rules.md
├── src/                     # Application source code
│   ├── app/                 # Next.js App Router
│   ├── components/          # React components
│   ├── lib/                 # Utility functions
│   ├── types/               # TypeScript types
│   └── ai/                  # AI-specific code
│       ├── memory/          # Memory Bank implementation
│       ├── context/         # Context management
│       └── tools/           # Tool implementations
├── memory/                  # Memory Bank storage
│   ├── memory.db            # SQLite database
│   └── vector-store/        # Vector storage
├── supabase/                # Supabase configuration
│   ├── migrations/          # Database migrations
│   └── seed/                # Seed data
├── public/                  # Static assets
├── tests/                   # Test files
├── docs/                    # Documentation
└── config/                  # Configuration files
    ├── ai-config.js         # AI configuration
    ├── memory-config.js     # Memory Bank configuration
    └── .env.example         # Example environment variables
```

## Key Components

### Context Files

Context files provide crucial information to AI models about the application:

- **rules.md**: Defines boundaries and operational guidelines for the AI
- **capabilities.md**: Describes what the AI can and cannot do
- **environment.md**: Provides system information and current state
- **domain/**: Contains domain-specific knowledge files

### Memory Bank

The Memory Bank pattern enables persistent memory for the SkillSwap application:

- Stores user preferences, conversation history, and domain-specific facts
- Uses vector embeddings for semantic retrieval
- Supports personalized experience and contextual assistance

### Source Code

The source code follows a structured approach:

- Next.js with App Router for frontend
- Supabase for backend services
- TypeScript for type safety
- Tailwind CSS for styling
- AI-specific code in dedicated directories

### Documentation

Project documentation includes:

- Project overview and vision
- Technical specifications
- User documentation
- Development guides
- API documentation
