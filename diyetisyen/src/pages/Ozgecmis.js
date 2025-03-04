import React, { useState, useEffect } from 'react';
import './Ozgecmis.css';
import benKimimImage from '../assets/benKimimImage.jpeg';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const Ozgecmis = () => {
  const [aboutText, setAboutText] = useState('');
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const aboutDoc = await getDoc(doc(db, 'contents', 'ozgecmis-about'));
        const imagesDoc = await getDoc(doc(db, 'contents', 'images'));
        
        // Varsayılan değer
        const defaultAbout = 'Merhaba! Ben Diyetisyen Halime Akdoğan. Hacettepe Üniversitesi Beslenme ve Diyetetik Bölümü mezunuyum. Sağlıklı beslenme konusundaki tutkum ve kişiselleştirilmiş beslenme planlarına olan inancım, her danışanım için özel bir yaklaşım geliştirmeme yardımcı oluyor.';

        // Veriyi ayarla, eğer yoksa varsayılan değeri kullan
        setAboutText(aboutDoc.exists() ? aboutDoc.data().text : defaultAbout);

        if (imagesDoc.exists() && imagesDoc.data()['ozgecmis-image']) {
          setProfileImage(imagesDoc.data()['ozgecmis-image']);
        }

      } catch (error) {
        console.error('İçerik getirilirken hata oluştu:', error);
      }
    };

    fetchContents();
  }, []);

  return (
    <div className="ozgecmis-container">
      <div className="ozgecmis-header">
        <div className="profile-section">
          <div className="profile-image">
            <img src={profileImage || benKimimImage} alt="Diyetisyen" loading="lazy" />
          </div>
          <div className="profile-info">
            <h1>Dyt. Halime Akdoğan</h1>
            <p className="title">Uzman Diyetisyen</p>
          </div>
        </div>
      </div>

      <div className="ozgecmis-content">
        <section className="about-section">
          <h2>Hakkımda</h2>
          <p>{aboutText}</p>
        </section>
      </div>
    </div>
  );
};

export default Ozgecmis; 