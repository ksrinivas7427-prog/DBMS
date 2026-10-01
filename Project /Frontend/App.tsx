import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { Home } from './pages/Home';
import { Campaigns } from './pages/Campaigns';
import { CampaignDetail } from './pages/CampaignDetail';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Creator Pages
import { CreatorDashboard } from './pages/creator/CreatorDashboard';
import { CreateCampaign } from './pages/creator/CreateCampaign';
import { MyCampaigns } from './pages/creator/MyCampaigns';
import { ManageCampaignContent } from './pages/creator/ManageCampaignContent';

// Donor Pages
import { DonorDashboard } from './pages/donor/DonorDashboard';
import { MyDonations } from './pages/donor/MyDonations';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminCampaigns } from './pages/admin/AdminCampaigns';
import { AdminCampaignDetail } from './pages/admin/AdminCampaignDetail';
import { AdminUsers } from './pages/admin/AdminUsers';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-surface font-sans text-slate-900 antialiased selection:bg-primary/20 selection:text-primary">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/campaigns/:id" element={<CampaignDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Creator Protected Routes */}
              <Route
                path="/creator/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['CREATOR']}>
                    <CreatorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/creator/campaigns/create"
                element={
                  <ProtectedRoute allowedRoles={['CREATOR']}>
                    <CreateCampaign />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/creator/campaigns/:id/content"
                element={
                  <ProtectedRoute allowedRoles={['CREATOR', 'ADMIN']}>
                    <ManageCampaignContent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/creator/campaigns"
                element={
                  <ProtectedRoute allowedRoles={['CREATOR']}>
                    <MyCampaigns />
                  </ProtectedRoute>
                }
              />

              {/* Donor Protected Routes */}
              <Route
                path="/donor/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['DONOR']}>
                    <DonorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/donor/donations"
                element={
                  <ProtectedRoute allowedRoles={['DONOR']}>
                    <MyDonations />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/campaigns"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminCampaigns />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/campaigns/:id"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminCampaignDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
