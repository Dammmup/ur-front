import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Community from './pages/Community';
import AdminPanel from './pages/AdminPanel';
import Events from './pages/Events';
import Login from './pages/Login';
import Register from './pages/Register';
const App: React.FC = () => {

  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/community" element={<Community />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/events" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
      <footer style={{ textAlign: 'center', padding: '32px 0 16px', color: '#888', fontSize: 16 }}>
        Uyghur Connect &copy; {new Date().getFullYear()}
      </footer>
    </BrowserRouter>
  );
};

export default App;
