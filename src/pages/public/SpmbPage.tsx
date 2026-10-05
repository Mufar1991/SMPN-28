import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { supabase } from '@/lib/supabase';
import {
  CheckCircle2, User, Users, Ruler, GraduationCap, Upload, FileText,
  ChevronRight, ChevronLeft, Send, AlertCircle, Check, Info,
} from 'lucide-react';

const STEPS = [
  { num: 1, label: 'Data Diri', icon: User },
  { num: 2, label: 'Data Orang Tua', icon: Users },
  { num: 3, label: 'Data Fisik & Sosial', icon: Ruler },
  { num: 4, label: 'Data Akademik', icon: GraduationCap },
  { num: 5, label: 'Unggah Dokumen', icon: Upload },
  { num: 6, label: 'Konfirmasi', icon: CheckCircle2 },
];

const RELIGIONS = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'];
const GENDERS = ['Laki-laki', 'Perempuan'];
const PATHS = ['Reguler (Zonasi)', 'Prestasi', 'Afirmasi', 'Perpindahan Tugas'];

export default function SpmbPage() {
  const { spmbLabel, spmbRequirements, spmbTimeline, spmbDocFields } = useData();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [regNumber, setRegNumber] = useState('');
  const [formError, setFormError] = useState('');
  const [docFiles, setDocFiles] = useState<Record<string, File>>({});
  const [docUrls, setDocUrls] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    full_name: '', nisn: '', birth_place: '', birth_date: '', gender: '', religion: '',
    address: '', phone_student: '',
    father_name: '', father_job: '', father_income: '', father_education: '',
    mother_name: '', mother_job: '', mother_income: '', mother_education: '',
    guardian_name: '', guardian_phone: '',
    height_cm: '', weight_kg: '', head_circumference_cm: '',
    kip_number: '', kis_number: '', kks_number: '',
    previous_school: '', sttb_number: '', achievements: '', registration_path: 'Reguler (Zonasi)',
  });

  const activeDocFields = spmbDocFields.filter((d) => d.is_active).sort((a, b) => a.sort_order - b.sort_order);

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleFileChange = (fieldId: string, file: File | null) => {
    setDocFiles((prev) => {
      const next = { ...prev };
      if (file) next[fieldId] = file; else delete next[fieldId];
      return next;
    });
  };

  const validateStep = (s: number): string | null => {
    if (s === 1) {
      if (!form.full_name.trim()) return 'Nama lengkap wajib diisi.';
      if (!form.nisn.trim()) return 'NISN wajib diisi.';
      if (!form.birth_place.trim()) return 'Tempat lahir wajib diisi.';
      if (!form.birth_date) return 'Tanggal lahir wajib diisi.';
      if (!form.gender) return 'Jenis kelamin wajib dipilih.';
      if (!form.religion) return 'Agama wajib dipilih.';
      if (!form.address.trim()) return 'Alamat wajib diisi.';
    }
    if (s === 2) {
      if (!form.father_name.trim()) return 'Nama ayah wajib diisi.';
      if (!form.mother_name.trim()) return 'Nama ibu wajib diisi.';
    }
    if (s === 5) {
      for (const df of activeDocFields) {
        if (df.is_required && !docFiles[df.id]) {
          return `Dokumen "${df.label}" wajib diunggah.`;
        }
      }
    }
    return null;
  };

  const next = () => {
    const err = validateStep(step);
    if (err) { setFormError(err); return; }
    setFormError('');
    setStep((s) => Math.min(s + 1, STEPS.length));
  };
  const back = () => { setFormError(''); setStep((s) => Math.max(s - 1, 1)); };

  const uploadFile = async (file: File, path: string): Promise<string> => {
    const { error } = await supabase.storage.from('spmb-documents').upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from('spmb-documents').getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async () => {
    setFormError('');
    setSubmitting(true);
    try {
      // Upload documents
      const docs: Record<string, string> = {};
      for (const df of activeDocFields) {
        const file = docFiles[df.id];
        if (file) {
          const path = `${Date.now()}-${df.id}-${file.name.replace(/\s/g, '_')}`;
          try {
            docs[df.id] = await uploadFile(file, path);
          } catch {
            docs[df.id] = `File: ${file.name}`;
          }
        }
      }

      const regNum = `SPMB-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

      const { error } = await supabase.from('spmb_applications').insert({
        full_name: form.full_name,
        nisn: form.nisn || null,
        birth_place: form.birth_place || null,
        birth_date: form.birth_date || null,
        gender: form.gender || null,
        religion: form.religion || null,
        address: form.address || null,
        phone_student: form.phone_student || null,
        father_name: form.father_name || null,
        father_job: form.father_job || null,
        father_income: form.father_income || null,
        father_education: form.father_education || null,
        mother_name: form.mother_name || null,
        mother_job: form.mother_job || null,
        mother_income: form.mother_income || null,
        mother_education: form.mother_education || null,
        guardian_name: form.guardian_name || null,
        guardian_phone: form.guardian_phone || null,
        height_cm: form.height_cm ? parseFloat(form.height_cm) : null,
        weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : null,
        head_circumference_cm: form.head_circumference_cm ? parseFloat(form.head_circumference_cm) : null,
        kip_number: form.kip_number || null,
        kis_number: form.kis_number || null,
        kks_number: form.kks_number || null,
        previous_school: form.previous_school || null,
        sttb_number: form.sttb_number || null,
        achievements: form.achievements || null,
        registration_path: form.registration_path || 'Reguler',
        documents: docs,
        status: 'Menunggu',
        registration_number: regNum,
      });

      if (error) throw error;
      setRegNumber(regNum);
      setSubmitted(true);
    } catch (e) {
      setFormError('Terjadi kesalahan saat mengirim pendaftaran. Silakan coba lagi. ' + (e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="py-16">
        <div className="container-custom max-w-2xl">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-green-200">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Pendaftaran Berhasil!</h1>
            <p className="text-gray-600 mb-4">Terima kasih telah mendaftar di {spmbLabel} SMP Negeri 28 Kota Pontianak.</p>
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500">Nomor Pendaftaran Anda:</p>
              <p className="text-2xl font-bold text-blue-700">{regNumber}</p>
            </div>
            <p className="text-sm text-gray-500">Simpan nomor pendaftaran ini untuk mengecek status pendaftaran Anda.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{spmbLabel} Online</h1>
          <p className="text-gray-500">Penerimaan Peserta Didik Baru SMP Negeri 28 Kota Pontianak</p>
        </div>

        {/* Requirements */}
        {spmbRequirements.length > 0 && (
          <div className="card p-6 mb-8">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-700" /> Persyaratan {spmbLabel}
            </h2>
            <ul className="space-y-2">
              {spmbRequirements.filter(r => r.is_active).map((r) => (
                <li key={r.id} className="flex gap-2 items-start text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> {r.content}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Timeline */}
        {spmbTimeline.length > 0 && (
          <div className="card p-6 mb-8">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-700" /> Jadwal {spmbLabel}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {spmbTimeline.filter(t => t.is_active).map((t) => (
                <div key={t.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center text-sm font-bold">{t.step_number}</span>
                    <h3 className="font-semibold text-gray-900 text-sm">{t.title}</h3>
                  </div>
                  <p className="text-xs text-blue-700 font-medium mb-1">{t.date_range}</p>
                  {t.description && <p className="text-xs text-gray-500">{t.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stepper */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between overflow-x-auto">
            {STEPS.map((s, i) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1 min-w-[60px]">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    step > s.num ? 'bg-green-500 text-white' :
                    step === s.num ? 'bg-blue-700 text-white ring-4 ring-blue-200' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {step > s.num ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs text-center ${step >= s.num ? 'text-blue-700 font-medium' : 'text-gray-400'}`}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 mx-1 ${step > s.num ? 'bg-green-500' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="card p-6 md:p-8">
          {formError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 flex items-center gap-2 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" /> {formError}
            </div>
          )}

          {/* Step 1: Data Diri */}
          {step === 1 && (
            <div className="grid md:grid-cols-2 gap-4 animate-fade-up">
              <div className="md:col-span-2"><h2 className="text-xl font-bold text-gray-900 mb-2">Data Diri Siswa</h2></div>
              <div><label className="label-field">Nama Lengkap *</label><input className="input-field" value={form.full_name} onChange={(e) => update('full_name', e.target.value)} /></div>
              <div><label className="label-field">NISN *</label><input className="input-field" value={form.nisn} onChange={(e) => update('nisn', e.target.value)} /></div>
              <div><label className="label-field">Tempat Lahir *</label><input className="input-field" value={form.birth_place} onChange={(e) => update('birth_place', e.target.value)} /></div>
              <div><label className="label-field">Tanggal Lahir *</label><input type="date" className="input-field" value={form.birth_date} onChange={(e) => update('birth_date', e.target.value)} /></div>
              <div><label className="label-field">Jenis Kelamin *</label><select className="input-field" value={form.gender} onChange={(e) => update('gender', e.target.value)}><option value="">Pilih...</option>{GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}</select></div>
              <div><label className="label-field">Agama *</label><select className="input-field" value={form.religion} onChange={(e) => update('religion', e.target.value)}><option value="">Pilih...</option>{RELIGIONS.map((r) => <option key={r} value={r}>{r}</option>)}</select></div>
              <div className="md:col-span-2"><label className="label-field">Alamat Lengkap *</label><textarea className="input-field" rows={2} value={form.address} onChange={(e) => update('address', e.target.value)} /></div>
              <div><label className="label-field">No HP Siswa</label><input className="input-field" value={form.phone_student} onChange={(e) => update('phone_student', e.target.value)} /></div>
            </div>
          )}

          {/* Step 2: Data Orang Tua */}
          {step === 2 && (
            <div className="grid md:grid-cols-2 gap-4 animate-fade-up">
              <div className="md:col-span-2"><h2 className="text-xl font-bold text-gray-900 mb-2">Data Ayah</h2></div>
              <div><label className="label-field">Nama Ayah *</label><input className="input-field" value={form.father_name} onChange={(e) => update('father_name', e.target.value)} /></div>
              <div><label className="label-field">Pekerjaan Ayah</label><input className="input-field" value={form.father_job} onChange={(e) => update('father_job', e.target.value)} /></div>
              <div><label className="label-field">Penghasilan Ayah (per bulan)</label><input className="input-field" value={form.father_income} onChange={(e) => update('father_income', e.target.value)} /></div>
              <div><label className="label-field">Pendidikan Ayah</label><input className="input-field" value={form.father_education} onChange={(e) => update('father_education', e.target.value)} /></div>
              <div className="md:col-span-2"><h2 className="text-xl font-bold text-gray-900 mb-2 mt-4">Data Ibu</h2></div>
              <div><label className="label-field">Nama Ibu *</label><input className="input-field" value={form.mother_name} onChange={(e) => update('mother_name', e.target.value)} /></div>
              <div><label className="label-field">Pekerjaan Ibu</label><input className="input-field" value={form.mother_job} onChange={(e) => update('mother_job', e.target.value)} /></div>
              <div><label className="label-field">Penghasilan Ibu (per bulan)</label><input className="input-field" value={form.mother_income} onChange={(e) => update('mother_income', e.target.value)} /></div>
              <div><label className="label-field">Pendidikan Ibu</label><input className="input-field" value={form.mother_education} onChange={(e) => update('mother_education', e.target.value)} /></div>
              <div className="md:col-span-2"><h2 className="text-xl font-bold text-gray-900 mb-2 mt-4">Data Wali (Opsional)</h2></div>
              <div><label className="label-field">Nama Wali</label><input className="input-field" value={form.guardian_name} onChange={(e) => update('guardian_name', e.target.value)} /></div>
              <div><label className="label-field">No HP Wali</label><input className="input-field" value={form.guardian_phone} onChange={(e) => update('guardian_phone', e.target.value)} /></div>
            </div>
          )}

          {/* Step 3: Data Fisik & Sosial */}
          {step === 3 && (
            <div className="grid md:grid-cols-2 gap-4 animate-fade-up">
              <div className="md:col-span-2"><h2 className="text-xl font-bold text-gray-900 mb-2">Data Fisik</h2></div>
              <div><label className="label-field">Tinggi Badan (cm)</label><input type="number" className="input-field" value={form.height_cm} onChange={(e) => update('height_cm', e.target.value)} /></div>
              <div><label className="label-field">Berat Badan (kg)</label><input type="number" className="input-field" value={form.weight_kg} onChange={(e) => update('weight_kg', e.target.value)} /></div>
              <div><label className="label-field">Lingkar Kepala (cm)</label><input type="number" className="input-field" value={form.head_circumference_cm} onChange={(e) => update('head_circumference_cm', e.target.value)} /></div>
              <div className="md:col-span-2"><h2 className="text-xl font-bold text-gray-900 mb-2 mt-4">Data Sosial</h2></div>
              <div><label className="label-field">No. KIP</label><input className="input-field" value={form.kip_number} onChange={(e) => update('kip_number', e.target.value)} /></div>
              <div><label className="label-field">No. KIS</label><input className="input-field" value={form.kis_number} onChange={(e) => update('kis_number', e.target.value)} /></div>
              <div><label className="label-field">No. KKS</label><input className="input-field" value={form.kks_number} onChange={(e) => update('kks_number', e.target.value)} /></div>
            </div>
          )}

          {/* Step 4: Data Akademik */}
          {step === 4 && (
            <div className="grid md:grid-cols-2 gap-4 animate-fade-up">
              <div className="md:col-span-2"><h2 className="text-xl font-bold text-gray-900 mb-2">Data Akademik</h2></div>
              <div><label className="label-field">Sekolah Asal</label><input className="input-field" value={form.previous_school} onChange={(e) => update('previous_school', e.target.value)} /></div>
              <div><label className="label-field">No. STTB / Ijazah</label><input className="input-field" value={form.sttb_number} onChange={(e) => update('sttb_number', e.target.value)} /></div>
              <div className="md:col-span-2"><label className="label-field">Prestasi / Nilai</label><textarea className="input-field" rows={3} value={form.achievements} onChange={(e) => update('achievements', e.target.value)} /></div>
              <div className="md:col-span-2"><label className="label-field">Jalur Pendaftaran</label><select className="input-field" value={form.registration_path} onChange={(e) => update('registration_path', e.target.value)}>{PATHS.map((p) => <option key={p} value={p}>{p}</option>)}</select></div>
            </div>
          )}

          {/* Step 5: Unggah Dokumen */}
          {step === 5 && (
            <div className="animate-fade-up">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Unggah Dokumen</h2>
              <p className="text-sm text-gray-500 mb-4">Unggah dokumen sesuai persyaratan. Format: PDF, JPG, PNG (maks. 5MB).</p>
              <div className="space-y-4">
                {activeDocFields.map((df) => (
                  <div key={df.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-medium text-gray-800 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-blue-600" />
                        {df.label}
                        {df.is_required ? (
                          <span className="badge bg-red-100 text-red-700">Wajib *</span>
                        ) : (
                          <span className="badge bg-gray-100 text-gray-500">Opsional</span>
                        )}
                      </label>
                    </div>
                    <input
                      type="file"
                      accept={df.accepted_types ?? '.pdf,.jpg,.jpeg,.png'}
                      onChange={(e) => handleFileChange(df.id, e.target.files?.[0] ?? null)}
                      className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-medium hover:file:bg-blue-100"
                    />
                    {docFiles[df.id] && (
                      <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <Check className="w-3 h-3" /> {docFiles[df.id].name}
                      </p>
                    )}
                  </div>
                ))}
                {activeDocFields.length === 0 && (
                  <p className="text-gray-500 text-sm">Tidak ada dokumen yang perlu diunggah.</p>
                )}
              </div>
            </div>
          )}

          {/* Step 6: Konfirmasi */}
          {step === 6 && (
            <div className="animate-fade-up">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Konfirmasi Data</h2>
              <p className="text-sm text-gray-500 mb-4">Periksa kembali data Anda sebelum mengirim.</p>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-lg p-3"><strong>Nama:</strong> {form.full_name}</div>
                <div className="bg-gray-50 rounded-lg p-3"><strong>NISN:</strong> {form.nisn}</div>
                <div className="bg-gray-50 rounded-lg p-3"><strong>Tempat/Tgl Lahir:</strong> {form.birth_place}, {form.birth_date}</div>
                <div className="bg-gray-50 rounded-lg p-3"><strong>JK/Agama:</strong> {form.gender} / {form.religion}</div>
                <div className="bg-gray-50 rounded-lg p-3"><strong>Ayah:</strong> {form.father_name}</div>
                <div className="bg-gray-50 rounded-lg p-3"><strong>Ibu:</strong> {form.mother_name}</div>
                <div className="bg-gray-50 rounded-lg p-3"><strong>Sekolah Asal:</strong> {form.previous_school || '-'}</div>
                <div className="bg-gray-50 rounded-lg p-3"><strong>Jalur:</strong> {form.registration_path}</div>
                <div className="bg-gray-50 rounded-lg p-3"><strong>Tinggi/Berat:</strong> {form.height_cm || '-'} cm / {form.weight_kg || '-'} kg</div>
                <div className="bg-gray-50 rounded-lg p-3"><strong>Dokumen:</strong> {Object.keys(docFiles).length} file siap</div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <button onClick={back} disabled={step === 1} className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft className="w-5 h-5" /> Kembali
            </button>
            {step < STEPS.length ? (
              <button onClick={next} className="btn-primary">
                Lanjut <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={submitting} className="btn-primary bg-green-600 hover:bg-green-700 disabled:opacity-50">
                {submitting ? 'Mengirim...' : <><Send className="w-5 h-5" /> Kirim Pendaftaran</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
