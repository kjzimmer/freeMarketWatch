import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import LensHub from './pages/LensHub';
import LensFiat from './pages/LensFiat';
import LensTHM from './pages/LensTHM';
import LensInvesting from './pages/LensInvesting';
import LearnAct from './pages/LearnAct';

function RedirectLegacyAct() {
  const { n } = useParams<{ n: string }>();
  return <Navigate to={`/lens/fiat/act/${n ?? '1'}`} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/"                              element={<Dashboard />} />
        <Route path="/about"                         element={<About />} />
        <Route path="/contact"                       element={<Contact />} />

        {/* The Lens */}
        <Route path="/lens"                          element={<LensHub />} />
        <Route path="/lens/fiat"                     element={<LensFiat />} />
        <Route path="/lens/fiat/act/:n"              element={<LearnAct />} />
        <Route path="/lens/thm"                      element={<LensTHM />} />
        <Route path="/lens/investing"                element={<LensInvesting />} />

        {/* Legacy redirects */}
        <Route path="/learn"                         element={<Navigate to="/lens" replace />} />
        <Route path="/learn/thm"                     element={<Navigate to="/lens/thm" replace />} />
        <Route path="/learn/sound-money"             element={<Navigate to="/lens/fiat" replace />} />
        <Route path="/learn/sound-money/act/:n"      element={<RedirectLegacyAct />} />
        <Route path="/learn/act/:n"                  element={<RedirectLegacyAct />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
