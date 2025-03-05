import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import './ServiceModal.css';

const ServiceModal = ({ isOpen, onClose, service }) => {
  const navigate = useNavigate();
  const [serviceData, setServiceData] = useState(null);

  useEffect(() => {
    const fetchServiceData = async () => {
      if (!service) return;

      try {
        // Tüm danışmanlık hizmetlerini kontrol et
        const querySnapshot = await getDocs(collection(db, 'contents'));
        let foundService = null;

        querySnapshot.forEach((doc) => {
          if (doc.id.startsWith('danismanlik-') && doc.id !== 'danismanlik-intro' && doc.id === service.id) {
            foundService = { id: doc.id, ...doc.data() };
          }
        });

        if (foundService) {
          setServiceData(foundService);
        } else {
          // Eğer veritabanında bulunamazsa, gelen service objesini kullan
          setServiceData(service);
        }
      } catch (error) {
        console.error('Hizmet detayları getirilirken hata:', error);
      }
    };

    fetchServiceData();
  }, [service]);

  if (!isOpen || !service || !serviceData) return null;

  const handleContact = () => {
    onClose();
    navigate('/iletisim');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <h2>{serviceData.title}</h2>
        {serviceData.isDescriptionList ? (
          <ul className="details-list">
            {serviceData.description.split('\n').map((item, index) => (
              item.trim() && <li key={index}>{item.trim()}</li>
            ))}
          </ul>
        ) : (
          <p className="service-description">{serviceData.description}</p>
        )}
        
        <div className="service-section">
          <h3>Hizmet Detayları</h3>
          {serviceData.isList ? (
            <ul className="details-list">
              {serviceData.details.split('\n').map((item, index) => (
                item.trim() && <li key={index}>{item.trim()}</li>
              ))}
            </ul>
          ) : (
            <p className="service-details-text">{serviceData.details}</p>
          )}
        </div>

        <button className="contact-button" onClick={handleContact}>
          Randevu Al
        </button>
      </div>
    </div>
  );
};

export default ServiceModal; 