import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './style.css';
import './swiperStyles.css';

// Import Swiper styles
import 'swiper/css';

// Import Swiper styles
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import BookDetailsPage from "./BookDetailsPage";
import SearchPage from "./SearchPage";
import AddBookPage from "./AddBookPage";

export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element = {<HomePage />} />
        <Route path="/login" element = {<LoginPage />} />
        <Route path="/register" element = {<RegisterPage />} />
        <Route path="/book/:id" element= {<BookDetailsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/addbook" element={<AddBookPage />} />
      </Routes>
    </Router>
  );
}
