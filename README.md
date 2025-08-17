# TaskFlow - Project & Task Management App

A modern, full-stack project and task management application built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

- **Authentication**: Email/password authentication with role-based access (Manager/Team Member)
- **Dashboard**: Overview with task statistics, activity feed, and task distribution charts
- **Kanban Board**: Drag-and-drop task management with status columns
- **My Tasks**: Personal task list with filtering and status controls
- **Calendar View**: Monthly calendar showing tasks by due date
- **Task Templates**: Create and reuse task templates with checklists
- **Reports & Analytics**: Team performance metrics and monthly report generation

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Lucide React icons
- **State Management**: Zustand
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Database & Auth**: Supabase
- **Deployment**: Vercel (Frontend), Supabase (Backend)

## 📋 Prerequisites

- Node.js 18+ 
- npm or pnpm
- Supabase account

## 🚦 Getting Started

### 1. Clone the repository

\`\`\`bash
git clone <your-repo-url>
cd taskMnG
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
# or
pnpm install
\`\`\`

### 3. Environment Setup

1. Copy the environment example file:
   \`\`\`bash
   cp env.example .env.local
   \`\`\`

2. Update \`.env.local\` with your Supabase credentials:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   \`\`\`

### 4. Supabase Setup

Create the following tables in your Supabase database:

\`\`\`sql
-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('manager', 'member')) DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('todo', 'in_progress', 'completed')) DEFAULT 'todo',
  priority TEXT CHECK (priority IN ('urgent', 'high', 'medium', 'low')) DEFAULT 'medium',
  type TEXT,
  assigned_to UUID REFERENCES users(id),
  created_by UUID REFERENCES users(id),
  start_date DATE,
  due_date DATE,
  estimated_hours INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Templates table
CREATE TABLE templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  checklist JSONB,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task logs for activity tracking
CREATE TABLE task_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id),
  user_id UUID REFERENCES users(id),
  action TEXT CHECK (action IN ('created', 'updated', 'status_change', 'time_log', 'completed')),
  duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

### 5. Run the development server

\`\`\`bash
npm run dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

\`\`\`
src/
├── app/                    # App Router pages
│   ├── (protected)/       # Protected routes (require auth)
│   │   ├── dashboard/     # Dashboard page
│   │   ├── board/         # Kanban board
│   │   ├── my-tasks/      # Personal tasks
│   │   ├── calendar/      # Calendar view
│   │   ├── templates/     # Task templates
│   │   └── reports/       # Analytics & reports
│   ├── auth/              # Authentication pages
│   │   ├── login/         # Login page
│   │   └── signup/        # Registration page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── Navbar.tsx        # Navigation component
└── lib/                  # Utilities
    ├── supabase.ts       # Supabase client & types
    └── utils.ts          # Utility functions
\`\`\`

## 🔧 Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run start\` - Start production server
- \`npm run lint\` - Run ESLint
- \`npm run lint:fix\` - Fix ESLint errors
- \`npm run format\` - Format code with Prettier
- \`npm run format:check\` - Check code formatting

## 🎨 UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) for consistent, accessible UI components:

- Button, Card, Badge components
- Form inputs and selects
- Navigation and layout components
- Responsive design with Tailwind CSS

## 📱 Features Overview

### Dashboard
- Task statistics (Today, In Progress, Overdue, Completed)
- Recent activity feed
- Task distribution by priority
- Quick access to all features

### Kanban Board
- Three columns: To Do, In Progress, Completed
- Drag-and-drop functionality (ready for implementation)
- Priority indicators
- Task assignment display

### My Tasks
- Personal task list with filtering
- Status controls (Start, Pause, Complete)
- Time tracking capabilities
- Priority and due date sorting

### Calendar View
- Monthly calendar layout
- Tasks displayed by due date
- Color-coded priority indicators
- Upcoming deadlines section

### Task Templates
- Pre-built task templates
- Checklist functionality
- Template usage statistics
- Easy duplication and modification

### Reports & Analytics
- Team performance metrics
- Completion rate tracking
- Monthly progress charts
- Exportable reports

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

### Supabase Configuration

1. Set up Row Level Security (RLS) policies
2. Configure authentication providers
3. Set up real-time subscriptions for live updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [documentation](README.md)
2. Search existing [issues](https://github.com/your-repo/issues)
3. Create a new issue with detailed information

---

Built with ❤️ using Next.js, TypeScript, and Supabase
