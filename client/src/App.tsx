import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import Learn from './pages/Learn';
import LearnTHM from './pages/LearnTHM';
import LearnSoundMoney from './pages/LearnSoundMoney';
import LearnAct from './pages/LearnAct';

function RedirectLegacyAct() {
  const { n } = useParams<{ n: string }>();
  return <Navigate to={`/learn/sound-money/act/${n ?? '1'}`} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/"                              element={<Dashboard />} />
        <Route path="/about"                         element={<About />} />
        <Route path="/learn"                         element={<Learn />} />
        <Route path="/learn/thm"                     element={<LearnTHM />} />
        <Route path="/learn/sound-money"             element={<LearnSoundMoney />} />
        <Route path="/learn/sound-money/act/:n"      element={<LearnAct />} />
        <Route path="/learn/act/:n"                  element={<RedirectLegacyAct />} />
        <Route path="/contact"                       element={<Contact />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
