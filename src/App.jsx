import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Membaca variabel env Supabase & Telegram
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

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
      // 1. Masukkan data ke Supabase terlebih dahulu
      const { error } = await supabase
        .from('anggota_pkms')
        .insert([{ nama_lengkap: nama, no_whatsapp: whatsapp }]);

      if (error) throw error;

      // 2. Jika sukses, kirim notifikasi ke Telegram Bot
      const teksTelegram = `🔔 *Pendaftaran Baru PKMS!*\n\n👤 *Nama:* ${nama}\n📱 *WhatsApp:* https://wa.me/${whatsapp.replace(/^0/, '62')}\n\n_Data berhasil disimpan ke Supabase._`;

      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: teksTelegram,
          parse_mode: 'Markdown', // Mengaktifkan format bold/italic
        }),
      });

      // 3. Reset form dan tampilkan pesan sukses
      setPesan({ tipe: 'sukses', teks: 'Berhasil! Calon pendekar telah terdaftar dan notifikasi terkirim.' });
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

