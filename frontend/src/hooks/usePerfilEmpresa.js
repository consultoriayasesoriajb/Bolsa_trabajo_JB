import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { listadoEmpresasService } from "../services/listadoEmpresasService";

const FORM_INICIAL = {
  relacion: "",
  tiempo_relacion: "",
  estrellas: 0,
  texto_positivo: "",
  texto_negativo: "",
  recomendaria: "",
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
        console.log("empresa data:", empresaData),
        console.log("evaluaciones:", empresaData?.evaluaciones),
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
    if (!form.relacion)       newErrors.relacion       = "Selecciona tu relación con la empresa.";
    if (!form.tiempo_relacion) newErrors.tiempo_relacion = "Selecciona el tiempo de tu relación.";
    if (!form.estrellas)      newErrors.estrellas      = "Selecciona una calificación.";
    if (!form.recomendaria)   newErrors.recomendaria   = "Indica si recomendarías esta empresa.";
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

  return {
    empresa, ofertas, isLoading, yaEvaluo,
    pestana, setPestana,
    drawerAbierto, abrirDrawer, cerrarDrawer,
    form, handleChange, errors,
    enviando, exito, handleEnviar,
    irAOferta,
  };
}