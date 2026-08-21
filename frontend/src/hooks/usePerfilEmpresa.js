import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { listadoEmpresasService } from "../services/listadoEmpresasService";

const FORM_INICIAL = {
  relacion: "",
  tiempo_relacion: "",
  estrellas: 0,
  texto_positivo: "",
  texto_negativo: "",
  recomendaria: "",
  cat_ambiente: 0,
  cat_beneficios: 0,
  cat_balance: 0,
  cat_crecimiento: 0,
};

export function usePerfilEmpresa(slug) {
  const navigate = useNavigate();

  const [empresa,   setEmpresa]   = useState(null);
  const [ofertas,   setOfertas]   = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [yaEvaluo,  setYaEvaluo]  = useState(false);
  const [pestana,   setPestana]   = useState("ofertas"); // "ofertas" | "evaluaciones"
  const [drawerAbierto, setDrawerAbierto] = useState(false);

  // Formulario de evaluación
  const [form,     setForm]     = useState(FORM_INICIAL);
  const [errors,   setErrors]   = useState({});
  const [enviando, setEnviando] = useState(false);
  const [exito,    setExito]    = useState(false);

  //filtros de búsqueda
  const [busquedaOfertas,      setBusquedaOfertas]      = useState("");
  const [filtroModalidad,      setFiltroModalidad]      = useState("");
  const [filtroRelacion,       setFiltroRelacion]       = useState("");
  const [filtroEstrellas,      setFiltroEstrellas]      = useState("");

  useEffect(() => {
    if (!slug) return;
    const cargar = async () => {
      setIsLoading(true);
      try {
        const [empresaData, ofertasData, evalData] = await Promise.all([
          listadoEmpresasService.detalle(slug),
          listadoEmpresasService.ofertasEmpresa(slug),
          localStorage.getItem("token")
            ? listadoEmpresasService.yaEvaluo(slug)
            : Promise.resolve({ ya_evaluo: false }),
        ]);
        setEmpresa(empresaData);
        setOfertas(ofertasData || []);
        setYaEvaluo(evalData.ya_evaluo);
      } catch {
        setEmpresa(null);
      } finally {
        setIsLoading(false);
      }
    };
    cargar();
  }, [slug]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.relacion)        newErrors.relacion        = "Selecciona tu relación con la empresa.";
    if (!form.tiempo_relacion) newErrors.tiempo_relacion = "Selecciona el tiempo de tu relación.";
    if (!form.estrellas)       newErrors.estrellas       = "Selecciona una calificación general.";
    if (!form.recomendaria)    newErrors.recomendaria    = "Indica si recomendarías esta empresa.";
    // Categorías obligatorias
    if (!form.cat_ambiente)    newErrors.cat_ambiente    = "Califica el ambiente laboral.";
    if (!form.cat_beneficios)  newErrors.cat_beneficios  = "Califica los beneficios.";
    if (!form.cat_balance)     newErrors.cat_balance     = "Califica el balance de vida.";
    if (!form.cat_crecimiento) newErrors.cat_crecimiento = "Califica las oportunidades de crecimiento.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEnviar = async () => {
    if (!validateForm()) return;
    setEnviando(true);
    try {
      await listadoEmpresasService.crear({ ...form, empresa_id: empresa.id });
      setExito(true);
      setYaEvaluo(true);
      // Recargar datos de la empresa para actualizar promedio
      const data = await listadoEmpresasService.detalle(slug);
      setEmpresa(data);
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setEnviando(false);
    }
  };

  const abrirDrawer = () => {
    setForm(FORM_INICIAL);
    setErrors({});
    setExito(false);
    setDrawerAbierto(true);
  };

  const cerrarDrawer = () => setDrawerAbierto(false);

  const irAOferta = (ofertaId) => {
    navigate(`/buscar-empleo?vacante=${ofertaId}`);
  };

  // Ofertas filtradas
  const ofertasFiltradas = useMemo(() => {
    return ofertas.filter(o => {
      const matchBusqueda = !busquedaOfertas ||
        o.titulo.toLowerCase().includes(busquedaOfertas.toLowerCase()) ||
        (o.ubicacion || "").toLowerCase().includes(busquedaOfertas.toLowerCase());
      const matchModalidad = !filtroModalidad || o.modalidad === filtroModalidad;
      return matchBusqueda && matchModalidad;
    });
  }, [ofertas, busquedaOfertas, filtroModalidad]);

  // Evaluaciones filtradas
  const evaluacionesFiltradas = useMemo(() => {
    return (empresa?.evaluaciones || []).filter(ev => {
      const matchRelacion  = !filtroRelacion  || ev.relacion === filtroRelacion;
      const matchEstrellas = !filtroEstrellas || ev.estrellas === Number(filtroEstrellas);
      return matchRelacion && matchEstrellas;
    });
  }, [empresa, filtroRelacion, filtroEstrellas]);

  const limpiarFiltros = () => {
    setBusquedaOfertas("");
    setFiltroModalidad("");
    setFiltroRelacion("");
    setFiltroEstrellas("");
  };


  return {
    empresa, ofertas, isLoading, yaEvaluo,
    pestana, setPestana,
    drawerAbierto, abrirDrawer, cerrarDrawer,
    form, handleChange, errors,
    enviando, exito, handleEnviar,
    irAOferta, ofertasFiltradas, evaluacionesFiltradas,
    busquedaOfertas, setBusquedaOfertas, filtroModalidad, setFiltroModalidad,
    filtroRelacion, setFiltroRelacion, filtroEstrellas, setFiltroEstrellas, limpiarFiltros,
  };
}