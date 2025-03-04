import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutMe from './pages/AboutMe';
import Services from './pages/Services';
import Contact from './pages/Contact';
import BlogPost from './pages/BlogPost';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import Ozgecmis from './pages/Ozgecmis';
import ConsultancyDetails from './pages/ConsultancyDetails';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ben-kimim" element={<AboutMe />} />
            <Route path="/ozgecmis" element={<Ozgecmis />} />
            <Route path="/danismanliklar" element={<Services />} />
            <Route path="/danismanlik-detay" element={<ConsultancyDetails />} />
            <Route path="/iletisim" element={<Contact />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/admin" 
              element={
                <PrivateRoute>
                  <AdminPanel />
                </PrivateRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
        <Analytics />
      </div>
    </Router>
  );
}

export default App;
