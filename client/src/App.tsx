import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import HookPage from './pages/HookPage';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import LensHub from './pages/LensHub';
import LensFiat from './pages/LensFiat';
import LensTHM from './pages/LensTHM';
import LensInvesting from './pages/LensInvesting';
import LensAdoption from './pages/LensAdoption';
import LearnAct from './pages/LearnAct';
import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';

function RedirectLegacyAct() {
  const { n } = useParams<{ n: string }>();
  return <Navigate to={`/lens/fiat/act/${n ?? '1'}`} replace />;
}

function PublicLayout() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/"                              element={<HookPage />} />
        <Route path="/dashboard"                     element={<Dashboard />} />
        <Route path="/about"                         element={<About />} />
        <Route path="/contact"                       element={<Contact />} />

        {/* The Lens */}
        <Route path="/lens"                          element={<LensHub />} />
        <Route path="/lens/fiat"                     element={<LensFiat />} />
        <Route path="/lens/fiat/act/:n"              element={<LearnAct />} />
        <Route path="/lens/thm"                      element={<LensTHM />} />
        <Route path="/lens/investing"                element={<LensInvesting />} />
        <Route path="/lens/adoption"                 element={<LensAdoption />} />

        {/* Legacy redirects */}
        <Route path="/learn"                         element={<Navigate to="/lens" replace />} />
        <Route path="/learn/thm"                     element={<Navigate to="/lens/thm" replace />} />
        <Route path="/learn/sound-money"             element={<Navigate to="/lens/fiat" replace />} />
        <Route path="/learn/sound-money/act/:n"      element={<RedirectLegacyAct />} />
        <Route path="/learn/act/:n"                  element={<RedirectLegacyAct />} />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/admin/login"  element={<AdminLogin />} />
      <Route path="/admin"        element={<Admin />} />
      <Route path="/*"            element={<PublicLayout />} />
    </Routes>
  );
}
