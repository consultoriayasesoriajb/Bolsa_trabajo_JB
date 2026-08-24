import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation, Link, useParams } from "react-router-dom";
import { vacantesService } from "../services/vacantesService";
import { authService } from "../services/authService";
import { favoritosService } from "../services/favoritosService";
import FiltrosVacantes from "../components/buscador/FiltrosVacantes";
import ListaVacantes from "../components/buscador/ListaVacantes";
import PanelDetalle from "../components/buscador/PanelDetalle";
import { BriefcaseIcon } from "@heroicons/react/24/outline";

const ITEMS_POR_PAGINA = 15;

const FILTROS_INICIALES = {
  cargo: "",
  ubicacion: "",
  fecha_rango: "",
  tipo_contrato: "",
  modalidad: "",
};

export default function Buscador() {
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams();

  const [user, setUser] = useState(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const filtersRef = useRef(null);
  const listRef = useRef(null);
  const [filtersHeight, setFiltersHeight] = useState(0);

  const [vacantes, setVacantes] = useState([]);
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [seleccionadaId, setSeleccionadaId] = useState(null);
  const [vacanteDetalle, setVacanteDetalle] = useState(null);
  const [panelEstado, setPanelEstado] = useState("empty");
  const [listaLoading, setListaLoading] = useState(false);
  const [listaError, setListaError] = useState("");
  const [postulando, setPostulando] = useState(false);
  const [mensajePostulacion, setMensajePostulacion] = useState("");
  const [postulacionStep, setPostulacionStep] = useState(null);
  const [respuestasFiltro, setRespuestasFiltro] = useState({});
  const [guardados, setGuardados] = useState(new Set());
  const [vacantesPostuladas, setVacantesPostuladas] = useState([]);
  const [pagina, setPagina] = useState(0);

  const cargarLista = useCallback(async (filtrosActuales) => {
    setListaLoading(true);
    setListaError("");
    try {
      const data = await vacantesService.listar(filtrosActuales);
      setVacantes(data);
      return data[0]?.id ?? null;
    } catch (e) {
      setListaError(e.message || "Error al cargar vacantes");
      return null;
    } finally {
      setListaLoading(false);
    }
  }, []);

  useEffect(() => {
    if (slug) {
      handleSelect(slug);
      cargarLista(FILTROS_INICIALES);
    } else {
      // Compatibilidad con query param ?vacante=id
      const params = new URLSearchParams(location.search);
      const vacanteId = params.get("vacante");
      if (vacanteId) {
        handleSelect(vacanteId);
        cargarLista(FILTROS_INICIALES);
      } else {
        cargarLista(FILTROS_INICIALES).then((primerId) => {
          if (primerId) handleSelect(primerId);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPagina(0);
  }, [vacantes.length]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    vacantesService
      .misPostulaciones()
      .then((ids) => setVacantesPostuladas(ids.map(String)))
      .catch(() => {});
    favoritosService
      .listar()
      .then((favs) => setGuardados(new Set(favs.map((f) => f.oferta_id))))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    else setUser(null);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const el = filtersRef.current;
    if (!el) return;
    const update = () => setFiltersHeight(el.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mensajePostulacion) return;
    const timer = setTimeout(() => setMensajePostulacion(""), 4000);
    return () => clearTimeout(timer);
  }, [mensajePostulacion]);

  useEffect(() => {
    if (vacanteDetalle && panelEstado === "detail") {
      document.title = `${vacanteDetalle.titulo} | ${vacanteDetalle.empresa_nombre} | Bolsa de Trabajo JB`;
      let meta = document.querySelector('meta[name="keywords"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "keywords";
        document.head.appendChild(meta);
      }
      const keywords = [
        vacanteDetalle.titulo,
        vacanteDetalle.categoria_nombre,
        vacanteDetalle.empresa_nombre,
        vacanteDetalle.ubicacion,
        "empleo",
        "trabajo",
        "Perú",
      ]
        .filter(Boolean)
        .join(", ");
      meta.content = keywords;
    }
  }, [vacanteDetalle, panelEstado]);

  const totalPaginas = Math.ceil(vacantes.length / ITEMS_POR_PAGINA);
  const inicio = pagina * ITEMS_POR_PAGINA;
  const visibles = vacantes.slice(inicio, inicio + ITEMS_POR_PAGINA);

  // Cambia de página y sube al inicio del listado
  const irAPagina = useCallback((nuevaPagina) => {
    setPagina(nuevaPagina);
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleFilterChange = useCallback(
    async (nuevosFiltros) => {
      setFiltros(nuevosFiltros);
      await cargarLista(nuevosFiltros);
    },
    [cargarLista],
  );

  const handleSelect = useCallback(async (idOrSlug) => {
    setPanelEstado("loading");
    setVacanteDetalle(null);
    setMensajePostulacion("");
    setPostulacionStep(null);
    setRespuestasFiltro({});

    try {
      const data = await vacantesService.detalle(idOrSlug);
      setSeleccionadaId(String(data.id));
      setVacanteDetalle(data);
      setPanelEstado("detail");
      
      // Actualizar la URL con el slug si es posible, sin añadir al historial
      if (data.slug) {
        navigate(`/buscar-empleo/${data.slug}`, { replace: true });
      }
    } catch {
      setPanelEstado("error");
      setVacanteDetalle(null);
    }
  }, [navigate]);

  const handleVolver = useCallback(() => {
    setSeleccionadaId(null);
    setVacanteDetalle(null);
    setPanelEstado("empty");
    setPostulacionStep(null);
    setRespuestasFiltro({});
    navigate("/buscar-empleo", { replace: true });
  }, [navigate]);

  const handleGuardar = useCallback(
    async (id) => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const resultado = await favoritosService.toggle(id);
        setGuardados((prev) => {
          const next = new Set(prev);
          if (resultado.es_favorito) next.add(id);
          else next.delete(id);
          return next;
        });
      } catch {
        // silenciar error
      }
    },
    [navigate],
  );

  const handleIniciarPostulacion = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    if (!seleccionadaId) return;

    setRespuestasFiltro({});
    setPostulacionStep("preguntas");
  }, [seleccionadaId, navigate]);

  const handlePreguntasCompletadas = useCallback(() => {
    setPostulacionStep("cv");
  }, []);

  const handleVolverAPreguntas = useCallback(() => {
    setPostulacionStep("preguntas");
  }, []);

  const handleCancelarPostulacion = useCallback(() => {
    setPostulacionStep(null);
    setRespuestasFiltro({});
  }, []);

  const handlePostularConCV = useCallback(
    async (cvFile) => {
      if (!seleccionadaId || postulando) return;

      setPostulando(true);
      setMensajePostulacion("");

      try {
        const result = await vacantesService.postular(
          seleccionadaId,
          respuestasFiltro,
          cvFile,
        );
        setMensajePostulacion(result.message);
        setPostulacionStep("exito");
        setRespuestasFiltro({});
        setVacantesPostuladas((prev) =>
          prev.includes(String(seleccionadaId))
            ? prev
            : [...prev, String(seleccionadaId)],
        );
      } catch (err) {
        if (err.message === "Debes iniciar sesión para postularte") {
          navigate("/login");
        } else {
          setMensajePostulacion(err.message || "Error al postularte");
        }
      } finally {
        setPostulando(false);
      }
    },
    [seleccionadaId, respuestasFiltro, postulando, navigate],
  );

  const handleReintentar = useCallback(() => {
    if (seleccionadaId) handleSelect(seleccionadaId);
  }, [seleccionadaId, handleSelect]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsProfileMenuOpen(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClasses =
    "relative inline-block py-1 text-gray-700 font-medium transition-colors hover:text-naranja after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-naranja after:transition-all after:duration-300 hover:after:w-full";

  const mobileCardLinkClasses =
    "flex items-center gap-3 px-4 py-3.5 text-[15px] font-medium text-gray-800 active:bg-gray-50 transition-colors";

  return (
    <div className="min-h-dvh bg-[#F9F9F9] flex flex-col overflow-x-clip font-sans antialiased text-slate-800">
      {mensajePostulacion && (
        <div className="fixed top-4 right-4 z-50 animate-fade-slide">
          <div
            className={`px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium ${
              mensajePostulacion.includes("Error") ||
              mensajePostulacion.includes("error")
                ? "bg-red-50 text-red-600 border border-red-200"
                : "bg-green-50 text-green-700 border border-green-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mensajePostulacion.includes("Error") ||
                mensajePostulacion.includes("error") ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                )}
              </svg>
              {mensajePostulacion}
              <button
                onClick={() => setMensajePostulacion("")}
                className="ml-auto p-0.5 rounded hover:bg-black/5 transition-colors shrink-0 cursor-pointer"
                title="Cerrar"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto w-full p-6 pt-6 flex flex-col">
        <div ref={filtersRef} className="p-5 sticky top-0 z-20 bg-[#F9F9F9]">
          <FiltrosVacantes
            filtros={filtros}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
          <div
            className={`w-full lg:w-[42%] flex flex-col ${
              seleccionadaId ? "hidden lg:flex" : "flex"
            }`}
          >
            <div className="sticky z-10" style={{ top: filtersHeight }}>
              <div className="flex items-center justify-between py-3 bg-[#F9F9F9]">
                <div className="flex items-center gap-2">
                  <BriefcaseIcon
                    className="w-6 h-6 text-naranja shrink-0"
                    strokeWidth={2}
                  />
                  <h2 className="font-heading font-black text-[#123498] tracking-tight uppercase text-lg sm:text-xl">
                    Empleos para ti
                  </h2>
                </div>
                <span className="font-heading font-bold text-azul text-sm sm:text-base">
                  {listaLoading
                    ? "Buscando..."
                    : `${visibles.length} vacante${visibles.length !== 1 ? "s" : ""}`}
                </span>
              </div>
              {/* Degradado inferior: funde el fondo con el contenido sin borde visible */}
              <div className="h-4 bg-linear-to-b from-[#F9F9F9] to-transparent pointer-events-none" />
            </div>
            <aside ref={listRef} className="flex flex-col w-full">
              <ListaVacantes
                vacantes={visibles}
                seleccionadaId={seleccionadaId}
                onSelect={handleSelect}
                loading={listaLoading}
                error={listaError}
                guardados={guardados}
                onGuardar={handleGuardar}
              />

              {totalPaginas > 1 && (
                <div className="flex items-center justify-center gap-2 border-t border-gray-100 px-4 py-3">
                  <button
                    type="button"
                    onClick={() => irAPagina(Math.max(0, pagina - 1))}
                    disabled={pagina === 0}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-default transition-all shadow-sm cursor-pointer"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Anterior
                  </button>

                  {Array.from({ length: totalPaginas }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => irAPagina(i)}
                      className={`w-9 h-9 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                        pagina === i
                          ? "bg-naranja text-white shadow-sm"
                          : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      irAPagina(Math.min(totalPaginas - 1, pagina + 1))
                    }
                    disabled={pagina >= totalPaginas - 1}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-default transition-all shadow-sm cursor-pointer"
                  >
                    Siguiente
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </aside>
          </div>

          <main
            className={`w-full lg:flex-1 bg-white rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.07)] flex flex-col lg:sticky lg:overflow-y-auto lg:self-start mt-5 ${
              seleccionadaId ? "flex" : "hidden lg:flex"
            }`}
            style={{
              top: filtersHeight,
              maxHeight: `calc(100vh - ${filtersHeight}px)`,
            }}
          >
            <PanelDetalle
              estado={panelEstado}
              vacante={vacanteDetalle}
              error={listaError && panelEstado === "error" ? listaError : ""}
              onPostular={handleIniciarPostulacion}
              onReintentar={handleReintentar}
              onVolver={handleVolver}
              postulacionStep={postulacionStep}
              respuestasFiltro={respuestasFiltro}
              setRespuestasFiltro={setRespuestasFiltro}
              onPreguntasCompletadas={handlePreguntasCompletadas}
              onPostularConCV={handlePostularConCV}
              onCancelarPostulacion={handleCancelarPostulacion}
              onVolverAPreguntas={handleVolverAPreguntas}
              postulando={postulando}
              yaPostulada={vacantesPostuladas.includes(seleccionadaId)}
              esGuardada={vacanteDetalle ? guardados.has(vacanteDetalle.id) : false}
              onGuardar={handleGuardar}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
