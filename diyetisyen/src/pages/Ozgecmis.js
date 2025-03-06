import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import './Ozgecmis.css';

const Ozgecmis = () => {
  const [aboutContent, setAboutContent] = useState({
    title: '',
    paragraphs: []
  });

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const docRef = doc(db, 'contents', 'ozgecmis-about');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setAboutContent(docSnap.data());
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
        <h1>{aboutContent.title || 'Özgeçmiş'}</h1>
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