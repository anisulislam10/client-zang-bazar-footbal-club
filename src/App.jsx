import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Players from "./pages/Players";
import Members from "./pages/Members";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";

import Login from "./admin/pages/Login";
import DashboardLayout from "./admin/layout/DashboardLayout";
import Dashboard from "./admin/pages/Dashboard";
import AddPlayer from "./admin/pages/AddPlayer";
import AddMember from "./admin/pages/AddMember";
import AboutAdmin from "./admin/pages/About";
import SMTP_Setup from "./admin/pages/SMTP_Setup";
import Blogs from "./admin/pages/Blogs";
import ContactAdmin from "./admin/pages/Contact";
import ImageGallery from "./admin/pages/Gallery";

// Missing imports added here
import Mails from "./admin/pages/Mails";
import Slider from "./admin/pages/Slider";
import NextMatch from "./admin/pages/NextMatch";
import LastMatch from "./admin/pages/LastMatch";
import Honors from "./admin/pages/Honors";
import AddNextMatch from "./admin/components/NextMatch/AddNextMatch";
import EditNextMatch from "./admin/pages/../components/NextMatch/EditNextMatch";
import MemberDetails from "./pages/MemberDetails";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/players" element={<Players />} />
        <Route path="/members" element={<Members />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:slug" element={<NewsDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/member/:slug" element={<MemberDetails />} />


        {/* Admin Login Route */}
        <Route path="/admin" element={<Login />} />

        {/* Admin Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-player" element={<AddPlayer />} />
          <Route path="add-member" element={<AddMember />} />
          <Route path="about" element={<AboutAdmin />} />
          <Route path="smtp-setup" element={<SMTP_Setup />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="contact" element={<ContactAdmin />} />
          <Route path="gallery" element={<ImageGallery />} />
          <Route path="received-emails" element={<Mails />} />
          <Route path="homepage/slider" element={<Slider />} />
          <Route path="homepage/next-match" element={<NextMatch />} />
          <Route path="homepage/last-match" element={<LastMatch />} />
          <Route path="homepage/honors" element={<Honors />} />
          <Route path="homepage/next-match/add" element={<AddNextMatch />} />
          <Route path="homepage/next-match/edit/:id" element={<EditNextMatch />} />
        </Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
