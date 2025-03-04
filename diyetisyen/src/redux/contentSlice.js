import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

// İçerikleri getir
export const fetchContents = createAsyncThunk(
  'content/fetchContents',
  async () => {
    const querySnapshot = await getDocs(collection(db, 'contents'));
    const contents = {};
    querySnapshot.forEach((doc) => {
      contents[doc.id] = doc.data();
    });
    return contents;
  }
);

// İçerik güncelle
export const updateContent = createAsyncThunk(
  'content/updateContent',
  async ({ id, content }) => {
    await setDoc(doc(db, 'contents', id), content);
    return { id, content };
  }
);

const contentSlice = createSlice({
  name: 'content',
  initialState: {
    contents: {},
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchContents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.contents = action.payload;
      })
      .addCase(fetchContents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateContent.fulfilled, (state, action) => {
        state.contents[action.payload.id] = action.payload.content;
      });
  }
});

export default contentSlice.reducer; 