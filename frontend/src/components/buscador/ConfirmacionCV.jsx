import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { userService } from "../../services/userService";

const BACKEND_BASE = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");

export default function ConfirmacionCV({ onPostular, onAtras, postulando }) {
  const [cvFile, setCvFile] = useState(null);
  const [cvFileName, setCvFileName] = useState("");
  const [errorValidacion, setErrorValidacion] = useState("");

  const [userData, setUserData] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        const res = await userService.getProfile();
        if (res.success && res.data) {
          const { telefono, cv_url } = res.data;
          setUserData((prev) => {
            const updated = { ...prev, telefono, cv_url };
            localStorage.setItem("user", JSON.stringify(updated));
            return updated;
          });
        }
      } catch (error) {
        // Si falla, mantenemos los datos del localStorage
      }
    };
    fetchLatestData();
  }, []);

  const cvUrl = userData?.cv_url || null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCvFile(file);
      setCvFileName(file.name);
    }
  };

  const handleSubmit = () => {
    setErrorValidacion("");
    if (!cvFile && !cvUrl) {
      setErrorValidacion(
        "Debes tener un CV en tu perfil o subir uno nuevo para postularte.",
      );
      return;
    }
    onPostular(cvFile);
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="p-6 space-y-6 flex-1">
        <div className="space-y-1.5">
          <h3 className="font-heading font-black text-[#123498] tracking-tight uppercase text-base">
            Confirma tu CV
          </h3>
          <p className="text-sm font-semibold text-gray-500">
            Revisa tus datos y adjunta tu CV antes de postular
          </p>
        </div>

        {/* Datos del usuario */}
        <div className="flex flex-col">
          <h3 className="font-heading font-black text-[#123498] tracking-tight uppercase text-sm mb-2 mt-2">
            Tus datos
          </h3>
          <div className="pb-3 border-b border-gray-100 flex sm:items-center sm:justify-between flex-col sm:flex-row gap-1 sm:gap-4">
            <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
              Nombre completo:
            </span>
            <span className="text-sm text-gray-800 font-semibold sm:text-right truncate">
              {userData?.nombre_completo || "—"}
            </span>
          </div>
          <div className="py-3 border-b border-gray-100 flex sm:items-center sm:justify-between flex-col sm:flex-row gap-1 sm:gap-4">
            <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
              Correo:
            </span>
            <span className="text-sm text-gray-800 font-semibold sm:text-right truncate">
              {userData?.correo || "—"}
            </span>
          </div>
          <div className="py-3 border-b border-gray-100 flex sm:items-center sm:justify-between flex-col sm:flex-row gap-1 sm:gap-4">
            <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
              Teléfono:
            </span>
            {userData?.telefono ? (
              <span className="text-sm text-gray-800 font-semibold sm:text-right truncate">
                {userData.telefono}
              </span>
            ) : (
              <span className="text-xs text-red-500 font-medium sm:text-right leading-tight">
                No tienes un teléfono registrado,{" "}
                <Link
                  to="/mi-perfil"
                  className="text-azul-marino underline hover:text-[#123498] font-bold"
                >
                  regístralo aquí
                </Link>
              </span>
            )}
          </div>
        </div>

        {/* CV actual */}
        <div className="space-y-3">
          <h3 className="font-heading font-black text-[#123498] tracking-tight uppercase text-sm">
            Currículum Vitae
          </h3>

          {cvUrl ? (
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3">
              <svg
                className="w-6 h-6 text-naranja shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 font-medium truncate">
                  CV actual
                </p>
                <p className="text-xs text-gray-400 truncate">{cvUrl}</p>
              </div>
              <a
                href={`${BACKEND_BASE}/${cvUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-azul-marino hover:underline font-semibold shrink-0"
              >
                Ver CV
              </a>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3">
              <svg
                className="w-6 h-6 text-gray-300 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-sm text-gray-400">No has subido tu CV aún</p>
            </div>
          )}

          {/* Input file */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-500 font-medium">
              {cvUrl ? "¿Deseas reemplazar tu CV?" : "Sube tu CV (PDF)"}
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-naranja/10 file:text-naranja hover:file:bg-naranja/20 file:cursor-pointer cursor-pointer"
            />
            {cvFileName && (
              <p className="text-xs text-green-600 font-medium">
                Archivo seleccionado: {cvFileName}
              </p>
            )}
          </div>
        </div>

        {/* Resumen de postulación */}
        <div className="bg-linear-to-br from-orange-50 to-amber-50/40 border-l-4 border-naranja rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-naranja/10 flex items-center justify-center shrink-0">
              <svg
                className="w-4 h-4 text-naranja"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-sm font-bold text-azul">
              Antes de enviar tu postulación
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2.5">
              <svg
                className="w-4 h-4 text-naranja mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-xs text-gray-600">
                Tu <strong>CV</strong> será enviado junto con tu postulación
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <svg
                className="w-4 h-4 text-naranja mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-xs text-gray-600">
                Tus <strong>respuestas</strong> a las preguntas de filtro serán
                incluidas
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-400 italic border-t border-amber-200/50 pt-2">
            Al hacer clic en "Postular ahora" aceptas compartir esta información
            con el empleador.
          </p>
        </div>
      </div>

      {errorValidacion && (
        <div className="shrink-0 px-6 py-2 bg-red-50 border-t border-red-200">
          <p className="text-xs text-red-600 font-medium flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {errorValidacion}
          </p>
        </div>
      )}
      <div className="shrink-0 px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onAtras}
          disabled={postulando}
          className="rounded-full px-7 py-2.5 text-gray-600 font-semibold text-sm bg-white border border-gray-200 hover:bg-[#f9f9f9] hover:border-gray-300 active:scale-[0.97] transition-all cursor-pointer disabled:opacity-40 disabled:active:scale-100 disabled:cursor-default"
        >
          Atrás
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={postulando}
          className="group relative overflow-hidden rounded-full px-7 py-2.5 text-white font-bold text-base shadow-md hover:shadow-lg active:scale-[0.97] transition-[transform,box-shadow] duration-200 shrink-0 cursor-pointer tracking-wide flex items-center justify-center gap-2 disabled:opacity-60 disabled:active:scale-100 disabled:cursor-default"
          style={{ background: "linear-gradient(to right, #fb923c, #f97316)" }}
        >
          {!postulando && (
            <span
              className="absolute inset-0 translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"
              style={{ backgroundColor: "#f97316" }}
              aria-hidden="true"
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            {postulando ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Postulando...
              </>
            ) : (
              "Postular ahora"
            )}
          </span>
        </button>
      </div>
    </div>
  );
}
