import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD296EUwe-YfSp-4bW3Pz2TbYhy-4-H8VU",
  authDomain: "diyetisyen-3809c.firebaseapp.com",
  projectId: "diyetisyen-3809c",
  storageBucket: "diyetisyen-3809c.firebasestorage.app",
  messagingSenderId: "401795538751",
  appId: "1:401795538751:web:8b3658eee784e2fbae7d8a",
  measurementId: "G-PZHLE60HVQ"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Başlangıç içerikleri
const initialContents = {
  'anasayfa-hero': {
    text: 'Sağlıklı bir yaşam için doğru beslenme alışkanlıkları edinmenize yardımcı oluyorum.'
  },
  'hakkimda-intro': {
    text: 'Merhaba, ben Dyt. Halime Akdoğan. Beslenme ve diyet alanında uzmanlaşmış bir diyetisyenim.'
  },
  'hakkimda-detay': {
    text: 'Sağlıklı beslenme konusunda kişiye özel yaklaşımlar geliştirerek, danışanlarımın hedeflerine ulaşmalarına yardımcı oluyorum.'
  },
  'danismanlik-intro': {
    text: 'Size özel beslenme planları ile sağlıklı yaşam hedeflerinize ulaşmanıza yardımcı oluyorum.'
  },
  'iletisim-intro': {
    text: 'Sağlıklı bir yaşam için ilk adımı atmaya hazır mısınız? Hemen iletişime geçin.'
  }
};

// İçerikleri Firebase'e ekle
async function initializeContents() {
  try {
    // Önce giriş yapalım
    await signInWithEmailAndPassword(auth, 'diyetisyen.web1@gmail.com', 'alp123456');
    console.log('Giriş başarılı!');

    // İçerikleri ekleyelim
    for (const [id, content] of Object.entries(initialContents)) {
      await setDoc(doc(db, 'contents', id), content);
      console.log(`${id} içeriği başarıyla eklendi.`);
    }
    console.log('Tüm içerikler başarıyla eklendi!');
  } catch (error) {
    console.error('Hata oluştu:', error);
  }
}

initializeContents(); 