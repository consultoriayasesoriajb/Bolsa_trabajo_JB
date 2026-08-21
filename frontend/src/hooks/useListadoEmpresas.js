import { useState, useEffect, useMemo } from "react";
import { listadoEmpresasService } from "../services/listadoEmpresasService";

const POR_PAGINA = 5;

export function useEvaluaciones() {
  const [empresas, setEmpresas]   = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busqueda, setBusqueda]   = useState("");
  const [pagina, setPagina]       = useState(1);

  useEffect(() => {
    const cargar = async () => {
      setIsLoading(true);
      try {
        const data = await listadoEmpresasService.listarEmpresas();
        setEmpresas(data);
      } catch {
        setEmpresas([]);
      } finally {
        setIsLoading(false);
      }
    };
    cargar();
  }, []);

  // Resetear a página 1 cuando cambia la búsqueda
  useEffect(() => {
    setPagina(1);
  }, [busqueda]);

  const empresasFiltradas = useMemo(() => {
    if (!busqueda.trim()) return empresas;
    const q = busqueda.toLowerCase();
    return empresas.filter(e =>
      e.nombre.toLowerCase().includes(q) ||
      (e.sector || "").toLowerCase().includes(q)
    );
  }, [empresas, busqueda]);

  const totalPaginas  = Math.ceil(empresasFiltradas.length / POR_PAGINA);
  const empresasPagina = empresasFiltradas.slice(
    (pagina - 1) * POR_PAGINA,
    pagina * POR_PAGINA
  );

  return {
    empresas: empresasPagina,
    total: empresasFiltradas.length,
    isLoading,
    busqueda, setBusqueda,
    pagina, setPagina,
    totalPaginas,
  };
}