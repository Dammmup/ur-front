import React, { Suspense } from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Learn } from './pages/Learn';
import { Community } from './pages/Community';
import { AdminPanel } from './pages/AdminPanel';
import { Events } from './pages/Events';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { CoursePage } from './pages/Course';
import { StudentProfile } from './pages/StudentProfile';
import { AboutUs } from './pages/AboutUs';
import { Pricing } from './pages/Pricing';
import { UserProvider } from './UserContext';

const App: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserProvider>
        <BrowserRouter>
          <Navbar />
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/pricing" element={<Pricing />} />

              {/* Protected routes */}
              <Route
                path="/learn"
                element={
                  <ProtectedRoute requiresAccess={true}>
                    <Learn />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/course/:id"
                element={
                  <ProtectedRoute requiresAccess={true}>
                    <CoursePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/community"
                element={
                  <ProtectedRoute>
                    <Community />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/events"
                element={
                  <ProtectedRoute>
                    <Events />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/:id"
                element={
                  <ProtectedRoute>
                    <StudentProfile />
                  </ProtectedRoute>
                }
              />

              {/* Admin-only route */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
          <footer style={{ textAlign: 'center', padding: '32px 0 16px', color: '#888', fontSize: 16 }}>
            Uyghur Connect &copy; {new Date().getFullYear()}
          </footer>
        </BrowserRouter>
      </UserProvider>
    </Suspense>
  );
};

export default App;
