import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addBlogPost, updateBlogPost, fetchBlogPosts, deleteBlogPost } from '../redux/blogSlice';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import ContentManager from './ContentManager';
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'react-toastify/dist/ReactToastify.css';
import './AdminPanel.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('blog');
  const dispatch = useDispatch();
  const posts = useSelector(state => state.blog.posts);
  const [selectedPost, setSelectedPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null
  });

  useEffect(() => {
    dispatch(fetchBlogPosts());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedPost) {
      await dispatch(updateBlogPost({
        id: selectedPost.id,
        ...formData,
        prevImageUrl: selectedPost.imageUrl
      }));
    } else {
      await dispatch(addBlogPost(formData));
    }
    setFormData({ title: '', content: '', image: null });
    setSelectedPost(null);
  };

  const handleEditPost = (post) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      image: null
    });
  };

  const handleDelete = async (postId) => {
    const auth = getAuth();
    if (!auth.currentUser) {
      toast.error('Bu işlemi yapmak için giriş yapmalısınız!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    confirmAlert({
      title: 'Silme İşlemi',
      message: 'Bu blog yazısını silmek istediğinizden emin misiniz?',
      buttons: [
        {
          label: 'Evet',
          className: 'confirm-button',
          onClick: async () => {
            try {
              const result = await dispatch(deleteBlogPost(postId)).unwrap();
              toast.success('Blog başarıyla silindi! 🗑️', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });
            } catch (error) {
              console.error('Blog silinirken hata oluştu:', error);
              toast.error('Blog silinirken bir hata oluştu!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });
            }
          }
        },
        {
          label: 'Hayır',
          className: 'cancel-button',
          onClick: () => {}
        }
      ]
    });
  };

  return (
    <div className="admin-panel-container">
      <h1 className="admin-title">Yönetim Paneli</h1>
      
      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'blog' ? 'active' : ''}`}
          onClick={() => setActiveTab('blog')}
        >
          Blog Yönetimi
        </button>
        <button 
          className={`tab-button ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          İçerik Yönetimi
        </button>
      </div>

      {activeTab === 'blog' ? (
        <>
          <form onSubmit={handleSubmit} className="blog-form">
            <div className="form-group">
              <label htmlFor="title">Başlık</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">İçerik</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">Resim</label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                required={!selectedPost}
              />
            </div>

            <button type="submit" className="submit-button">
              {selectedPost ? 'Güncelle' : 'Yayınla'}
            </button>
          </form>

          <div className="posts-list">
            <h2>Mevcut Blog Yazıları</h2>
            {posts.map(post => (
              <div key={post.id} className="post-item">
                <img src={post.imageUrl} alt={post.title} className="post-thumbnail" />
                <div className="post-info">
                  <h3>{post.title}</h3>
                  <div className="post-actions">
                    <button onClick={() => handleEditPost(post)} className="edit-button">Düzenle</button>
                    <button 
                      onClick={() => handleDelete(post.id)} 
                      className="delete-button"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <ContentManager />
      )}
    </div>
  );
};

export default AdminPanel; 