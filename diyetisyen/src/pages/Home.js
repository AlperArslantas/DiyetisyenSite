import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import './Home.css';
import anasayfaImage from '../assets/anasayfa.jpeg';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogPosts } from '../redux/blogSlice';

const Home = () => {
  const dispatch = useDispatch();
  const posts = useSelector(state => state.blog.posts);
  const [heroText, setHeroText] = useState('');
  const [heroImage, setHeroImage] = useState('');

  useEffect(() => {
    dispatch(fetchBlogPosts());
  }, [dispatch]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const docRef = doc(db, 'contents', 'anasayfa-hero');
        const imagesRef = doc(db, 'contents', 'images');
        const [docSnap, imagesSnap] = await Promise.all([
          getDoc(docRef),
          getDoc(imagesRef)
        ]);
        
        if (docSnap.exists()) {
          setHeroText(docSnap.data().text);
        }
        if (imagesSnap.exists() && imagesSnap.data()['anasayfa-hero-image']) {
          setHeroImage(imagesSnap.data()['anasayfa-hero-image']);
        }
      } catch (error) {
        console.error('İçerik getirilirken hata oluştu:', error);
      }
    };

    fetchContent();
  }, []);

  return (
    <div className="home-container page-transition">
      <section className="hero-section">
        <div className="hero-content">
          <div className="welcome-text">
            <h1>MERHABA!</h1>
            <p>Ben Diyetisyen Halime,</p>
            <p>{heroText}</p>
          </div>
          <div className="home-profile-container">
            <img 
              src={heroImage || anasayfaImage} 
              alt="Diyetisyen Halime Akdoğan" 
              className="home-profile-image"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="blog-section">
        <div className="blog-intro">
          <h2>Blog </h2>
          <div className="title-underline"></div>
          <p>Sağlıklı beslenme ve yaşam tarzı hakkında bilgilendirici yazılar</p>
        </div>
        <div className="blog-grid">
          {posts.map((post, index) => (
            <Link 
              to={`/blog/${post.id}`} 
              key={post.id} 
              className="blog-card"
              style={{"--index": index}}
            >
              <div className="blog-image">
                <img src={post.imageUrl} alt={post.title} />
              </div>
              <div className="blog-content">
                <h3>{post.title}</h3>
                <p>{post.content.substring(0, 150)}...</p>
                <span className="read-more">Devamını Oku →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home; 