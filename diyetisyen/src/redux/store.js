import { configureStore } from '@reduxjs/toolkit';
import blogReducer from './blogSlice';
import contentReducer from './contentSlice';

export const store = configureStore({
  reducer: {
    blog: blogReducer,
    content: contentReducer
  },
});

export default store; 