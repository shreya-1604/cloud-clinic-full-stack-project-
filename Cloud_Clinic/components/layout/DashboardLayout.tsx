import { ReactNode } from 'react';
import Link from 'next/link';

type Props = {
  children: ReactNode;
  role: 'doctor' | 'patient';
};

const menu = {
  doctor: [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/appointments', label: 'Appointments' },
    { href: '/prescriptions', label: 'Prescriptions' },
  ],
  patient: [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/appointments', label: 'My Appointments' },
    { href: '/documents', label: 'Documents' },
    { href: '/prescriptions', label: 'Prescriptions' },
  ],
};

export default function DashboardLayout({ children, role }: Props) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-blue-700 text-white p-4 space-y-4">
        <h1 className="text-2xl font-bold mb-6">Cloud Clinic</h1>
        <nav className="space-y-2">
          {menu[role].map(item => (
            <Link key={item.href} href={item.href} className="block hover:underline">
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 bg-gray-50 p-8">{children}</main>
    </div>
  );
}