import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import Learn from './pages/Learn';
import LearnAct from './pages/LearnAct';

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/"            element={<Dashboard />} />
        <Route path="/about"       element={<About />} />
        <Route path="/learn"       element={<Learn />} />
        <Route path="/learn/act/:n" element={<LearnAct />} />
        <Route path="/contact"     element={<Contact />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
