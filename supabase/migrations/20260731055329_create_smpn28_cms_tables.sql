
/*
# SMP Negeri 28 Kota Pontianak - Complete CMS Database Schema

Creates all tables needed for the full CMS website.
*/

-- 1. SITE SETTINGS
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_site_settings" ON site_settings;
CREATE POLICY "anon_select_site_settings" ON site_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_site_settings" ON site_settings;
CREATE POLICY "anon_insert_site_settings" ON site_settings FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_site_settings" ON site_settings;
CREATE POLICY "anon_update_site_settings" ON site_settings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_site_settings" ON site_settings;
CREATE POLICY "anon_delete_site_settings" ON site_settings FOR DELETE TO anon, authenticated USING (true);

-- 2. RUNNING TEXT
CREATE TABLE IF NOT EXISTS running_text (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_enabled boolean NOT NULL DEFAULT true,
  content text NOT NULL DEFAULT 'Selamat Datang di SMP Negeri 28 Kota Pontianak',
  link_url text,
  link_label text DEFAULT 'Selengkapnya',
  bg_color text NOT NULL DEFAULT '#dc2626',
  text_color text NOT NULL DEFAULT '#ffffff',
  speed text NOT NULL DEFAULT 'normal',
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE running_text ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_running_text" ON running_text;
CREATE POLICY "anon_select_running_text" ON running_text FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_running_text" ON running_text;
CREATE POLICY "anon_insert_running_text" ON running_text FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_running_text" ON running_text;
CREATE POLICY "anon_update_running_text" ON running_text FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_running_text" ON running_text;
CREATE POLICY "anon_delete_running_text" ON running_text FOR DELETE TO anon, authenticated USING (true);

-- 3. HERO SLIDES
CREATE TABLE IF NOT EXISTS hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  tagline text,
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_hero_slides" ON hero_slides;
CREATE POLICY "anon_select_hero_slides" ON hero_slides FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_hero_slides" ON hero_slides;
CREATE POLICY "anon_insert_hero_slides" ON hero_slides FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_hero_slides" ON hero_slides;
CREATE POLICY "anon_update_hero_slides" ON hero_slides FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_hero_slides" ON hero_slides;
CREATE POLICY "anon_delete_hero_slides" ON hero_slides FOR DELETE TO anon, authenticated USING (true);

-- 4. NEWS & AGENDA
CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text,
  excerpt text,
  image_url text,
  category text NOT NULL DEFAULT 'Berita',
  is_published boolean NOT NULL DEFAULT true,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_news" ON news;
CREATE POLICY "anon_select_news" ON news FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_news" ON news;
CREATE POLICY "anon_insert_news" ON news FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_news" ON news;
CREATE POLICY "anon_update_news" ON news FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_news" ON news;
CREATE POLICY "anon_delete_news" ON news FOR DELETE TO anon, authenticated USING (true);

-- 5. TEACHERS & STAFF
CREATE TABLE IF NOT EXISTS teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  title text,
  nip text,
  nuptk text,
  position text,
  subject text,
  category text NOT NULL DEFAULT 'Guru',
  photo_url text,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_teachers" ON teachers;
CREATE POLICY "anon_select_teachers" ON teachers FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_teachers" ON teachers;
CREATE POLICY "anon_insert_teachers" ON teachers FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_teachers" ON teachers;
CREATE POLICY "anon_update_teachers" ON teachers FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_teachers" ON teachers;
CREATE POLICY "anon_delete_teachers" ON teachers FOR DELETE TO anon, authenticated USING (true);

-- 6. FACILITIES
CREATE TABLE IF NOT EXISTS facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  image_url text,
  icon_name text DEFAULT 'Building2',
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_facilities" ON facilities;
CREATE POLICY "anon_select_facilities" ON facilities FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_facilities" ON facilities;
CREATE POLICY "anon_insert_facilities" ON facilities FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_facilities" ON facilities;
CREATE POLICY "anon_update_facilities" ON facilities FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_facilities" ON facilities;
CREATE POLICY "anon_delete_facilities" ON facilities FOR DELETE TO anon, authenticated USING (true);

-- 7. E-LEARNING
CREATE TABLE IF NOT EXISTS elearning_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  subject text,
  grade_level text,
  file_url text,
  material_type text NOT NULL DEFAULT 'Materi',
  is_published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE elearning_materials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_elearning" ON elearning_materials;
CREATE POLICY "anon_select_elearning" ON elearning_materials FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_elearning" ON elearning_materials;
CREATE POLICY "anon_insert_elearning" ON elearning_materials FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_elearning" ON elearning_materials;
CREATE POLICY "anon_update_elearning" ON elearning_materials FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_elearning" ON elearning_materials;
CREATE POLICY "anon_delete_elearning" ON elearning_materials FOR DELETE TO anon, authenticated USING (true);

-- 8. SPMB REQUIREMENTS
CREATE TABLE IF NOT EXISTS spmb_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE spmb_requirements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_spmb_req" ON spmb_requirements;
CREATE POLICY "anon_select_spmb_req" ON spmb_requirements FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_spmb_req" ON spmb_requirements;
CREATE POLICY "anon_insert_spmb_req" ON spmb_requirements FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_spmb_req" ON spmb_requirements;
CREATE POLICY "anon_update_spmb_req" ON spmb_requirements FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_spmb_req" ON spmb_requirements;
CREATE POLICY "anon_delete_spmb_req" ON spmb_requirements FOR DELETE TO anon, authenticated USING (true);

-- 9. SPMB TIMELINE
CREATE TABLE IF NOT EXISTS spmb_timeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  step_number int NOT NULL,
  title text NOT NULL,
  date_range text NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE spmb_timeline ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_spmb_timeline" ON spmb_timeline;
CREATE POLICY "anon_select_spmb_timeline" ON spmb_timeline FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_spmb_timeline" ON spmb_timeline;
CREATE POLICY "anon_insert_spmb_timeline" ON spmb_timeline FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_spmb_timeline" ON spmb_timeline;
CREATE POLICY "anon_update_spmb_timeline" ON spmb_timeline FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_spmb_timeline" ON spmb_timeline;
CREATE POLICY "anon_delete_spmb_timeline" ON spmb_timeline FOR DELETE TO anon, authenticated USING (true);

-- 10. SPMB DOCUMENT FIELDS
CREATE TABLE IF NOT EXISTS spmb_document_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  is_required boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  accepted_types text DEFAULT '.pdf,.jpg,.jpeg,.png',
  max_size_mb int DEFAULT 5,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE spmb_document_fields ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_spmb_doc_fields" ON spmb_document_fields;
CREATE POLICY "anon_select_spmb_doc_fields" ON spmb_document_fields FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_spmb_doc_fields" ON spmb_document_fields;
CREATE POLICY "anon_insert_spmb_doc_fields" ON spmb_document_fields FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_spmb_doc_fields" ON spmb_document_fields;
CREATE POLICY "anon_update_spmb_doc_fields" ON spmb_document_fields FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_spmb_doc_fields" ON spmb_document_fields;
CREATE POLICY "anon_delete_spmb_doc_fields" ON spmb_document_fields FOR DELETE TO anon, authenticated USING (true);

-- 11. SPMB APPLICATIONS
CREATE TABLE IF NOT EXISTS spmb_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  nisn text,
  birth_place text,
  birth_date date,
  gender text,
  religion text,
  address text,
  phone_student text,
  father_name text,
  father_job text,
  father_income text,
  father_education text,
  mother_name text,
  mother_job text,
  mother_income text,
  mother_education text,
  guardian_name text,
  guardian_phone text,
  height_cm numeric,
  weight_kg numeric,
  head_circumference_cm numeric,
  kip_number text,
  kis_number text,
  kks_number text,
  previous_school text,
  sttb_number text,
  achievements text,
  registration_path text DEFAULT 'Reguler',
  documents jsonb DEFAULT '{}',
  status text NOT NULL DEFAULT 'Menunggu',
  registration_number text UNIQUE,
  registered_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE spmb_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_spmb_apps" ON spmb_applications;
CREATE POLICY "anon_select_spmb_apps" ON spmb_applications FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_spmb_apps" ON spmb_applications;
CREATE POLICY "anon_insert_spmb_apps" ON spmb_applications FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_spmb_apps" ON spmb_applications;
CREATE POLICY "anon_update_spmb_apps" ON spmb_applications FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_spmb_apps" ON spmb_applications;
CREATE POLICY "anon_delete_spmb_apps" ON spmb_applications FOR DELETE TO anon, authenticated USING (true);

-- 12. CONTACT SETTINGS
CREATE TABLE IF NOT EXISTS contact_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  address text,
  phone text,
  email text,
  operating_hours text,
  instagram_url text,
  facebook_url text,
  youtube_url text,
  tiktok_url text,
  maps_embed_url text DEFAULT 'https://maps.google.com/maps?q=-0.01,109.3338&z=15&output=embed',
  maps_enabled boolean NOT NULL DEFAULT true,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE contact_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_contact" ON contact_settings;
CREATE POLICY "anon_select_contact" ON contact_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_contact" ON contact_settings;
CREATE POLICY "anon_insert_contact" ON contact_settings FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_contact" ON contact_settings;
CREATE POLICY "anon_update_contact" ON contact_settings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_contact" ON contact_settings;
CREATE POLICY "anon_delete_contact" ON contact_settings FOR DELETE TO anon, authenticated USING (true);

-- 13. PROFILE SETTINGS
CREATE TABLE IF NOT EXISTS profile_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  accreditation_status text DEFAULT 'Akreditasi A',
  accreditation_subtitle text DEFAULT 'Terakreditasi Unggul oleh BAN-S/M',
  visi text,
  misi jsonb DEFAULT '[]',
  history_text text,
  history_image_url text,
  spmb_label text DEFAULT 'SPMB',
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE profile_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_profile" ON profile_settings;
CREATE POLICY "anon_select_profile" ON profile_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_profile" ON profile_settings;
CREATE POLICY "anon_insert_profile" ON profile_settings FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_profile" ON profile_settings;
CREATE POLICY "anon_update_profile" ON profile_settings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_profile" ON profile_settings;
CREATE POLICY "anon_delete_profile" ON profile_settings FOR DELETE TO anon, authenticated USING (true);

-- SEED DATA

INSERT INTO running_text (content, is_enabled, link_url, link_label, bg_color, text_color, speed)
SELECT 'Penerimaan Peserta Didik Baru (SPMB) SMP Negeri 28 Kota Pontianak Telah Dibuka! Segera Daftarkan Diri Anda.', true, '/spmb', 'Daftar Sekarang', '#dc2626', '#ffffff', 'normal'
WHERE NOT EXISTS (SELECT 1 FROM running_text);

INSERT INTO hero_slides (title, subtitle, tagline, image_url, sort_order)
SELECT 'Selamat Datang di SMPN 28 Kota Pontianak', 'Unggul, Berkarakter, dan Berprestasi', 'Mendidik Generasi Penerus Bangsa yang SPIRIT', 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 0
WHERE NOT EXISTS (SELECT 1 FROM hero_slides WHERE sort_order = 0);

INSERT INTO hero_slides (title, subtitle, tagline, image_url, sort_order)
SELECT 'Fasilitas Lengkap & Modern', 'Ruang Belajar yang Nyaman dan Kondusif', 'Mendukung Prestasi Terbaik Siswa', 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 1
WHERE NOT EXISTS (SELECT 1 FROM hero_slides WHERE sort_order = 1);

INSERT INTO contact_settings (address, phone, email, operating_hours, instagram_url, facebook_url, youtube_url, tiktok_url)
SELECT 'Jl. Harapan Jaya No. 1, Pontianak, Kalimantan Barat 78121', '(0561) 123456', 'smpn28pontianak@gmail.com', 'Senin - Jumat: 07.00 - 15.00 WIB', 'https://instagram.com/smpn28pontianak', 'https://facebook.com/smpn28pontianak', 'https://youtube.com/@smpn28pontianak', 'https://tiktok.com/@smpn28pontianak'
WHERE NOT EXISTS (SELECT 1 FROM contact_settings);

INSERT INTO profile_settings (visi, misi, history_text)
SELECT 
  'Terwujudnya Peserta Didik yang Beriman, Bertaqwa, Berakhlak Mulia, Berprestasi, Berbudaya, dan Berwawasan Lingkungan.',
  '["Menyelenggarakan pendidikan yang bermutu dan bermakna bagi peserta didik","Mengembangkan karakter peserta didik yang beriman, bertaqwa, dan berakhlak mulia","Meningkatkan kompetensi pendidik dan tenaga kependidikan secara berkelanjutan","Menyediakan sarana dan prasarana pembelajaran yang memadai","Menjalin kerjasama yang harmonis dengan orang tua, masyarakat, dan instansi terkait","Menciptakan lingkungan sekolah yang kondusif, aman, nyaman, dan bersih"]',
  'SMP Negeri 28 Kota Pontianak didirikan pada tahun 2016 sebagai salah satu sekolah negeri unggulan di Kota Pontianak, Kalimantan Barat. Dengan semangat SPIRIT (Semangat, Prestasi, Integritas, Religius, Inovatif, Terpadu), sekolah ini terus berkembang menjadi lembaga pendidikan yang diakui kualitasnya.'
WHERE NOT EXISTS (SELECT 1 FROM profile_settings);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM spmb_requirements) THEN
    INSERT INTO spmb_requirements (content, sort_order) VALUES
      ('Berusia maksimal 15 tahun pada tanggal 1 Juli tahun pendaftaran', 1),
      ('Memiliki ijazah atau Surat Keterangan Lulus (SKL) dari SD/MI/Sederajat', 2),
      ('Memiliki Nomor Induk Siswa Nasional (NISN)', 3),
      ('Memiliki Kartu Keluarga (KK) yang diterbitkan minimal 1 tahun sebelum pendaftaran', 4),
      ('Calon peserta didik yang berdomisili di luar wilayah zonasi dapat mendaftar melalui jalur prestasi atau afirmasi', 5);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM spmb_timeline) THEN
    INSERT INTO spmb_timeline (step_number, title, date_range, description) VALUES
      (1, 'Pendaftaran Online', '1 - 14 Juni 2025', 'Calon peserta didik mengisi formulir pendaftaran secara online melalui website ini'),
      (2, 'Verifikasi Berkas', '15 - 20 Juni 2025', 'Panitia memverifikasi kelengkapan berkas dan dokumen pendaftaran'),
      (3, 'Seleksi & Tes', '23 - 25 Juni 2025', 'Pelaksanaan seleksi akademik dan non-akademik bagi calon peserta didik'),
      (4, 'Pengumuman Hasil', '28 Juni 2025', 'Pengumuman hasil seleksi penerimaan peserta didik baru'),
      (5, 'Daftar Ulang', '1 - 5 Juli 2025', 'Peserta didik yang diterima melakukan daftar ulang dengan membawa berkas asli'),
      (6, 'Hari Pertama Masuk Sekolah', '14 Juli 2025', 'Peserta didik baru mulai mengikuti kegiatan belajar mengajar');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM spmb_document_fields) THEN
    INSERT INTO spmb_document_fields (label, is_required, sort_order) VALUES
      ('Kartu Keluarga (KK)', true, 1),
      ('Akta Kelahiran', true, 2),
      ('Rapor Kelas 6 Semester Terakhir', true, 3),
      ('Ijazah / Surat Keterangan Lulus (SKL)', true, 4),
      ('Pas Foto 3x4 (Latar Merah)', true, 5),
      ('Surat Keterangan Domisili', false, 6);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM facilities) THEN
    INSERT INTO facilities (name, description, icon_name, sort_order) VALUES
      ('Ruang Kelas Modern', '24 ruang kelas ber-AC dengan fasilitas LCD proyektor dan papan tulis interaktif', 'School', 1),
      ('Laboratorium IPA', 'Lab IPA lengkap dengan peralatan eksperimen fisika, kimia, dan biologi', 'FlaskConical', 2),
      ('Laboratorium Komputer', '40 unit komputer dengan koneksi internet fiber optik berkecepatan tinggi', 'Monitor', 3),
      ('Perpustakaan', 'Koleksi lebih dari 5.000 buku dan akses e-library digital untuk seluruh siswa', 'BookOpen', 4),
      ('Lapangan Olahraga', 'Lapangan basket, voli, dan area olahraga serbaguna yang luas', 'Dumbbell', 5),
      ('Aula Serbaguna', 'Aula kapasitas 500 orang untuk kegiatan upacara, seminar, dan pentas seni', 'Users', 6);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM news) THEN
    INSERT INTO news (title, slug, content, excerpt, category, image_url) VALUES
      ('SPMB 2025/2026 Resmi Dibuka', 'spmb-2025-2026-dibuka', 'Penerimaan Peserta Didik Baru (SPMB) SMP Negeri 28 Kota Pontianak untuk tahun ajaran 2025/2026 resmi dibuka. Pendaftaran dilakukan secara online melalui website ini.', 'SPMB 2025/2026 untuk SMP Negeri 28 Kota Pontianak resmi dibuka hari ini.', 'Pengumuman', 'https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg?auto=compress&cs=tinysrgb&w=800'),
      ('Prestasi Siswa di Olimpiade Sains Kota', 'prestasi-olimpiade-sains', 'Siswa SMP Negeri 28 Kota Pontianak kembali mengharumkan nama sekolah dengan meraih juara pada Olimpiade Sains tingkat Kota Pontianak.', 'Siswa SMPN 28 Pontianak raih prestasi di Olimpiade Sains tingkat kota.', 'Prestasi', 'https://images.pexels.com/photos/256517/pexels-photo-256517.jpeg?auto=compress&cs=tinysrgb&w=800'),
      ('Kegiatan P5 Proyek Lingkungan Hidup', 'kegiatan-p5-lingkungan', 'Dalam rangka implementasi Kurikulum Merdeka, siswa SMPN 28 melaksanakan Proyek Penguatan Profil Pelajar Pancasila (P5) bertema Lingkungan Hidup.', 'Siswa SMPN 28 melaksanakan kegiatan P5 bertema lingkungan hidup.', 'Kegiatan', 'https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=800');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM teachers) THEN
    INSERT INTO teachers (full_name, title, position, subject, category, sort_order) VALUES
      ('Drs. Ahmad Fauzi, M.Pd.', 'Kepala Sekolah', 'Kepala Sekolah', '-', 'Pimpinan', 1),
      ('Hj. Siti Rahmawati, S.Pd.', 'Wakil Kepala Sekolah', 'Wakil Kepala Bid. Kurikulum', 'Bahasa Indonesia', 'Guru', 2),
      ('Budi Santoso, S.Pd.', 'Guru', 'Wali Kelas IX A', 'Matematika', 'Guru', 3),
      ('Dewi Lestari, S.Pd.', 'Guru', 'Koordinator BK', 'Bimbingan Konseling', 'Guru', 4),
      ('Ahmad Rizki, S.Kom.', 'Guru', 'Kepala Lab Komputer', 'TIK / Informatika', 'Guru', 5);
  END IF;
END $$;
