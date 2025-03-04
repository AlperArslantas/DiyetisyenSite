import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/">
            <h1>Halime Akdoğan</h1>
            <h2>DİYETİSYEN</h2>
          </Link>
        </div>

        <ul className="navbar-links">
          <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>ANASAYFA</Link></li>
          <li><Link to="/ben-kimim" className={location.pathname === '/ben-kimim' ? 'active' : ''}>HAKKIMDA</Link></li>
          <li><Link to="/danismanliklar" className={location.pathname === '/danismanliklar' ? 'active' : ''}>DANIŞMANLIKLAR</Link></li>
          <li><Link to="/iletisim" className={location.pathname === '/iletisim' ? 'active' : ''}>İLETİŞİM</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 