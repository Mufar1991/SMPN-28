import { Routes, Route } from 'react-router-dom';
import { DataProvider } from '@/context/DataContext';
import { AdminProvider } from '@/context/AdminContext';
import PublicLayout from '@/components/layout/PublicLayout';
import AdminLayout from '@/components/admin/AdminLayout';

import HomePage from '@/pages/public/HomePage';
import AboutPage from '@/pages/public/AboutPage';
import TeachersPage from '@/pages/public/TeachersPage';
import FacilitiesPage from '@/pages/public/FacilitiesPage';
import NewsListPage from '@/pages/public/NewsListPage';
import NewsDetailPage from '@/pages/public/NewsDetailPage';
import ELearningPage from '@/pages/public/ELearningPage';
import ExtracurricularPage from '@/pages/public/ExtracurricularPage';
import SpmbPage from '@/pages/public/SpmbPage';
import ContactPage from '@/pages/public/ContactPage';

import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminRunningText from '@/pages/admin/AdminRunningText';
import AdminSpmbData from '@/pages/admin/AdminSpmbData';
import AdminSpmbForm from '@/pages/admin/AdminSpmbForm';
import AdminHero from '@/pages/admin/AdminHero';
import AdminNews from '@/pages/admin/AdminNews';
import AdminTeachers from '@/pages/admin/AdminTeachers';
import AdminFacilities from '@/pages/admin/AdminFacilities';
import AdminELearning from '@/pages/admin/AdminELearning';
import AdminExtracurricular from '@/pages/admin/AdminExtracurricular';
import AdminTimeline from '@/pages/admin/AdminTimeline';
import AdminContact from '@/pages/admin/AdminContact';
import AdminProfile from '@/pages/admin/AdminProfile';

function App() {
  return (
    <DataProvider>
      <AdminProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/profil" element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/guru-staf" element={<PublicLayout><TeachersPage /></PublicLayout>} />
          <Route path="/fasilitas" element={<PublicLayout><FacilitiesPage /></PublicLayout>} />
          <Route path="/berita" element={<PublicLayout><NewsListPage /></PublicLayout>} />
          <Route path="/berita/:slug" element={<PublicLayout><NewsDetailPage /></PublicLayout>} />
          <Route path="/e-learning" element={<PublicLayout><ELearningPage /></PublicLayout>} />
          <Route path="/ekstrakurikuler" element={<PublicLayout><ExtracurricularPage /></PublicLayout>} />
          <Route path="/spmb" element={<PublicLayout><SpmbPage /></PublicLayout>} />
          <Route path="/kontak" element={<PublicLayout><ContactPage /></PublicLayout>} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/running-text" element={<AdminLayout><AdminRunningText /></AdminLayout>} />
          <Route path="/admin/spmb-data" element={<AdminLayout><AdminSpmbData /></AdminLayout>} />
          <Route path="/admin/spmb-form" element={<AdminLayout><AdminSpmbForm /></AdminLayout>} />
          <Route path="/admin/hero" element={<AdminLayout><AdminHero /></AdminLayout>} />
          <Route path="/admin/news" element={<AdminLayout><AdminNews /></AdminLayout>} />
          <Route path="/admin/teachers" element={<AdminLayout><AdminTeachers /></AdminLayout>} />
          <Route path="/admin/facilities" element={<AdminLayout><AdminFacilities /></AdminLayout>} />
          <Route path="/admin/elearning" element={<AdminLayout><AdminELearning /></AdminLayout>} />
          <Route path="/admin/extracurricular" element={<AdminLayout><AdminExtracurricular /></AdminLayout>} />
          <Route path="/admin/timeline" element={<AdminLayout><AdminTimeline /></AdminLayout>} />
          <Route path="/admin/contact" element={<AdminLayout><AdminContact /></AdminLayout>} />
          <Route path="/admin/profile" element={<AdminLayout><AdminProfile /></AdminLayout>} />

          {/* Fallback */}
          <Route path="*" element={<PublicLayout><HomePage /></PublicLayout>} />
        </Routes>
      </AdminProvider>
    </DataProvider>
  );
}

export default App;
