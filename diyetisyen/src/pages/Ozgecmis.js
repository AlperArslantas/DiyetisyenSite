import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import './Ozgecmis.css';

const Ozgecmis = () => {
  const [profileImage, setProfileImage] = useState('');
  const [aboutText, setAboutText] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const docRef = doc(db, 'contents', 'ozgecmis-about');
        const imagesRef = doc(db, 'contents', 'images');
        const [docSnap, imagesSnap] = await Promise.all([
          getDoc(docRef),
          getDoc(imagesRef)
        ]);

        if (docSnap.exists()) {
          setAboutText(docSnap.data().text);
        }

        if (imagesSnap.exists() && imagesSnap.data()['ozgecmis-image']) {
          setProfileImage(imagesSnap.data()['ozgecmis-image']);
        }
      } catch (error) {
        console.error('İçerik getirilirken hata oluştu:', error);
      }
    };

    fetchContent();
  }, []);

  return (
    <div className="ozgecmis-container page-transition">
      <div className="ozgecmis-header">
        <div className="profile-section">
          <div className="profile-image">
            {profileImage && (
              <img 
                src={profileImage} 
                alt="Diyetisyen Halime Akdoğan" 
                loading="lazy" 
              />
            )}
          </div>
          <div className="profile-info">
            <h1>Dyt. Halime Akdoğan</h1>
            <p className="title"></p>
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