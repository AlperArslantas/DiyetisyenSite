import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
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
    await signInWithEmailAndPassword(auth, process.env.REACT_APP_ADMIN_EMAIL, process.env.REACT_APP_ADMIN_PASSWORD);
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