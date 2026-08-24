import { useOutletContext, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  PhoneIcon,
  ChatBubbleLeftIcon,
  DocumentTextIcon,
  LockClosedIcon,
  UserIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

import PageHeader from "../shared/PageHeader";
import SectionCard from "./SectionCard";
import CvUploader from "./CvUploader";
import { Field, TextInput, TextArea } from "./FormControls";
import { userService } from "../../../services/userService";

const Information = () => {
  const {
    telefono,
    setTelefono,
    presentacion,
    setPresentacion,
    cvArchivo,
    setCvArchivo,
    errors,
    clearError,
    isDirty,
    isLoading,
    successMessage,
    generalError,
    handleGuardar,
    handleDescartar,
  } = useOutletContext();

  const navigate = useNavigate();
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestError, setRequestError] = useState("");

  // Leemos nombre y correo del localStorage — son solo lectura
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleSolicitarCambio = async () => {
    setRequestLoading(true);
    setRequestError("");
    try {
      await userService.requestPasswordChange();
      navigate("/cambiar-contrasena");
    } catch (error) {
      setRequestError(error.message);
    } finally {
      setRequestLoading(false);
    }
  };

  return (
    <div className="w-full pt-2">
      <PageHeader
        title="Mi Perfil"
        description="Gestiona tu información personal y profesional para aplicar a mejores oportunidades."
        isDirty={isDirty}
      />

      <form onSubmit={handleGuardar} className="space-y-6">
        {/* ── DOS COLUMNAS ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-1 lg:grid-cols-2 lg:gap-6 items-start">
          {/* COLUMNA IZQUIERDA — Datos personales */}
          <div className="flex flex-col">
            <SectionCard icon={UserIcon} title="Datos personales" tone="blue">
              <div className="flex flex-col gap-4">
                {/* Nombre — solo lectura */}
                <Field label="Nombre completo">
                  <TextInput
                    value={user.nombre_completo || ""}
                    readOnly
                    focusColor="#123498"
                    className="bg-gray-50 cursor-not-allowed"
                    aria-label="Nombre completo (solo lectura)"
                  />
                </Field>

                {/* Correo — solo lectura */}
                <Field label="Correo electrónico">
                  <TextInput
                    type="email"
                    value={user.correo || ""}
                    readOnly
                    focusColor="#123498"
                    className="bg-gray-50 cursor-not-allowed"
                    aria-label="Correo electrónico (solo lectura)"
                  />
                </Field>

                {/* Teléfono — editable */}
                <Field
                  label="Número de teléfono"
                  hint={
                    !errors.telefono
                      ? "Usaremos este número para contactarte sobre postulaciones activas."
                      : undefined
                  }
                >
                  <TextInput
                    inputMode="tel"
                    placeholder="999 999 999"
                    value={telefono}
                    onChange={(e) => {
                      setTelefono(e.target.value);
                      clearError("telefono");
                    }}
                    focusColor={errors.telefono ? "#ef4444" : "#123498"}
                    aria-label="Número de teléfono"
                  />
                  {errors.telefono && (
                    <p className="mt-2 text-xs text-red-500">
                      {errors.telefono}
                    </p>
                  )}
                </Field>
              </div>
            </SectionCard>

            {/* Seguridad */}
            <SectionCard icon={LockClosedIcon} title="Seguridad" tone="red">
              <div className="flex flex-col gap-3">
                <p className="text-sm text-[#6b7a9f]">
                  Cambia tu contraseña por código de verificación.
                </p>
                {requestError && (
                  <p className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                    {requestError}
                  </p>
                )}
                <button
                  type="button"
                  aria-label="Cambiar contraseña"
                  onClick={handleSolicitarCambio}
                  disabled={requestLoading}
                  className="self-start rounded-xl border-[1.5px] border-rojo-persa px-5 py-2.5 text-sm font-semibold text-rojo-persa transition hover:bg-rojo-persa/10 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {requestLoading ? "Enviando código..." : "Cambiar contraseña"}
                </button>
              </div>
            </SectionCard>
          </div>

          {/* COLUMNA DERECHA — Datos de postulante */}
          <div className="flex flex-col gap-6">
            <SectionCard
              icon={DocumentTextIcon}
              title="Datos de postulante"
              tone="orange"
            >
              <div className="flex flex-col gap-6">
                {/* CV */}
                <Field label="Currículum (CV)">
                  <CvUploader
                    file={cvArchivo}
                    onFileSelect={(file) => setCvArchivo(file)}
                    onRemove={() => setCvArchivo(null)}
                    aria-label="Subir o eliminar currículum vitae (CV)"
                  />
                </Field>

                {/* Presentación */}
                <Field
                  label="Presentación personal"
                  hint={
                    !errors.presentacion ? "Máximo 500 caracteres" : undefined
                  }
                  hintAlign="right"
                >
                  <TextArea
                    maxLength={500}
                    aria-label="Presentación personal"
                    placeholder="Cuéntanos sobre tu experiencia, logros clave y qué buscas en tu próximo desafío profesional..."
                    value={presentacion}
                    onChange={(e) => {
                      setPresentacion(e.target.value);
                      clearError("presentacion");
                    }}
                    focusColor={errors.presentacion ? "#ef4444" : "#41C4C0"}
                  />
                  {errors.presentacion && (
                    <p className="mt-2 text-xs text-red-500">
                      {errors.presentacion}
                    </p>
                  )}
                </Field>
              </div>
            </SectionCard>
          </div>
        </div>
        {/* ─────────────────────────────────────────────────────── */}

        {/* Mensajes de feedback */}
        {generalError && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-200">
            {generalError}
          </p>
        )}
        {successMessage && (
          <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 border border-green-200">
            {successMessage}
          </p>
        )}

        {/* Botones */}
        <div className="flex justify-end gap-3 pb-16">
          <button
            type="button"
            aria-label="Descartar cambios"
            onClick={handleDescartar}
            className="rounded-xl border-[1.5px] border-[#cdd6ea] bg-white px-5.5 py-3 text-sm font-semibold text-[#123498] transition hover:bg-[#f2f5fc]"
          >
            Descartar cambios
          </button>
          <button
            type="submit"
            aria-label="Guardar cambios"
            disabled={isLoading}
            className="rounded-xl bg-[#f46f0b] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#d65f09] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Information;
