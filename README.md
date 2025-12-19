# CMIS Student Portal

A comprehensive student portal for the Center for Management Information Systems (CMIS) at Texas A&M University's Mays Business School. This Next.js application provides a modern, responsive platform for student registration, event management, mentor matching, and alumni networking.

## 🎯 Features

### Core Functionality
- **User Authentication** - Secure login system with session management
- **Student Registration** - Comprehensive onboarding with multi-select interests and industries
- **Event Management** - Browse, register, and track upcoming and past events
- **Profile Management** - Complete student profiles with mentor assignment
- **Notifications System** - Real-time notifications with filtering and status management
- **Alumni Directory** - Browse and filter alumni profiles with detailed information
- **Resume Upload** - AWS S3-integrated resume storage and management
- **Dashboard** - Personalized dashboard with carousel, quick links, and registration banner
- **Webhook Integration** - n8n webhook support for automated workflows

### Technical Features
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **TypeScript** - Full type safety across the application
- **PostgreSQL Database** - Robust data storage with connection pooling
- **AWS S3 Integration** - Secure file storage and retrieval
- **React Query** - Efficient data fetching and caching
- **Toast Notifications** - User-friendly feedback with Sonner
- **API Routes** - RESTful API endpoints for all operations

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- AWS Account (for S3 file storage)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/siddharthkabra-811/cmis-student-portal.git
   cd cmis-student-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=cmis_portal
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_SSL=false

   # AWS S3 Configuration
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_access_key_id
   AWS_SECRET_ACCESS_KEY=your_secret_access_key
   AWS_S3_BUCKET_NAME=your_bucket_name

   # n8n Webhook Configuration (Optional)
   NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
   ```

4. **Set up the database**
   
   Create the PostgreSQL database and run migrations:
   ```bash
   # Create database
   createdb cmis_portal
   
   # Run schema setup (if you have SQL scripts)
   psql -d cmis_portal -f schema.sql
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔑 Demo Credentials

For testing purposes, use these credentials:

```
Email: john.smith@tamu.edu
Password: password123
```

---

## 📁 Project Structure

```
cmis-student-portal/
├── app/                      # Next.js 14 app directory
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── events/          # Event management
│   │   ├── students/        # Student operations
│   │   └── webhook/         # Webhook integrations
│   ├── dashboard/           # Dashboard page
│   ├── events/              # Events pages
│   ├── login/               # Login page
│   ├── profile/             # Profile page
│   ├── register/            # Registration page
│   ├── notifications/       # Notifications page
│   ├── alumni/              # Alumni directory
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── AlumniCard.tsx       # Alumni profile card
│   ├── AlumniFilters.tsx    # Alumni filtering
│   ├── Carousel.tsx         # Event carousel
│   ├── Navigation.tsx       # Navigation bar
│   └── ...
├── lib/                     # Utility libraries
│   ├── db.ts                # Database connection
│   ├── s3.ts                # AWS S3 utilities
│   ├── auth-context.tsx     # Authentication context
│   ├── types.ts             # TypeScript types
│   └── utils.ts             # Helper functions
├── providers/               # React context providers
├── public/                  # Static assets
├── scripts/                 # Utility scripts
├── .env.local              # Environment variables (create this)
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── tailwind.config.ts      # Tailwind CSS config
└── next.config.mjs         # Next.js config
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Icons:** Lucide React
- **State Management:** React Context API
- **Data Fetching:** TanStack Query (React Query)
- **Notifications:** Sonner

### Backend
- **Runtime:** Node.js
- **API:** Next.js API Routes
- **Database:** PostgreSQL with node-postgres (pg)
- **Authentication:** bcryptjs for password hashing
- **File Storage:** AWS S3 SDK v3

### DevOps & Tools
- **Version Control:** Git
- **Package Manager:** npm
- **Linting:** ESLint
- **Type Checking:** TypeScript

---

## 📚 API Documentation

### Authentication
- `POST /api/auth/login` - User login

### Students
- `GET /api/students` - Get all students
- `GET /api/students/[id]` - Get student by ID
- `POST /api/students/register` - Register new student
- `PUT /api/students/[id]` - Update student

### Events
- `GET /api/events` - Get all events
- `GET /api/events/[id]` - Get event by ID
- `POST /api/events` - Create new event (admin)
- `PUT /api/events/[id]` - Update event (admin)

### Webhooks
- `POST /api/webhook/n8n` - Trigger n8n automation workflow

For detailed API documentation, see [WEBHOOK_QUICK_REFERENCE.md](./WEBHOOK_QUICK_REFERENCE.md)

---

## 🎨 Pages & Features

### Login (`/`)
- Clean, centered authentication form
- Email and password validation
- Remember me functionality
- Demo credentials display

### Dashboard (`/dashboard`)
- Registration banner (for unregistered users)
- Auto-playing event carousel with manual controls
- Quick links grid (6 action cards)
- Welcome message with user personalization

### Registration (`/register`)
- Multi-step form with validation
- Multi-select for domains of interest and target industries
- Resume upload functionality
- Mentor matching option

### Events (`/events`, `/events/[id]`)
- List view with upcoming and past events
- Event registration with confirmation
- Detailed event pages
- Registration status tracking

### Profile (`/profile`)
- Comprehensive student information
- Mentor details display
- Activity log
- Edit profile capability

### Notifications (`/notifications`)
- Real-time notification feed
- Filter by type (event, system, mentor, deadline)
- Mark as read/unread
- Delete notifications
- Action buttons for quick navigation

### Alumni Directory (`/alumni`)
- Searchable alumni profiles
- Filter by location, graduation year, and industry
- Modal view for detailed profiles
- Social media links

---

## 🔧 Configuration

### Environment Variables

#### Required Variables
```env
DB_HOST=localhost              # PostgreSQL host
DB_PORT=5432                   # PostgreSQL port
DB_NAME=cmis_portal           # Database name
DB_USER=postgres              # Database user
DB_PASSWORD=your_password     # Database password
```

#### Optional Variables
```env
DB_SSL=false                          # Enable SSL for database
AWS_REGION=us-east-1                  # AWS region
AWS_ACCESS_KEY_ID=your_key            # AWS access key
AWS_SECRET_ACCESS_KEY=your_secret     # AWS secret key
AWS_S3_BUCKET_NAME=your_bucket        # S3 bucket name
NEXT_PUBLIC_N8N_WEBHOOK_URL=url       # n8n webhook URL
```

### Database Setup

The application expects the following main tables:
- `students` - Student information and registration data
- `events` - Event details and metadata
- `event_registrations` - Student event registrations
- `notifications` - User notifications
- `alumni` - Alumni directory information

---

## 📝 Scripts

```bash
# Development
npm run dev          # Start development server on localhost:3000

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint

# Utilities
node scripts/hash-password.js    # Generate password hash
```

---

## 🧪 Testing

### Manual Testing
1. Start the development server
2. Use the demo credentials to log in
3. Follow the [QUICKSTART.md](./QUICKSTART.md) guide for feature testing

### Test Features
- User authentication flow
- Event registration and unregistration
- Profile editing
- Notification interactions
- Alumni directory filtering
- Resume upload

---

## 📦 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
The application can be deployed on any platform that supports Next.js:
- AWS (Amplify, EC2)
- Google Cloud Platform
- Microsoft Azure
- DigitalOcean
- Heroku

### Build for Production
```bash
npm run build
npm run start
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 Documentation

- [Quick Start Guide](./QUICKSTART.md) - Get started in 3 steps
- [Acceptance Criteria](./ACCEPTANCE_CRITERIA.md) - Feature requirements checklist
- [Webhook Reference](./WEBHOOK_QUICK_REFERENCE.md) - n8n webhook integration guide

---

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
- Verify PostgreSQL is running: `pg_isready`
- Check credentials in `.env.local`
- Ensure database exists

**S3 Upload Fails**
- Verify AWS credentials are correct
- Check bucket permissions and CORS policy
- Ensure bucket name matches environment variable

**Build Errors**
- Clear Next.js cache: `rm -rf .next`
- Delete node_modules: `rm -rf node_modules`
- Reinstall dependencies: `npm install`

**Environment Variables Not Loading**
- Restart the development server after changing `.env.local`
- Ensure file is named exactly `.env.local`
- Check for syntax errors in environment file

---

## 📧 Support

For questions or issues:
- Create an issue in the GitHub repository
- Contact the CMIS team at Texas A&M Mays Business School

---

## 📜 License

This project is proprietary and confidential. Unauthorized copying or distribution is prohibited.

---

## 🏫 About CMIS

The Center for Management Information Systems (CMIS) at Texas A&M University's Mays Business School is dedicated to preparing students for careers in technology, consulting, and business analytics.

**Built with ❤️ by the CMIS Development Team**