import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Vercel otomatis membaca variabel ini karena prefix VITE_ tadi
const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  const [nama, setNama] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState({ tipe: '', teks: '' });

  const handleDaftar = async (e) => {
    e.preventDefault();
    if (!nama || !whatsapp) {
      setPesan({ tipe: 'error', teks: 'Semua kolom wajib diisi ya!' });
      return;
    }

    setLoading(true);
    setPesan({ tipe: '', teks: '' });

    try {
      const { error } = await supabase
        .from('anggota_pkms')
        .insert([{ nama_lengkap: nama, no_whatsapp: whatsapp }]);

      if (error) throw error;

      setPesan({ tipe: 'sukses', teks: 'Berhasil! Calon pendekar telah terdaftar.' });
      setNama('');
      setWhatsapp('');
    } catch (error) {
      setPesan({ tipe: 'error', teks: 'Gagal mendaftar: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
      <div style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.5)' }}>
        <h2 style={{ textAlign: 'center', color: '#38bdf8', marginBottom: '10px' }}>Pendaftaran PKMS</h2>
        <p style={{ textAlign: 'center', fontSize: '14px', color: '#94a3b8', marginBottom: '25px' }}>Silakan masukkan data diri calon anggota</p>
        
        {pesan.teks && (
          <div style={{ padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px', textAlign: 'center', backgroundColor: pesan.tipe === 'sukses' ? '#15803d' : '#b91c1c', color: '#ffffff' }}>
            {pesan.teks}
          </div>
        )}

        <form onSubmit={handleDaftar}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', color: '#cbd5e1' }}>Nama Lengkap</label>
            <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Contoh: Sang Pendekar" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#334155', color: '#ffffff', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', color: '#cbd5e1' }}>Nomor WhatsApp</label>
            <input type="number" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="Contoh: 08123456789" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#334155', color: '#ffffff', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: 'none', backgroundColor: '#0284c7', color: '#ffffff', fontWeight: 'bold', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Memproses...' : 'DAFTAR SEKARANG'}
          </button>
        </form>
      </div>
    </div>
  );
}
// Build ulang dengan author yang bener
