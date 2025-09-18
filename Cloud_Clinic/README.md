# Cloud Clinic Web App

A full-stack clinic web application built with Next.js, Supabase, and Tailwind CSS. Features authentication for doctors and patients, appointment booking, document uploads, and prescription management.

## Features

- **Authentication**: Secure login/signup for doctors and patients via Supabase Auth.
- **Patients**:
  - Book appointments with doctors.
  - Upload/view medical documents (PDF, images).
  - View prescriptions.
- **Doctors**:
  - View/manage their appointments.
  - Write/upload prescriptions linked to appointments.
  - View patients’ uploaded documents.
- **File Storage**: Secure uploads to Supabase Storage with role-based access control.
- **Database**: PostgreSQL tables for users, appointments, prescriptions.
- **Modern UI**: Built with Tailwind CSS.
- **Deployment**: Ready for Vercel.

## Project Structure

```
cloud-clinic/
├── components/
│   ├── auth/
│   ├── appointments/
│   ├── documents/
│   ├── prescriptions/
│   └── layout/
├── pages/
│   ├── api/
│   ├── dashboard/
│   ├── appointments/
│   ├── documents/
│   └── prescriptions/
├── lib/
│   ├── supabaseClient.ts
│   └── types.ts
├── styles/
│   └── globals.css
├── .env.local
├── tailwind.config.js
├── next.config.js
└── README.md
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/cloud-clinic.git
cd cloud-clinic
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Supabase

- Create a [Supabase](https://supabase.com/) project.
- Enable **Email** auth.
- Create the following tables in Supabase SQL Editor:

```sql
-- users table (Supabase Auth handles basic info)
create table profiles (
  id uuid references auth.users (id) primary key,
  full_name text,
  role text check (role in ('doctor', 'patient')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- appointments table
create table appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references profiles(id),
  doctor_id uuid references profiles(id),
  scheduled_at timestamp with time zone,
  status text check (status in ('booked', 'completed', 'cancelled')) default 'booked',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- prescriptions table
create table prescriptions (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid references appointments(id),
  doctor_id uuid references profiles(id),
  patient_id uuid references profiles(id),
  prescription_text text,
  prescription_file_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- documents table
create table documents (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references profiles(id),
  file_url text,
  file_type text,
  uploaded_at timestamp with time zone default timezone('utc'::text, now())
);
```

- Go to **Project Settings > API** and copy your `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
- Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Configure Supabase Storage

- Create a bucket for medical documents (e.g., `documents`).
- Set RLS policies to restrict access:
  - Only owners or assigned doctors can access files.

### 5. Tailwind CSS

Already configured. You can customize `tailwind.config.js` as needed.

### 6. Run the Application

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

### 7. Deploy to Vercel

- Push your code to GitHub.
- Connect your repo on [Vercel](https://vercel.com/).
- Add your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel environment variables.
- Deploy!

## License

MIT
