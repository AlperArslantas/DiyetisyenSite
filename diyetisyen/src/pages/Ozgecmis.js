import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import './Ozgecmis.css';

const Ozgecmis = () => {
  const [aboutContent, setAboutContent] = useState({
    title: '',
    paragraphs: []
  });
  const [aboutImage, setAboutImage] = useState(null);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const docRef = doc(db, 'contents', 'ozgecmis-about');
        const docSnap = await getDoc(docRef);
        const imagesDoc = await getDoc(doc(db, 'contents', 'images'));
        
        if (docSnap.exists()) {
          setAboutContent(docSnap.data());
        }
        
        if (imagesDoc.exists()) {
          setAboutImage(imagesDoc.data()['ozgecmis-image']);
        }
      } catch (error) {
        console.error('Özgeçmiş içeriği getirilirken hata oluştu:', error);
      }
    };

    fetchAboutContent();
  }, []);

  return (
    <div className="ozgecmis-container page-transition">
      <div className="about-section">
        <h1>
          {aboutImage && (
            <div className="profile-image">
              <img src={aboutImage} alt="Diyetisyen Halime Akdoğan" />
            </div>
          )}
          {aboutContent.title || 'Dyt. Halime Akdoğan'}
        </h1>
        <div className="content-section">
          {aboutContent.paragraphs?.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ozgecmis; 