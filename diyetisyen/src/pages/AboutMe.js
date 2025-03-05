import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import './AboutMe.css';
import benKimimImage from '../assets/benKimimImage.jpeg';

const AboutMe = () => {
  const [introText, setIntroText] = useState('');
  const [detailText, setDetailText] = useState('');
  const [aboutImage, setAboutImage] = useState('');

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const introDoc = await getDoc(doc(db, 'contents', 'hakkimda-intro'));
        const detailDoc = await getDoc(doc(db, 'contents', 'hakkimda-detay'));
        const imagesDoc = await getDoc(doc(db, 'contents', 'images'));
        
        if (introDoc.exists()) {
          setIntroText(introDoc.data().text);
        }
        if (detailDoc.exists()) {
          setDetailText(detailDoc.data().text);
        }
        if (imagesDoc.exists() && imagesDoc.data()['hakkimda-image']) {
          setAboutImage(imagesDoc.data()['hakkimda-image']);
        }
      } catch (error) {
        console.error('İçerik getirilirken hata oluştu:', error);
      }
    };

    fetchContents();
  }, []);

  return (
    <div className="about-container page-transition">
      <div className="about-header">
        <h1>Hakkımda</h1>
        <p className="about-description">{introText}</p>
        <Link to="/ozgecmis" className="about-detail-btn">
          Detaylı Bilgi
        </Link>
      </div>

      <div className="about-profile">
        <div className="profile-image-container">
          <div className="profile-image-circle">
            <img src={aboutImage || benKimimImage} alt="Diyetisyen" loading="lazy" />
          </div>
          <div className="decorative-elements">
            <div className="leaf leaf-1"></div>
            <div className="leaf leaf-2"></div>
            <div className="leaf leaf-3"></div>
            <div className="berry berry-1"></div>
            <div className="berry berry-2"></div>
          </div>
        </div>
        <h2 className="welcome-text">{detailText}</h2>
      </div>

     
    </div>
  );
};

export default AboutMe; 