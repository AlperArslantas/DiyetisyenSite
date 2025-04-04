import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import './ConsultancyDetails.css';

const ConsultancyDetails = () => {
  const [detailsContent, setDetailsContent] = useState({
    title: '',
    paragraphs: []
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const docRef = doc(db, 'contents', 'danismanlik-details');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setDetailsContent(docSnap.data());
        }
      } catch (error) {
        console.error('Detaylar getirilirken hata oluştu:', error);
      }
    };

    fetchDetails();
  }, []);

  return (
    <div className="consultancy-details-container page-transition">
      <div className="details-header">
        <h1>{detailsContent.title || 'Danışmanlık Hizmetleri'}</h1>
        <div className="title-underline"></div>
      </div>

      <div className="details-content">
        <div className="content-section">
          {detailsContent.paragraphs?.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConsultancyDetails; 