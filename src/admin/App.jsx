// // App.jsx
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import DashboardLayout from "./layout/DashboardLayout";
// import AddPlayer from "./pages/AddPlayer";
// import AddMember from "./pages/AddMember";
// import Dashboard from "./pages/Dashboard";
// import About from "./pages/About";
// import SMTP_Setup from "./pages/SMTP_Setup";
// import Mails from "./pages/Mails";
// import Blogs from "./pages/Blogs";
// import { ToastContainer } from "react-toastify"; 
// import "react-toastify/dist/ReactToastify.css"; 
// import Slider from "./pages/Slider";
// import NextMatch from "./pages/NextMatch"; 
// import LastMatch from "./pages/LastMatch";
// import EditNextMatch from "./components/NextMatch/EditNextMatch";
// import AddNextMatch from "./components/NextMatch/AddNextMatch";
// import Honors from "./pages/Honors";
// import ContactAdmin from "./pages/Contact";
// import Gallery from "./pages/Gallery";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/admin" element={<Login />} />
//         <Route path="/dashboard" element={<DashboardLayout />}>
//           <Route index element={<Dashboard />} />
//           <Route path="add-player" element={<AddPlayer />} />
//           <Route path="add-member" element={<AddMember />} />
//           <Route path="about" element={<About />} />
//           <Route path="smtp-setup" element={<SMTP_Setup />} />
//           <Route path="blogs" element={<Blogs />} />
//           <Route path="contact" element={<ContactAdmin />} />
//           <Route path="gallery" element={<Gallery />} />



//           <Route path="received-emails" element={<Mails />} />
//           <Route path="homepage/slider" element={<Slider />} />
//           <Route path="homepage/next-match" element={<NextMatch />} />
//           <Route path="homepage/last-match" element={<LastMatch />} />
//           <Route path="homepage/honors" element={<Honors />} />



//           <Route path="homepage/next-match/add" element={<AddNextMatch />} />
//           <Route path="homepage/next-match/edit/:id" element={<EditNextMatch />} />
          
//         </Route>
//       </Routes>
//       <ToastContainer />
//     </Router>
//   );
// }

// export default App;