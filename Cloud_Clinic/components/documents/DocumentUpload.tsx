import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function DocumentUpload({ patientId }: { patientId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    const fileExt = file.name.split('.').pop();
    const filePath = `${patientId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (!uploadError) {
      await supabase.from('documents').insert([
        {
          patient_id: patientId,
          file_url: filePath,
          file_type: file.type,
        },
      ]);
      setMessage('Uploaded successfully!');
    } else {
      setMessage(uploadError.message);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleUpload}>
      <input
        type="file"
        accept="application/pdf,image/*"
        className="file-input file-input-bordered w-full"
        onChange={e => setFile(e.target.files?.[0] || null)}
        required
      />
      <button className="btn btn-primary w-full" type="submit">
        Upload Document
      </button>
      {message && <p className="text-green-600">{message}</p>}
    </form>
  );
}