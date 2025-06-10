import React, { Suspense } from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import {Home} from './pages/Home';
import {Learn} from './pages/Learn';
import {Community} from './pages/Community';
import {AdminPanel} from './pages/AdminPanel';
import {Events} from './pages/Events';
import {Login} from './pages/Login';
import {Register} from './pages/Register';
import {CoursePage} from './pages/Course';
import { UserProvider } from './UserContext';
import {StudentProfile} from './pages/StudentProfile';
import { useTranslation } from 'react-i18next';
const App: React.FC = () => {
const {t, i18n} = useTranslation();
const changeLanguage = (lng: string) => {
  i18n.changeLanguage(lng);
}
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <UserProvider>
      <BrowserRouter>
        <Navbar />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/community" element={<Community />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/events" element={<Events />} />
            <Route path="/course/:id" element={<CoursePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<StudentProfile />} />
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
