import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaFacebook, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import './BlogPost.css';

const BlogPost = () => {
  const { id } = useParams();
  const post = useSelector(state => 
    state.blog.posts.find(post => post.id === id)
  );

  if (!post) {
    return (
      <div className="blog-post-container">
        <div className="loading">Yükleniyor...</div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  const shareUrl = window.location.href;

  return (
    <div className="blog-post-container page-transition">
      <div className="blog-post-header">
        <h1>{post.title}</h1>
        <div className="blog-post-date">
          {formatDate(post.createdAt)}
        </div>
      </div>
      
      <div className="blog-post-content">
        <div className="blog-post-text">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          
          <div className="blog-post-tags">
            <span className="blog-post-tag">Sağlıklı Beslenme</span>
            <span className="blog-post-tag">Diyet</span>
            <span className="blog-post-tag">Yaşam</span>
          </div>

          <div className="blog-post-share">
            <h3>Bu Yazıyı Paylaş</h3>
            <div className="share-buttons">
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-button"
              >
                <FaFacebook /> Facebook
              </a>
              <a 
                href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${post.title}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-button"
              >
                <FaTwitter /> Twitter
              </a>
              <a 
                href={`https://wa.me/?text=${post.title} ${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-button"
              >
                <FaWhatsapp /> WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="blog-post-image-container">
          <div className="blog-post-image">
            <img src={post.imageUrl} alt={post.title} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost; 