import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import emailjs from '@emailjs/browser';
import './Contact.css';

const Contact = () => {
  const [introText, setIntroText] = useState('');
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [status, setStatus] = useState({
    submitting: false,
    info: { error: false, msg: null }
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // İletişim giriş metnini getir
        const introDocRef = doc(db, 'contents', 'iletisim-intro');
        const introDocSnap = await getDoc(introDocRef);
        
        if (introDocSnap.exists()) {
          setIntroText(introDocSnap.data().text);
        }

        // İletişim bilgilerini getir
        const contactInfoRef = doc(db, 'contents', 'iletisim-bilgileri');
        const contactInfoSnap = await getDoc(contactInfoRef);
        
        if (contactInfoSnap.exists()) {
          setContactInfo(contactInfoSnap.data());
        }
      } catch (error) {
        console.error('İçerik getirilirken hata oluştu:', error);
      }
    };

    fetchContent();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(prevStatus => ({ ...prevStatus, submitting: true }));

    try {
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        {
          to_name: 'Alper',
          from_name: formData.name,
          from_email: formData.email,
          phone_number: formData.phone,
          message: formData.message,
          to_email: 'alper71071@gmail.com'
        },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );

      setStatus({
        submitting: false,
        info: { error: false, msg: "Mesajınız başarıyla gönderildi!" }
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });

    } catch (error) {
      setStatus({
        submitting: false,
        info: { error: true, msg: "Bir hata oluştu, lütfen tekrar deneyin." }
      });
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-header animate">
        <h1 className="contact-title">İLETİŞİM</h1>
        <div className="title-underline"></div>
        <p className="contact-subtitle">{introText}</p>
      </div>

      <div className="contact-content">
        <div className="contact-info animate">
          <div className="info-card">
            <div className="info-icon">
              <i className="fas fa-phone"></i>
            </div>
            <h3>Telefon</h3>
            <p>{contactInfo.phone}</p>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <i className="fas fa-envelope"></i>
            </div>
            <h3>E-posta</h3>
            <p>{contactInfo.email}</p>
          </div>
        </div>

        <form className="contact-form animate" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">
              <i className="fas fa-user"></i>
              İsim Soyisim
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <i className="fas fa-envelope"></i>
              E-posta
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              <i className="fas fa-phone"></i>
              Telefon
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">
              <i className="fas fa-comment"></i>
              Mesajınız
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={status.submitting}
          >
            {!status.submitting ? (
              <>
                <i className="fas fa-paper-plane"></i>
                Gönder
              </>
            ) : (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Gönderiliyor...
              </>
            )}
          </button>

          {status.info.msg && (
            <div className={`form-message ${status.info.error ? 'error' : 'success'}`}>
              {status.info.msg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Contact;