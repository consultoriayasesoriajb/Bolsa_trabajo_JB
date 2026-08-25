import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { usePerfilEmpresa } from "../hooks/usePerfilEmpresa";
import EmpresaInfoPanel from "../components/empresas/perfil/EmpresaInfoPanel";
import EmpresaTabs from "../components/empresas/perfil/EmpresaTabs";
import EmpresaTabOfertas from "../components/empresas/perfil/EmpresaTabOfertas";
import EmpresaTabEvaluaciones from "../components/empresas/perfil/EmpresaTabEvaluaciones";
import FormularioEvaluacion from "../components/empresas/FormularioEvaluacion";
import EmpresaHeader from "../components/empresas/perfil/EmpresaHeader";
import EmpresaBarraFiltros from "../components/empresas/perfil/EmpresaBarraFiltros";

export default function PerfilEmpresa() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const {
    empresa,
    ofertas,
    ofertasFiltradas,
    evaluacionesFiltradas,
    isLoading,
    yaEvaluo,
    pestana,
    setPestana,
    drawerAbierto,
    abrirDrawer,
    cerrarDrawer,
    form,
    handleChange,
    errors,
    enviando,
    exito,
    handleEnviar,
    irAOferta,
    busquedaOfertas,
    setBusquedaOfertas,
    filtroModalidad,
    setFiltroModalidad,
    filtroRelacion,
    setFiltroRelacion,
    filtroEstrellas,
    setFiltroEstrellas,
    limpiarFiltros,
  } = usePerfilEmpresa(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f6fb] flex items-center justify-center text-[#9aa3bd] text-sm">
        Cargando...
      </div>
    );
  }

  if (!empresa) {
    return (
      <div className="min-h-screen bg-[#f4f6fb] flex items-center justify-center text-[#9aa3bd] text-sm">
        Empresa no encontrada.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] font-sans">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Volver */}
        <button
          onClick={() => navigate("/empresas")}
          className="flex items-center gap-2 text-sm text-[#6b7a9f] hover:text-[#123498] transition-colors mb-6 w-fit"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Volver al directorio
        </button>

        <EmpresaHeader empresa={empresa} totalOfertas={ofertas.length} />

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Panel izquierdo */}
          <EmpresaInfoPanel empresa={empresa} />

          {/* Panel derecho */}
          <div className="flex-1 min-w-0 w-full flex flex-col gap-4">
            <EmpresaTabs
              pestana={pestana}
              setPestana={setPestana}
              totalOfertas={ofertas.length}
              totalEvaluaciones={empresa.total_evaluaciones}
              yaEvaluo={yaEvaluo}
              onCalificar={abrirDrawer}
            />

            <EmpresaBarraFiltros
              pestana={pestana}
              busquedaOfertas={busquedaOfertas}
              setBusquedaOfertas={setBusquedaOfertas}
              filtroModalidad={filtroModalidad}
              setFiltroModalidad={setFiltroModalidad}
              filtroRelacion={filtroRelacion}
              setFiltroRelacion={setFiltroRelacion}
              filtroEstrellas={filtroEstrellas}
              setFiltroEstrellas={setFiltroEstrellas}
              limpiarFiltros={limpiarFiltros}
            />

            {pestana === "ofertas" && (
              <EmpresaTabOfertas
                ofertas={ofertasFiltradas}
                onVerEmpleo={irAOferta}
              />
            )}
            {pestana === "evaluaciones" && (
              <EmpresaTabEvaluaciones evaluaciones={evaluacionesFiltradas} />
            )}
          </div>
        </div>
      </div>

      {/* Drawer calificar */}
      {drawerAbierto && (
        <FormularioEvaluacion
          modo="drawer"
          onCerrar={cerrarDrawer}
          empresa={empresa}
          form={form}
          handleChange={handleChange}
          errors={errors}
          enviando={enviando}
          exito={exito}
          handleEnviar={handleEnviar}
        />
      )}
    </div>
  );
}
