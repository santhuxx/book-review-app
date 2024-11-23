import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Home1 from "./pages/Home1"; 
import Home2 from "./pages/Home2";
import MyReview from "./pages/MyReviews";
import BookDetail from "./pages/BookDetail";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home1 />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Signin" element={<Signin />} />
        <Route path="/Home2" element={<Home2 />} />
        <Route path="/MyReview" element={<MyReview />} />
        <Route path="/book/:bookTitle" element={<BookDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
