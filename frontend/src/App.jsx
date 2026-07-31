import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

// ── Imports directos (no lazy) — solo los que se necesitan siempre ──
import Header from "./components/layout/Header";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ScrollToTop from "./components/layout/ScrollToTop";

// ── Lazy: se cargan solo cuando el usuario navega a esa ruta ────────
const Home = lazy(() => import("./pages/Home"));
const Buscador = lazy(() => import("./pages/Buscador"));
const Login = lazy(() => import("./pages/Login"));
const Profile = lazy(() => import("./pages/Profile"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));
const CuentaValidada = lazy(() => import("./pages/CuentaValidada"));
const RevisaCorreo = lazy(() => import("./pages/RevisaCorreo"));
const Admin = lazy(() => import("./pages/Admin"));
const Information = lazy(
  () => import("./components/profile/Information/Information"),
);
const Applications = lazy(
  () => import("./components/profile/Application/Applications"),
);
const FavoriteApplications = lazy(
  () => import("./components/profile/FavoriteApplication/FavoriteApplications"),
);
const Evaluaciones = lazy(() => import("./pages/Evaluaciones"));
const EmpresaDetalle = lazy(() => import("./pages/EmpresaDetalle"));
const OlvideContrasena = lazy(() => import("./pages/OlvideContrasena"));

//legal
const TerminosCondiciones = lazy(() => import("./pages/legales/TerminosCondiciones"));
const PoliticaPrivacidad = lazy(() => import("./pages/legales/PoliticaPrivacidad"));
const AvisoLegal = lazy(() => import("./pages/legales/AvisoLegal"));
const LibroReclamaciones = lazy(() => import("./pages/legales/LibroReclamaciones"));


// ── Fallback de carga ────────────────────────────────────────────────
const Loading = () => (
  <div className="flex min-h-screen items-center justify-center text-[#6b7a9f] text-sm">
    Cargando...
  </div>
);

const GOOGLE_CLIENT_ID =
  "102292791934-vdo8ihbfaqrkmvsp91r1druc46pes4ho.apps.googleusercontent.com";

function MainLayout() {
  const location = useLocation();
  return (
    <>
      <Header />
      <main id="main-content" className="bg-slate-50">
        <Outlet />
      </main>
    </>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <ScrollToTop />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Admin />
                </ProtectedRoute>
              }
            />

            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/buscar-empleo" element={<Buscador />} />
              <Route path="/mi-perfil" element={<Profile />}>
                <Route index element={<Information />} />
                <Route path="postulaciones" element={<Applications />} />
                <Route path="favoritos" element={<FavoriteApplications />} />
              </Route>
              <Route path="/evaluaciones" element={<Evaluaciones />} />
              <Route path="/evaluaciones/:id" element={<EmpresaDetalle />} />
            </Route>

            <Route
              path="/login"
              element={
                <main className="min-h-screen bg-slate-50">
                  <Login />
                </main>
              }
            />

            <Route
              path="/cambiar-contrasena"
              element={
                <main className="min-h-screen bg-[#f4f6fb]">
                  <ChangePassword />
                </main>
              }
            />

            <Route path="/cuenta-validada" element={<CuentaValidada />} />
            <Route path="/revisa-tu-correo" element={<RevisaCorreo />} />

            <Route path="/olvide-contrasena"      
              element={
                <main className="min-h-screen bg-[#f4f6fb]">
                  <OlvideContrasena />
                </main>
              }   
            />

            <Route path="/terminos-condiciones" 
              element={
                <main className="min-h-screen">
                  <TerminosCondiciones />
                </main>
              }
            />
            <Route path="/politica-privacidad"
              element={
                <main className="min-h-screen">
                  <PoliticaPrivacidad />
                </main>
              }
            />
            <Route path="/aviso-legal"
              element={
                <main className="min-h-screen">
                  <AvisoLegal />
                </main>
              }
            />
            <Route path="/libro-reclamaciones"
              element={
                <main className="min-h-screen">
                  <LibroReclamaciones />
                </main>
              }
            />

          </Routes>
        </Suspense>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
