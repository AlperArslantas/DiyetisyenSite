import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../firebase/config';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

// Cloudinary upload fonksiyonu
const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'Blog_images'); // Oluşturduğunuz preset adı

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/dgtaw69oo/image/upload`, // Cloud name'inizi buraya yazın
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await response.json();
  return data.secure_url;
};

export const fetchBlogPosts = createAsyncThunk(
  'blog/fetchBlogPosts',
  async () => {
    const querySnapshot = await getDocs(collection(db, 'blogPosts'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
);

export const addBlogPost = createAsyncThunk(
  'blog/addBlogPost',
  async ({ title, content, image }) => {
    // Resmi Cloudinary'ye yükle
    const imageUrl = await uploadToCloudinary(image);

    const docRef = await addDoc(collection(db, 'blogPosts'), {
      title,
      content,
      imageUrl,
      createdAt: new Date().toISOString()
    });

    return {
      id: docRef.id,
      title,
      content,
      imageUrl,
      createdAt: new Date().toISOString()
    };
  }
);

export const updateBlogPost = createAsyncThunk(
  'blog/updateBlogPost',
  async ({ id, title, content, image, prevImageUrl }) => {
    let imageUrl = prevImageUrl;

    if (image) {
      // Yeni resmi Cloudinary'ye yükle
      imageUrl = await uploadToCloudinary(image);
    }

    const docRef = doc(db, 'blogPosts', id);
    await updateDoc(docRef, {
      title,
      content,
      imageUrl,
      updatedAt: new Date().toISOString()
    });

    return {
      id,
      title,
      content,
      imageUrl,
      updatedAt: new Date().toISOString()
    };
  }
);

export const deleteBlogPost = createAsyncThunk(
  'blog/deleteBlogPost',
  async (postId) => {
    await deleteDoc(doc(db, 'blogPosts', postId));
    return postId;
  }
);

const blogSlice = createSlice({
  name: 'blog',
  initialState: {
    posts: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBlogPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchBlogPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addBlogPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
      })
      .addCase(updateBlogPost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(deleteBlogPost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteBlogPost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = state.posts.filter(post => post.id !== action.payload);
      })
      .addCase(deleteBlogPost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default blogSlice.reducer; 