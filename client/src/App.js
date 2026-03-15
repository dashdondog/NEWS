import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import NewsDetail from "./pages/NewsDetail";
import CategoryNews from "./pages/CategoryNews";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import CreateNews from "./pages/CreateNews";
import { getCategories } from "./services/api";

function App() {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Load categories
    const fetchCategories = async () => {
      try {
        const { data } = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar user={user} setUser={setUser} categories={categories} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/category/:categoryId" element={<CategoryNews />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/admin" element={<AdminDashboard user={user} />} />
            <Route path="/admin/create" element={<CreateNews user={user} />} />
            <Route path="/admin/edit/:id" element={<CreateNews user={user} />} />
          </Routes>
        </main>
        <Footer categories={categories} />
      </div>
    </Router>
  );
}

export default App;
