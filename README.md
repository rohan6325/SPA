# Business Landing Page & Quote Generator

A professional React application with Supabase integration for generating business quotes and managing leads.

## Features

- Professional landing page with modern design
- Interactive quote generator form
- Supabase database integration
- Real-time data persistence
- Contact form
- Newsletter subscription
- Responsive design

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Copy `.env.example` to `.env`
2. Update the environment variables with your Supabase credentials (already configured)

### 3. Set Up Database

1. Go to your Supabase project dashboard: https://wasjftuxmdwzrwjpykre.supabase.co
2. Navigate to the SQL Editor
3. Run the SQL script from `supabase-schema.sql` to create the necessary tables and policies

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Database Schema

The application uses three main tables:

### quotes
- Stores business quote requests
- Includes client information, service type, budget, timeline
- Status tracking and notes

### contact_submissions
- Stores contact form submissions
- Includes name, email, phone, subject, and message

### newsletter_subscribers
- Stores email newsletter subscriptions
- Includes email and optional name

## Environment Variables

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Build for Production

```bash
npm run build
```

## Technologies Used

- React 18
- Vite
- Supabase
- React Router
- CSS3 with modern styling
