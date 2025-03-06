import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Link } from 'react-router-dom';
import './Services.css';
import ServiceModal from '../components/ServiceModal';

const Services = () => {
  const [introText, setIntroText] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Giriş metnini getir
        const docRef = doc(db, 'contents', 'danismanlik-intro');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setIntroText(docSnap.data().text);
        }

        // Danışmanlık hizmetlerini getir
        const querySnapshot = await getDocs(collection(db, 'contents'));
        const servicesData = [];
        
        querySnapshot.forEach((doc) => {
          // Sadece danışmanlık hizmetlerini filtrele
          if (doc.id.startsWith('danismanlik-') && doc.id !== 'danismanlik-intro' && doc.id !== 'danismanlik-details') {
            servicesData.push({
              id: doc.id,
              title: doc.data().title,
              description: doc.data().description,
              details: doc.data().details,
              process: doc.data().process,
              isDescriptionList: doc.data().isDescriptionList,
              isList: doc.data().isList
            });
          }
        });

        if (servicesData.length > 0) {
          setServices(servicesData);
        } else {
          // Varsayılan hizmetler
          setServices([
            {
              id: 'danismanlik-bireysel',
              title: 'Bireysel Danışmanlık',
              description: 'Size özel, yaşam tarzınızı ve sağlık durumunuzu göz önünde bulundurarak hazırlanan kişiselleştirilmiş beslenme planı.',
              details: 'Bireysel danışmanlık hizmetimiz, detaylı beslenme öyküsü ve antropometrik ölçümlerle başlar. Size özel beslenme planı hazırlanır ve düzenli takip görüşmeleriyle desteklenir. Whatsapp üzerinden 7/24 destek sağlanır. İlk görüşme ve değerlendirme sonrası beslenme planınız hazırlanır, düzenli takip ve revizyonlarla hedeflerinize ulaşmanız sağlanır.',
              process: [
                'İlk görüşme ve değerlendirme',
                'Beslenme planı hazırlama',
                'Düzenli takip ve revizyon',
                'Hedef belirleme ve motivasyon'
              ]
            },
            {
              id: 'danismanlik-sporcu',
              title: 'Sporcu Beslenmesi',
              description: 'Performansınızı artırmak ve hedeflerinize ulaşmak için branşınıza özel beslenme danışmanlığı.',
              details: 'Sporcu beslenmesi programımız, antrenman ve müsabaka dönemlerine özel beslenme planları içerir. Takviye önerileri ve hidrasyon stratejileri ile performansınızı en üst düzeye çıkarmanıza yardımcı oluruz. Spor branşınıza özel analiz yapılır, beslenme programı oluşturulur ve düzenli performans takibi yapılır.',
              process: [
                'Spor branşı analizi',
                'Beslenme programı oluşturma',
                'Performans takibi',
                'Periyodik değerlendirme'
              ]
            },
            {
              id: 'danismanlik-online',
              title: 'Online Danışmanlık',
              description: 'Coğrafi kısıtlamalar olmadan, uzaktan beslenme danışmanlığı hizmeti.',
              details: 'Online danışmanlık hizmetimiz, video görüşmeler üzerinden konsültasyon ve dijital beslenme planı sunmaktadır. Online takip sistemi ile süreciniz yakından izlenir ve e-posta/mesaj desteği sağlanır. Program hazırlama ve uzaktan takip sistemiyle, bulunduğunuz yerden profesyonel beslenme danışmanlığı hizmeti alabilirsiniz.',
              process: [
                'Online görüşme planlaması',
                'Dijital form doldurma',
                'Program hazırlama',
                'Uzaktan takip ve destek'
              ]
            }
          ]);
        }
      } catch (error) {
        console.error('İçerik getirilirken hata oluştu:', error);
      }
    };

    fetchContent();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="services-container">
      <div className="services-header animate">
        <h1 className="services-title">Danışmanlık Hizmetleri</h1>
        <div className="title-underline"></div>
        <p className="services-subtitle">{introText}</p>
        <Link to="/danismanlik-detay" className="service-contact-button">
          Detaylı Bilgi
          <i className="fas fa-arrow-right"></i>
        </Link>
      </div>

      <div className="services-grid">
        {services.map(service => (
          <div key={service.id} className="service-card animate">
            <h2 className="service-title">{service.title}</h2>
            {service.isDescriptionList ? (
              <ul className="service-details">
                {service.description.split('\n').map((item, index) => (
                  item.trim() && <li key={index}>{item.trim()}</li>
                ))}
              </ul>
            ) : (
              <p className="service-description">{service.description}</p>
            )}
            <button 
              className="details-button"
              onClick={() => setSelectedService(service)}
            >
              Detaylı Bilgi
            </button>
          </div>
        ))}
      </div>

      <ServiceModal
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        service={selectedService}
      />
    </div>
  );
};

export default Services; 