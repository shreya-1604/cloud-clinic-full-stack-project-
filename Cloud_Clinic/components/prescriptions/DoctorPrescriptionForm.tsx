import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function DoctorPrescriptionForm({
  appointmentId,
  doctorId,
  patientId,
}: {
  appointmentId: string;
  doctorId: string;
  patientId: string;
}) {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let file_url = '';
    if (file) {
      const ext = file.name.split('.').pop();
      const filePath = `prescriptions/${doctorId}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
      if (!uploadError) {
        file_url = filePath;
      }
    }
    const { error } = await supabase.from('prescriptions').insert([
      {
        appointment_id: appointmentId,
        doctor_id: doctorId,
        patient_id: patientId,
        prescription_text: text,
        prescription_file_url: file_url,
      },
    ]);
    if (error) setMessage(error.message);
    else setMessage('Prescription saved!');
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <textarea
        className="textarea textarea-bordered w-full"
        rows={4}
        placeholder="Prescription details"
        value={text}
        onChange={e => setText(e.target.value)}
        required
      />
      <input
        type="file"
        accept="application/pdf,image/*"
        className="file-input file-input-bordered w-full"
        onChange={e => setFile(e.target.files?.[0] || null)}
      />
      <button className="btn btn-primary w-full" type="submit">
        Save Prescription
      </button>
      {message && <p className="text-green-600">{message}</p>}
    </form>
  );
}