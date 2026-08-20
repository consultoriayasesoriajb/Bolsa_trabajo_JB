import { useState, useRef, useEffect, useCallback } from "react";
import { vacantesService } from "../../services/vacantesService";
import BottomSheet from "./BottomSheet";

function ChipFilter({ label, onRemove }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-naranja/10 border border-naranja/30 rounded-lg text-sm text-naranja font-medium transition-all duration-200 animate-chip-in">
      <span>{label}</span>
      <button
        type="button"
        onClick={onRemove}
        className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-naranja/20 transition-colors cursor-pointer shrink-0"
      >
        <svg
          className="w-3 h-3"
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
  );
}

const CIUDADES = [
  "Remoto",
  "Lima, Perú",
  "Arequipa, Perú",
  "Cusco, Perú",
  "Trujillo, Perú",
  "Piura, Perú",
  "Chiclayo, Perú",
  "Huancayo, Perú",
  "Iquitos, Perú",
  "Tacna, Perú",
  "Ica, Perú",
  "Cajamarca, Perú",
  "Pucallpa, Perú",
  "Juliaca, Perú",
  "Ayacucho, Perú",
];

const TIPOS_LABEL = {
  cargo: "Cargos",
  categoria: "Categorías",
  empresa: "Empresas",
};

function agruparSugerencias(lista) {
  const grupos = {};
  lista.forEach((item, i) => {
    item._index = i;
    if (!grupos[item.tipo]) grupos[item.tipo] = [];
    grupos[item.tipo].push(item);
  });
  const orden = ["cargo", "categoria", "empresa"];
  return orden
    .filter((t) => grupos[t])
    .map((t) => ({ tipo: t, label: TIPOS_LABEL[t], items: grupos[t] }));
}

export default function FiltrosVacantes({ filtros, onFilterChange }) {
  const [locales, setLocales] = useState(filtros);

  const [menuAbierto, setMenuAbierto] = useState(false); // Fecha
  const [menuTipoAbierto, setMenuTipoAbierto] = useState(false);
  const [menuModalidadAbierto, setMenuModalidadAbierto] = useState(false);
  const [menuActivo, setMenuActivo] = useState(null);

  const [sugerencias, setSugerencias] = useState([]);
  const [indiceSugerencia, setIndiceSugerencia] = useState(-1);
  const [inputUbicacionFoco, setInputUbicacionFoco] = useState(false);

  const [sugerenciasCargo, setSugerenciasCargo] = useState([]);
  const [indiceSugerenciaCargo, setIndiceSugerenciaCargo] = useState(-1);
  const [inputCargoFoco, setInputCargoFoco] = useState(false);

  const debounceRef = useRef(null);
  const panelRef = useRef(null);

  const [busquedasRecientes, setBusquedasRecientes] = useState([]);
  const [novedades, setNovedades] = useState([]);
  const novedadesCargadasRef = useRef(false);

  useEffect(() => {
    const historial = JSON.parse(
      localStorage.getItem("historial_busqueda_empleos") || "[]",
    );
    setBusquedasRecientes(historial);
  }, []);

  const cargarNovedades = async () => {
    if (novedadesCargadasRef.current) return;
    novedadesCargadasRef.current = true;
    try {
      const data = await vacantesService.listar({ fecha_rango: "7d" });
      // Extraer empresas únicas de las últimas vacantes
      const empresasVistas = new Set();
      const empresasUnicas = [];
      (data || []).forEach((v) => {
        const nombre = v.empresa_nombre || v.empresa || "";
        if (nombre && !empresasVistas.has(nombre)) {
          empresasVistas.add(nombre);
          empresasUnicas.push({
            nombre,
            sector: v.categoria || v.sector || "",
          });
        }
      });
      setNovedades(empresasUnicas.slice(0, 5));
    } catch {
      setNovedades([]);
    }
  };

  const guardarBusquedaReciente = (termino) => {
    if (!termino.trim()) return;
    const nuevoHistorial = [
      termino,
      ...busquedasRecientes.filter(
        (b) => b.toLowerCase() !== termino.toLowerCase(),
      ),
    ].slice(0, 5);
    setBusquedasRecientes(nuevoHistorial);
    localStorage.setItem(
      "historial_busqueda_empleos",
      JSON.stringify(nuevoHistorial),
    );
  };

  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setMenuAbierto(false);
        setMenuTipoAbierto(false);
        setMenuModalidadAbierto(false);
        setInputCargoFoco(false);
        setInputUbicacionFoco(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const buscarSugerencias = useCallback(async (termino) => {
    if (termino.length < 1) {
      setSugerenciasCargo([]);
      return;
    }
    try {
      const res = await vacantesService.sugerencias(termino);
      setSugerenciasCargo(res || []);
    } catch {
      setSugerenciasCargo([]);
    }
  }, []);

  const handleInputChange = (campo, valor) => {
    setLocales((prev) => ({ ...prev, [campo]: valor }));
    if (campo === "cargo") {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      setIndiceSugerenciaCargo(-1);
      if (valor.length >= 1) {
        debounceRef.current = setTimeout(() => buscarSugerencias(valor), 300);
      } else {
        setSugerenciasCargo([]);
      }
    }
  };

  const handleBuscar = () => {
    if (locales.cargo) guardarBusquedaReciente(locales.cargo);
    setInputCargoFoco(false);
    setInputUbicacionFoco(false);
    onFilterChange(locales);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleBuscar();
  };

  const labelFecha = locales.fecha_rango
    ? OPCIONES_FECHA.find((o) => o.value === locales.fecha_rango)?.label
    : "Fecha de publicación";
  const labelTipo = locales.tipo_contrato
    ? OPCIONES_TIPO.find((o) => o.value === locales.tipo_contrato)?.label
    : "Tipo de empleo";
  const labelModalidad = locales.modalidad
    ? OPCIONES_MODALIDAD.find((o) => o.value === locales.modalidad)?.label
    : "Modalidad";

  const tieneFiltros =
    locales.cargo ||
    locales.ubicacion ||
    locales.fecha_rango ||
    locales.tipo_contrato ||
    locales.modalidad;

  return (
    <div className="space-y-4 relative" ref={panelRef}>
      {/* ══════════════════════════════════════════════════════════════ */}
      {/* BARRA DE BÚSQUEDA UNIFICADA (Mobile + Desktop)                 */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-[900px] mx-auto gap-3 md:gap-0 bg-transparent md:bg-white md:border md:border-gray-200 md:rounded-full md:shadow-sm md:p-1.5 transition-all relative z-40">
        {/* ── Campo CARGO ── */}
        <div className="relative flex items-center w-full md:flex-1 min-w-0 bg-white md:bg-transparent border border-gray-200 md:border-none rounded-lg md:rounded-none px-3 md:px-0 md:pl-3">
          <svg
            className="w-5 h-5 text-gray-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Cargo, categoría o empresa"
            value={locales.cargo}
            onChange={(e) => handleInputChange("cargo", e.target.value)}
            onFocus={() => {
              setInputCargoFoco(true);
              setInputUbicacionFoco(false);
              cargarNovedades();
              if (locales.cargo.length >= 1 && sugerenciasCargo.length === 0)
                buscarSugerencias(locales.cargo);
            }}
            onBlur={() => setTimeout(() => setInputCargoFoco(false), 200)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setIndiceSugerenciaCargo((i) =>
                  Math.min(i + 1, sugerenciasCargo.length - 1),
                );
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setIndiceSugerenciaCargo((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter" && indiceSugerenciaCargo >= 0) {
                handleInputChange(
                  "cargo",
                  sugerenciasCargo[indiceSugerenciaCargo].texto,
                );
                guardarBusquedaReciente(
                  sugerenciasCargo[indiceSugerenciaCargo].texto,
                );
                setSugerenciasCargo([]);
                setIndiceSugerenciaCargo(-1);
                setInputCargoFoco(false);
              } else if (e.key === "Enter") handleBuscar();
            }}
            className="w-full pl-2 pr-3 py-3 md:py-2.5 bg-transparent text-sm focus:outline-none"
          />
          {/* Menú Desplegable (Historial + Novedades / Sugerencias) */}
          {inputCargoFoco && (
            <div className="absolute top-full left-0 mt-3.5 w-full md:min-w-[400px] bg-white border border-gray-200 rounded-xl md:rounded-2xl shadow-xl z-50 overflow-hidden">
              {/* ── Historial (input vacío) ── */}
              {locales.cargo.length === 0 && busquedasRecientes.length > 0 && (
                <div className="py-2 border-b border-gray-100">
                  <div className="flex items-center justify-between px-4 py-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Búsquedas recientes
                    </span>
                  </div>
                  {busquedasRecientes.map((termino, i) => (
                    <button
                      key={`h-${i}`}
                      type="button"
                      onMouseDown={() => {
                        handleInputChange("cargo", termino);
                        guardarBusquedaReciente(termino);
                        setInputCargoFoco(false);
                      }}
                      className="w-full flex items-center gap-3 text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      <svg
                        className="w-4 h-4 text-gray-400 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {termino}
                    </button>
                  ))}
                </div>
              )}

              {/* ── Autocompletado del backend ── */}
              {locales.cargo.length > 0 && sugerenciasCargo.length > 0 && (
                <div className="py-2">
                  {agruparSugerencias(sugerenciasCargo).map((grupo) => (
                    <div key={grupo.tipo}>
                      <div className="px-4 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        {grupo.label}
                      </div>
                      {grupo.items.map((item) => (
                        <button
                          key={item.texto + item.tipo}
                          type="button"
                          onMouseDown={() => {
                            handleInputChange("cargo", item.texto);
                            guardarBusquedaReciente(item.texto);
                            setSugerenciasCargo([]);
                            setInputCargoFoco(false);
                          }}
                          className={`w-full flex items-center gap-3 text-left px-4 py-2.5 text-sm cursor-pointer transition-colors ${item._index === indiceSugerenciaCargo ? "bg-orange-50 text-naranja font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                        >
                          <svg
                            className="w-4 h-4 text-gray-400 shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                          {item.texto}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* ── Novedades: empresas con publicaciones recientes ── */}
              {locales.cargo.length === 0 && (
                <div className="py-2">
                  <div className="flex items-center gap-2 px-4 py-2">
                    <svg
                      className="w-3.5 h-3.5 text-naranja"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Novedades
                    </span>
                  </div>

                  {novedades.length > 0 ? (
                    novedades.map((empresa, i) => (
                      <button
                        key={`nov-${i}`}
                        type="button"
                        onMouseDown={() => {
                          handleInputChange("cargo", empresa.nombre);
                          guardarBusquedaReciente(empresa.nombre);
                          setInputCargoFoco(false);
                        }}
                        className="w-full flex items-center gap-3 text-left px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors group"
                      >
                        {/* Avatar con inicial */}
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-naranja/20 to-orange-100 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-naranja">
                            {empresa.nombre.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-800 truncate group-hover:text-naranja transition-colors">
                            {empresa.nombre}
                          </p>
                          {empresa.sector && (
                            <p className="text-xs text-gray-400 truncate">
                              {empresa.sector}
                            </p>
                          )}
                        </div>
                        <span className="text-[10px] text-naranja font-semibold bg-naranja/10 px-1.5 py-0.5 rounded-full shrink-0">
                          Nuevo
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 flex items-center gap-2 text-sm text-gray-400">
                      <svg
                        className="w-4 h-4 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      Escribe para buscar cargos, categorías o empresas
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Separador Desktop */}
        <div className="hidden md:block w-px h-6 bg-gray-200 shrink-0 mx-1" />

        {/* ── Campo LUGAR ── */}
        <div className="relative flex items-center w-full md:w-56 bg-white md:bg-transparent border border-gray-200 md:border-none rounded-lg md:rounded-none px-3 md:px-0 md:pl-2 z-30">
          <svg
            className="w-5 h-5 text-gray-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
            />
            <circle
              cx="12"
              cy="9"
              r="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          <input
            type="text"
            placeholder="Lugar"
            value={locales.ubicacion}
            onChange={(e) => {
              const val = e.target.value;
              handleInputChange("ubicacion", val);
              setSugerencias(
                val.length >= 1
                  ? CIUDADES.filter((c) =>
                      c.toLowerCase().includes(val.toLowerCase()),
                    )
                  : CIUDADES,
              );
              setIndiceSugerencia(-1);
            }}
            onFocus={() => {
              setInputUbicacionFoco(true);
              setInputCargoFoco(false);
              setSugerencias(
                locales.ubicacion.length >= 1
                  ? CIUDADES.filter((c) =>
                      c.toLowerCase().includes(locales.ubicacion.toLowerCase()),
                    )
                  : CIUDADES,
              );
            }}
            onBlur={() => setTimeout(() => setInputUbicacionFoco(false), 200)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setIndiceSugerencia((i) =>
                  Math.min(i + 1, sugerencias.length - 1),
                );
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setIndiceSugerencia((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter" && indiceSugerencia >= 0) {
                handleInputChange("ubicacion", sugerencias[indiceSugerencia]);
                setSugerencias([]);
                setIndiceSugerencia(-1);
                setInputUbicacionFoco(false);
              } else handleKeyDown(e);
            }}
            className="w-full pl-2 pr-3 py-3 md:py-2.5 bg-transparent text-sm focus:outline-none"
          />
          {/* Dropdown Lugar */}
          {inputUbicacionFoco && sugerencias.length > 0 && (
            <div className="absolute top-full left-0 mt-3.5 w-full md:min-w-[260px] bg-white border border-gray-200 rounded-xl md:rounded-2xl shadow-xl z-50 py-2 max-h-64 overflow-y-auto">
              <div className="px-4 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Ubicaciones
              </div>
              {sugerencias.map((ciudad, i) => (
                <button
                  key={ciudad}
                  type="button"
                  onMouseDown={() => {
                    handleInputChange("ubicacion", ciudad);
                    setSugerencias([]);
                    setIndiceSugerencia(-1);
                    setInputUbicacionFoco(false);
                  }}
                  className={`w-full flex items-center gap-3 text-left px-4 py-2.5 text-sm cursor-pointer transition-colors ${i === indiceSugerencia ? "bg-orange-50 text-naranja font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  <svg
                    className="w-4 h-4 text-gray-400 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                    />
                  </svg>
                  {ciudad}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Botón Buscar ── */}
        <button
          type="button"
          onClick={handleBuscar}
          className="w-full md:w-auto bg-naranja hover:bg-orange-600 text-white font-semibold md:font-normal text-sm py-3 md:p-3 rounded-lg md:rounded-full transition-colors flex items-center justify-center shrink-0 shadow-sm md:ml-1 cursor-pointer z-20"
        >
          <span className="md:hidden">Buscar empleos</span>
          <svg
            className="hidden md:block w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
