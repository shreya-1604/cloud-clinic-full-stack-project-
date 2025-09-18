import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Profile } from '@/lib/types';

export default function PatientBooking({ patientId }: { patientId: string }) {
  const [doctors, setDoctors] = useState<Profile[]>([]);
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    supabase
      .from('profiles')
      .select('*')
      .eq('role', 'doctor')
      .then(({ data }) => setDoctors(data || []));
  }, []);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorId || !date) return;
    const { error } = await supabase.from('appointments').insert([
      { patient_id: patientId, doctor_id: doctorId, scheduled_at: date },
    ]);
    if (error) setMessage(error.message);
    else setMessage('Appointment booked!');
  };

  return (
    <form className="space-y-4 max-w-md" onSubmit={handleBook}>
      <label className="block">
        Doctor:
        <select
          className="select select-bordered w-full"
          value={doctorId}
          onChange={e => setDoctorId(e.target.value)}
          required
        >
          <option value="">Select a doctor</option>
          {doctors.map(doc => (
            <option key={doc.id} value={doc.id}>
              {doc.full_name || doc.id}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        Date & Time:
        <input
          type="datetime-local"
          className="input input-bordered w-full"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
        />
      </label>
      <button className="btn btn-primary w-full" type="submit">
        Book Appointment
      </button>
      {message && <p className="text-green-600">{message}</p>}
    </form>
  );
}