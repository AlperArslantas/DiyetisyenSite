import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';
import './ContentManager.css';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ContentManager = () => {
  const [contents, setContents] = useState({});
  const [editingContent, setEditingContent] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [editedItems, setEditedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingService, setIsAddingService] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [newService, setNewService] = useState({
    id: '',
    title: '',
    description: '',
    details: '',
    duration: '',
    process: ''
  });

  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: ''
  });

  const [imageUploads, setImageUploads] = useState({
    'anasayfa-hero-image': null,
    'hakkimda-image': null,
    'ozgecmis-image': null
  });
  const [imageUrls, setImageUrls] = useState({
    'anasayfa-hero-image': '',
    'hakkimda-image': '',
    'ozgecmis-image': ''
  });

  useEffect(() => {
    fetchContents();
    fetchImages();
  }, []);

  const initializeOzgecmisContents = async () => {
    try {
      const ozgecmisContents = {
        'ozgecmis-about': {
          text: 'Merhaba! Ben Diyetisyen Halime Akdoğan. Hacettepe Üniversitesi Beslenme ve Diyetetik Bölümü mezunuyum. Sağlıklı beslenme konusundaki tutkum ve kişiselleştirilmiş beslenme planlarına olan inancım, her danışanım için özel bir yaklaşım geliştirmeme yardımcı oluyor.'
        }
      };

      await setDoc(doc(db, 'contents', 'ozgecmis-about'), ozgecmisContents['ozgecmis-about']);
      await fetchContents();
      toast.success('Özgeçmiş içeriği başarıyla oluşturuldu!');
    } catch (error) {
      console.error('Özgeçmiş içeriği oluşturulurken hata:', error);
      toast.error('Özgeçmiş içeriği oluşturulurken hata oluştu!');
    }
  };

  const initializeContactInfo = async () => {
    try {
      const contactData = {
        email: 'ornek@email.com',
        phone: '+90 555 555 55 55'
      };
      await setDoc(doc(db, 'contents', 'iletisim-bilgileri'), contactData);
      await fetchContents();
      toast.success('İletişim bilgileri başarıyla oluşturuldu!');
    } catch (error) {
      console.error('İletişim bilgileri oluşturulurken hata:', error);
      toast.error('İletişim bilgileri oluşturulurken hata oluştu!');
    }
  };

  const initializeConsultancyDetails = async () => {
    try {
      const detailsContent = {
        title: 'Danışmanlık Hizmetlerimiz',
        content: 'Sağlıklı beslenme yolculuğunuzda size rehberlik etmek için buradayız. Kişiselleştirilmiş beslenme programları ve profesyonel danışmanlık hizmetlerimiz ile hedeflerinize ulaşmanıza yardımcı oluyoruz.'
      };
      await setDoc(doc(db, 'contents', 'danismanlik-details'), detailsContent);
      await fetchContents();
      toast.success('Danışmanlık detay sayfası başarıyla oluşturuldu!');
    } catch (error) {
      console.error('Danışmanlık detay sayfası oluşturulurken hata:', error);
      toast.error('Danışmanlık detay sayfası oluşturulurken hata oluştu!');
    }
  };

  const fetchContents = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'contents'));
      const contentsData = {};
      querySnapshot.forEach((doc) => {
        contentsData[doc.id] = doc.data();
      });
      
      // Özgeçmiş içeriklerinin varlığını kontrol et
      const hasOzgecmisAbout = contentsData['ozgecmis-about'];
      
      // İletişim bilgilerinin varlığını kontrol et
      const hasContactInfo = contentsData['iletisim-bilgileri'];

      // Danışmanlık detay sayfasının varlığını kontrol et
      const hasConsultancyDetails = contentsData['danismanlik-details'];
      
      if (!hasOzgecmisAbout) {
        await initializeOzgecmisContents();
        return;
      }

      if (!hasContactInfo) {
        await initializeContactInfo();
        return;
      }

      if (!hasConsultancyDetails) {
        await initializeConsultancyDetails();
        return;
      }
      
      setContents(contentsData);
      // İletişim bilgilerini state'e yükle
      if (contentsData['iletisim-bilgileri']) {
        setContactInfo(contentsData['iletisim-bilgileri']);
      }
    } catch (error) {
      console.error('İçerikler getirilirken hata oluştu:', error);
      toast.error('İçerikler yüklenirken bir hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async () => {
    try {
      const imagesDoc = await getDoc(doc(db, 'contents', 'images'));
      if (imagesDoc.exists()) {
        setImageUrls(imagesDoc.data());
      }
    } catch (error) {
      console.error('Resimler yüklenirken hata:', error);
    }
  };

  const handleEdit = (contentId) => {
    if (contentId === 'danismanlik-details') {
      setEditedText(JSON.stringify({
        title: contents[contentId].title || '',
        content: contents[contentId].content || ''
      }, null, 2));
    } else if (contentId.startsWith('danismanlik-') && contentId !== 'danismanlik-intro') {
      setEditedText(JSON.stringify({
        title: contents[contentId].title || '',
        description: contents[contentId].description || '',
        details: contents[contentId].details || ''
      }, null, 2));
    } else {
      setEditedText(contents[contentId].text || '');
    }
    setEditingContent(contentId);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...editedItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setEditedItems(newItems);
  };

  const addNewItem = () => {
    if (editingContent === 'ozgecmis-education') {
      setEditedItems([...editedItems, {
        year: '',
        school: '',
        department: '',
        degree: ''
      }]);
    } else if (editingContent === 'ozgecmis-experience') {
      setEditedItems([...editedItems, {
        startYear: '',
        endYear: '',
        company: '',
        position: '',
        description: ''
      }]);
    } else if (editingContent === 'ozgecmis-certificates') {
      setEditedItems([...editedItems, {
        title: '',
        institution: '',
        year: ''
      }]);
    }
  };

  const removeItem = (index) => {
    setEditedItems(editedItems.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!editingContent) return;

    try {
      let contentToSave;
      
      if (editingContent.startsWith('danismanlik-') && editingContent !== 'danismanlik-intro' && editingContent !== 'danismanlik-details') {
        const parsedContent = JSON.parse(editedText);
        contentToSave = {
          title: parsedContent.title,
          description: parsedContent.description,
          details: parsedContent.details
        };
      } else {
        contentToSave = { text: editedText };
      }

      await setDoc(doc(db, 'contents', editingContent), contentToSave);
      
      setContents(prev => ({
        ...prev,
        [editingContent]: contentToSave
      }));
      
      setEditingContent(null);
      setEditedText('');
      toast.success('İçerik başarıyla güncellendi!');
    } catch (error) {
      console.error('İçerik kaydedilirken hata:', error);
      toast.error('İçerik kaydedilirken bir hata oluştu!');
    }
  };

  const handleCancel = () => {
    setEditingContent(null);
    setEditedText('');
    setEditedItems([]);
  };

  const handleContactInfoChange = (field, value) => {
    setContactInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactInfoSave = async () => {
    const auth = getAuth();
    if (!auth.currentUser) {
      toast.error('Bu işlemi yapmak için giriş yapmalısınız!');
      return;
    }

    try {
      await setDoc(doc(db, 'contents', 'iletisim-bilgileri'), contactInfo);
      setContents(prev => ({
        ...prev,
        'iletisim-bilgileri': contactInfo
      }));
      toast.success('İletişim bilgileri başarıyla güncellendi!');
    } catch (error) {
      console.error('İletişim bilgileri güncellenirken hata:', error);
      toast.error('İletişim bilgileri güncellenirken bir hata oluştu!');
    }
  };

  const getContentTitle = (id) => {
    const titles = {
      'anasayfa-hero': 'Anasayfa Hero Metni',
      'hakkimda-intro': 'Hakkımda Giriş Metni',
      'hakkimda-detay': 'Hakkımda Detay Metni',
      'danismanlik-intro': 'Danışmanlık Giriş Metni',
      'danismanlik-details': 'Danışmanlık Detay Sayfası',
      'iletisim-intro': 'İletişim Giriş Metni',
      'iletisim-bilgileri': 'İletişim Bilgileri',
      'ozgecmis-about': 'Özgeçmiş - Hakkımda'
    };
    return titles[id] || id;
  };

  const renderEditForm = (id, content) => {
    if (id === 'danismanlik-details') {
      let parsedContent;
      try {
        parsedContent = typeof editedText === 'string' ? JSON.parse(editedText) : {
          title: content.title || '',
          content: content.content || ''
        };
      } catch (error) {
        parsedContent = {
          title: content.title || '',
          content: content.content || ''
        };
      }

      return (
        <div className="service-edit-form">
          <div className="form-group">
            <label>Başlık</label>
            <input
              type="text"
              value={parsedContent.title}
              onChange={(e) => {
                const newContent = {
                  ...parsedContent,
                  title: e.target.value
                };
                setEditedText(JSON.stringify(newContent, null, 2));
              }}
            />
          </div>
          <div className="form-group">
            <label>İçerik</label>
            <textarea
              value={parsedContent.content}
              onChange={(e) => {
                const newContent = {
                  ...parsedContent,
                  content: e.target.value
                };
                setEditedText(JSON.stringify(newContent, null, 2));
              }}
              rows="15"
            />
          </div>
        </div>
      );
    } else if (id.startsWith('danismanlik-') && id !== 'danismanlik-intro') {
      let parsedContent;
      try {
        parsedContent = typeof editedText === 'string' ? JSON.parse(editedText) : {
          title: content.title || '',
          description: content.description || '',
          details: content.details || ''
        };
      } catch (error) {
        parsedContent = {
          title: content.title || '',
          description: content.description || '',
          details: content.details || ''
        };
      }

      return (
        <div className="service-edit-form">
          <div className="form-group">
            <label>Başlık*</label>
            <input
              type="text"
              value={parsedContent.title}
              onChange={(e) => {
                const updated = { ...parsedContent, title: e.target.value };
                setEditedText(JSON.stringify(updated, null, 2));
              }}
            />
          </div>
          <div className="form-group">
            <label>Açıklama</label>
            <textarea
              value={parsedContent.description}
              onChange={(e) => {
                const updated = { ...parsedContent, description: e.target.value };
                setEditedText(JSON.stringify(updated, null, 2));
              }}
              rows="4"
            />
          </div>
          <div className="form-group">
            <label>Hizmet Detayları</label>
            <textarea
              value={parsedContent.details}
              onChange={(e) => {
                const updated = { ...parsedContent, details: e.target.value };
                setEditedText(JSON.stringify(updated, null, 2));
              }}
              rows="6"
            />
          </div>
        </div>
      );
    } else if (id === 'iletisim-bilgileri') {
      return (
        <div className="contact-info-form">
          <div className="form-group">
            <label>E-posta Adresi</label>
            <input
              type="email"
              value={contactInfo.email}
              onChange={(e) => handleContactInfoChange('email', e.target.value)}
              placeholder="E-posta adresiniz"
            />
          </div>
          <div className="form-group">
            <label>Telefon Numarası</label>
            <input
              type="tel"
              value={contactInfo.phone}
              onChange={(e) => handleContactInfoChange('phone', e.target.value)}
              placeholder="Telefon numaranız"
            />
          </div>
        </div>
      );
    } else if (id === 'danismanlik-intro' || id === 'hakkimda-intro' || id === 'hakkimda-detay' || id === 'anasayfa-hero' || id === 'iletisim-intro' || id === 'ozgecmis-about') {
      return (
        <div className="text-edit-form">
          <div className="form-group">
            <label>{getContentTitle(id)}</label>
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              rows="8"
              placeholder="İçerik giriniz..."
            />
          </div>
        </div>
      );
    }
    return null;
  };

  const renderDisplayContent = (id, content) => {
    if (id === 'iletisim-bilgileri') {
      return (
        <div className="content-preview">
          <div className="preview-item">
            <p><strong>E-posta:</strong> {content.email}</p>
            <p><strong>Telefon:</strong> {content.phone}</p>
          </div>
        </div>
      );
    } else if (id === 'danismanlik-details') {
      return (
        <div className="content-preview">
          <h4>{content.title || 'Başlık'}</h4>
          <div className="content-text" style={{ whiteSpace: 'pre-wrap' }}>
            {content.content || ''}
          </div>
        </div>
      );
    } else {
      return <p className="content-text">{content?.text || ''}</p>;
    }
  };

  const handleAddService = () => {
    setIsAddingService(true);
  };

  const handleNewServiceChange = (field, value) => {
    if (field === 'details' || field === 'process') {
      setNewService(prev => ({
        ...prev,
        [field]: value
      }));
    } else {
      setNewService(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleNewServiceSubmit = async () => {
    if (!newService.title || !newService.description || !newService.details) {
      toast.error('Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      const serviceId = 'danismanlik-' + newService.title.toLowerCase().replace(/\s+/g, '-');
      await setDoc(doc(db, 'contents', serviceId), {
        title: newService.title,
        description: newService.description,
        details: newService.details
      });

      setNewService({
        title: '',
        description: '',
        details: ''
      });

      toast.success('Yeni hizmet başarıyla eklendi.');
      fetchContents(); // Listeyi güncelle
    } catch (error) {
      console.error('Hizmet eklenirken hata:', error);
      toast.error('Hizmet eklenirken bir hata oluştu.');
    }
  };

  const renderNewServiceForm = () => {
    return (
      <div className="new-service-form">
        <h3>Yeni Danışmanlık Hizmeti Ekle</h3>
        <input
          type="text"
          placeholder="Hizmet Başlığı"
          value={newService.title}
          onChange={(e) => setNewService({ ...newService, title: e.target.value })}
        />
        <textarea
          placeholder="Kısa Açıklama"
          value={newService.description}
          onChange={(e) => setNewService({ ...newService, description: e.target.value })}
        />
        <textarea
          placeholder="Hizmet Detayları"
          value={newService.details}
          onChange={(e) => setNewService({ ...newService, details: e.target.value })}
          rows="6"
        />
        <button onClick={handleNewServiceSubmit}>Hizmet Ekle</button>
      </div>
    );
  };

  const handleDeleteService = async (serviceId) => {
    const auth = getAuth();
    if (!auth.currentUser) {
      toast.error('Bu işlemi yapmak için giriş yapmalısınız!');
      return;
    }

    setServiceToDelete(serviceId);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, 'contents', serviceToDelete));
      setContents(prev => {
        const newContents = { ...prev };
        delete newContents[serviceToDelete];
        return newContents;
      });
      toast.success('Danışmanlık hizmeti başarıyla silindi!');
    } catch (error) {
      console.error('Danışmanlık hizmeti silinirken hata:', error);
      toast.error('Danışmanlık hizmeti silinirken bir hata oluştu!');
    } finally {
      setShowConfirmDialog(false);
      setServiceToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setServiceToDelete(null);
  };

  const ConfirmDialog = () => {
    if (!showConfirmDialog) return null;

    return (
      <div className="confirm-dialog-overlay">
        <div className="confirm-dialog">
          <h3>Danışmanlık Hizmetini Sil</h3>
          <p>Bu danışmanlık hizmetini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
          <div className="button-group">
            <button className="confirm-button" onClick={confirmDelete}>
              Evet, Sil
            </button>
            <button className="cancel-button" onClick={cancelDelete}>
              İptal
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleImageChange = (e, imageId) => {
    const file = e.target.files[0];
    if (file) {
      setImageUploads(prev => ({
        ...prev,
        [imageId]: file
      }));
    }
  };

  const handleImageUpload = async (imageId) => {
    const file = imageUploads[imageId];
    if (!file) {
      toast.error('Lütfen bir resim seçin!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'Blog_images');

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dgtaw69oo/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Resim yüklenirken bir hata oluştu');
      }

      const updatedUrls = {
        ...imageUrls,
        [imageId]: data.secure_url
      };

      await setDoc(doc(db, 'contents', 'images'), updatedUrls);
      
      setImageUrls(updatedUrls);
      setImageUploads(prev => ({
        ...prev,
        [imageId]: null
      }));

      const fileInput = document.querySelector(`input[type="file"][data-image-id="${imageId}"]`);
      if (fileInput) {
        fileInput.value = '';
      }

      toast.success('Resim başarıyla yüklendi!');
    } catch (error) {
      console.error('Resim yüklenirken hata:', error);
      toast.error('Resim yüklenirken bir hata oluştu!');
    }
  };

  const renderImageUploader = (imageId, title) => {
    return (
      <div className="image-upload-section">
        <h3>{title}</h3>
        {imageUrls[imageId] && (
          <div className="current-image">
            <img src={imageUrls[imageId]} alt={title} key={imageUrls[imageId]} />
          </div>
        )}
        <div className="upload-controls">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, imageId)}
            className="file-input"
            data-image-id={imageId}
          />
          <button
            className="upload-button"
            onClick={() => handleImageUpload(imageId)}
            disabled={!imageUploads[imageId]}
          >
            Resmi Yükle
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="content-manager">
        <h1>İçerik Yönetimi</h1>
        <div className="loading">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="content-manager">
      <h1>İçerik Yönetimi</h1>
      
      <div className="image-management-section">
        <h2>Resim Yönetimi</h2>
        <div className="image-uploaders">
          {renderImageUploader('anasayfa-hero-image', 'Anasayfa Hero Resmi')}
          {renderImageUploader('hakkimda-image', 'Hakkımda Sayfası Resmi')}
          {renderImageUploader('ozgecmis-image', 'Özgeçmiş Sayfası Profil Resmi')}
        </div>
      </div>

      {showConfirmDialog && <ConfirmDialog />}
      <div className="add-service-button-container">
        <button className="add-service-button" onClick={handleAddService}>
          <i className="fas fa-plus"></i> Yeni Danışmanlık Ekle
        </button>
      </div>
      
      {isAddingService ? (
        renderNewServiceForm()
      ) : (
        <div className="content-list">
          {Object.entries(contents).map(([id, content]) => (
            <div key={id} className="content-item">
              <h3>{getContentTitle(id)}</h3>
              {editingContent === id ? (
                <div className="edit-content">
                  {renderEditForm(id, content)}
                  <div className="button-group">
                    <button 
                      className="save-button"
                      onClick={handleSave}
                    >
                      Kaydet
                    </button>
                    <button 
                      className="cancel-button"
                      onClick={handleCancel}
                    >
                      İptal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="content-display">
                  {renderDisplayContent(id, content)}
                  <div className="button-group">
                    <button 
                      className="edit-button"
                      onClick={() => handleEdit(id)}
                    >
                      Düzenle
                    </button>
                    {id.startsWith('danismanlik-') && id !== 'danismanlik-intro' && (
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteService(id)}
                      >
                        Sil
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentManager; 