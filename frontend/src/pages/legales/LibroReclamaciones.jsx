import { Link } from "react-router-dom";
import { ArrowLeftIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useLibroReclamaciones } from "../../hooks/useLibroReclamaciones";


const inputCls = (err) =>
  `w-full px-4 py-2.5 text-sm rounded-xl border ${
    err ? "border-red-400 focus:ring-red-400" : "border-slate-200 focus:border-[#123498]"
  } focus:outline-none focus:ring-2 focus:ring-[#123498]/20 bg-white transition`;

const labelCls = "text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1 block";

const TIPOS_DOC    = ["DNI", "CE", "Pasaporte"];
const TIPOS_RECLAMO = ["Reclamacion", "Queja"];
const TIPOS_CONSUMO = ["Producto", "Servicio"];

function FieldError({ msg }) {
  return msg ? <p className="mt-1 text-xs text-red-500">{msg}</p> : null;
}

export default function LibroReclamaciones() {
  const {
    form, handleChange, errors,
    departamentos, provincias, distritos,
    enviando, exito, handleSubmit,
  } = useLibroReclamaciones();

  if (exito) {
    return (
      <div className="min-h-screen bg-[#f4f6fb] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 max-w-md w-full text-center flex flex-col items-center gap-5">
          <CheckCircleIcon className="w-16 h-16 text-green-500" />
          <h2 className="text-2xl font-black text-[#123498] font-heading">
            Reclamo enviado
          </h2>
          <p className="text-sm text-[#6b7a9f] leading-relaxed">
            Tu reclamo ha sido registrado correctamente. Tu número de reclamo es:
          </p>
          <div className="bg-[#123498]/5 border border-[#123498]/20 rounded-xl px-8 py-4">
            <span className="text-3xl font-black text-[#123498] tracking-widest">
              #{exito.numero}
            </span>
          </div>
          <p className="text-xs text-[#9aa3bd]">
            Guarda este número para hacer seguimiento de tu reclamo.
          </p>
          <Link
            to="/"
            className="mt-2 bg-[#123498] hover:bg-[#0f2a80] text-white text-sm font-black px-6 py-3 rounded-xl transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6fb] font-sans">

      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-6 px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#6b7a9f] hover:text-[#123498] text-sm font-semibold mb-4 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Volver al inicio
          </Link>
          <div className="flex items-center gap-5">
            <div className="shrink-0 w-16 h-16 bg-[#123498] rounded-2xl flex items-center justify-center">
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-[#F46F0B] mb-1">
                Consultora de Asesoría Empresarial JB
              </p>
              <h1 className="text-3xl font-black text-[#123498] font-heading uppercase">
                Libro de Reclamaciones
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8" noValidate>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {errors.general}
          </div>
        )}

        {/* ── SECCIÓN 1: CONSUMIDOR ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-1 h-6 bg-[#F46F0B] rounded-full" />
            <h2 className="text-base font-black text-[#1c2a52]">
              Identificación del consumidor reclamante
            </h2>
          </div>

          {/* Nombre / Apellidos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { field: "nombre",           label: "Nombre *",           placeholder: "Nombre" },
              { field: "primer_apellido",  label: "Primer Apellido *",  placeholder: "Primer apellido" },
              { field: "segundo_apellido", label: "Segundo Apellido *", placeholder: "Segundo apellido" },
            ].map(({ field, label, placeholder }) => (
              <div key={field} data-error={errors[field] ? true : undefined}>
                <label className={labelCls}>{label}</label>
                <input
                  type="text" value={form[field]} placeholder={placeholder}
                  onChange={e => handleChange(field, e.target.value)}
                  className={inputCls(errors[field])}
                />
                <FieldError msg={errors[field]} />
              </div>
            ))}
          </div>

          {/* Documento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div data-error={errors.tipo_documento ? true : undefined}>
              <label className={labelCls}>Tipo de Documentación *</label>
              <select value={form.tipo_documento} onChange={e => handleChange("tipo_documento", e.target.value)} className={inputCls(errors.tipo_documento)}>
                <option value="">Selección de documentación</option>
                {TIPOS_DOC.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <FieldError msg={errors.tipo_documento} />
            </div>
            <div data-error={errors.numero_documento ? true : undefined}>
              <label className={labelCls}>Número de Documentación *</label>
              <input type="text" value={form.numero_documento} placeholder="Número de documentación" onChange={e => handleChange("numero_documento", e.target.value)} className={inputCls(errors.numero_documento)} />
              <FieldError msg={errors.numero_documento} />
            </div>
          </div>

          {/* Celular / Correo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div data-error={errors.celular ? true : undefined}>
              <label className={labelCls}>Celular *</label>
              <input type="tel" value={form.celular} placeholder="Celular" onChange={e => handleChange("celular", e.target.value)} className={inputCls(errors.celular)} />
              <FieldError msg={errors.celular} />
            </div>
            <div data-error={errors.correo ? true : undefined}>
              <label className={labelCls}>Correo Electrónico *</label>
              <input type="email" value={form.correo} placeholder="Correo electrónico" onChange={e => handleChange("correo", e.target.value)} className={inputCls(errors.correo)} />
              <FieldError msg={errors.correo} />
            </div>
          </div>

          {/* Ubigeo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div data-error={errors.departamento ? true : undefined}>
              <label className={labelCls}>Departamento *</label>
              <select value={form.departamento} onChange={e => handleChange("departamento", e.target.value)} className={inputCls(errors.departamento)}>
                <option value="">Seleccionar departamento</option>
                {departamentos.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <FieldError msg={errors.departamento} />
            </div>
            <div data-error={errors.provincia ? true : undefined}>
              <label className={labelCls}>Provincia *</label>
              <select value={form.provincia} onChange={e => handleChange("provincia", e.target.value)} className={inputCls(errors.provincia)} disabled={!form.departamento}>
                <option value="">Seleccionar provincia</option>
                {provincias.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <FieldError msg={errors.provincia} />
            </div>
            <div data-error={errors.distrito ? true : undefined}>
              <label className={labelCls}>Distrito *</label>
              <select value={form.distrito} onChange={e => handleChange("distrito", e.target.value)} className={inputCls(errors.distrito)} disabled={!form.provincia}>
                <option value="">Seleccionar distrito</option>
                {distritos.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <FieldError msg={errors.distrito} />
            </div>
          </div>

          {/* Dirección / Referencia */}
          <div data-error={errors.direccion ? true : undefined}>
            <label className={labelCls}>Dirección *</label>
            <input type="text" value={form.direccion} placeholder="Dirección" onChange={e => handleChange("direccion", e.target.value)} className={inputCls(errors.direccion)} />
            <FieldError msg={errors.direccion} />
          </div>
          <div>
            <label className={labelCls}>Referencia</label>
            <input type="text" value={form.referencia} placeholder="Referencia" onChange={e => handleChange("referencia", e.target.value)} className={inputCls(null)} />
          </div>

          {/* Menor de edad */}
          <div>
            <label className={labelCls}>¿Eres menor de edad?</label>
            <div className="flex items-center gap-6">
              {["Sí", "No"].map(op => (
                <label key={op} className="flex items-center gap-2 text-sm text-[#6b7a9f] cursor-pointer">
                  <input
                    type="radio" name="menor_edad"
                    checked={form.es_menor_edad === (op === "Sí")}
                    onChange={() => handleChange("es_menor_edad", op === "Sí")}
                    className="accent-[#123498]"
                  />
                  {op}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECCIÓN 2: DETALLE DEL RECLAMO ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-1 h-6 bg-[#F46F0B] rounded-full" />
            <h2 className="text-base font-black text-[#1c2a52]">
              Detalle del reclamo y orden del consumidor
            </h2>
          </div>

          {/* Tipo reclamo / consumo / pedido */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div data-error={errors.tipo_reclamo ? true : undefined}>
              <label className={labelCls}>Tipo de Reclamo *</label>
              <select value={form.tipo_reclamo} onChange={e => handleChange("tipo_reclamo", e.target.value)} className={inputCls(errors.tipo_reclamo)}>
                <option value="">Tipo de reclamo</option>
                {TIPOS_RECLAMO.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <FieldError msg={errors.tipo_reclamo} />
            </div>
            <div data-error={errors.tipo_consumo ? true : undefined}>
              <label className={labelCls}>Tipo de Consumo *</label>
              <select value={form.tipo_consumo} onChange={e => handleChange("tipo_consumo", e.target.value)} className={inputCls(errors.tipo_consumo)}>
                <option value="">Tipo de consumo</option>
                {TIPOS_CONSUMO.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <FieldError msg={errors.tipo_consumo} />
            </div>
            <div>
              <label className={labelCls}>N° de Pedido</label>
              <input type="text" value={form.numero_pedido} placeholder="Ej: PED-12345" onChange={e => handleChange("numero_pedido", e.target.value)} className={inputCls(null)} />
            </div>
          </div>

          {/* Fecha reclamación / Proveedor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Fecha de Reclamación / Queja</label>
              <input type="date" value={form.fecha_reclamacion} onChange={e => handleChange("fecha_reclamacion", e.target.value)} className={inputCls(null)} />
            </div>
            <div>
              <label className={labelCls}>Proveedor</label>
              <input type="text" value={form.proveedor} placeholder="Nombre del Proveedor" onChange={e => handleChange("proveedor", e.target.value)} className={inputCls(null)} />
            </div>
          </div>

          {/* Monto / Fecha compra / Fecha consumo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Monto Reclamado (S/)</label>
              <input type="number" value={form.monto_reclamado} placeholder="0.00" step="0.01" onChange={e => handleChange("monto_reclamado", e.target.value)} className={inputCls(null)} />
            </div>
            <div>
              <label className={labelCls}>Fecha de Compra</label>
              <input type="date" value={form.fecha_compra} onChange={e => handleChange("fecha_compra", e.target.value)} className={inputCls(null)} />
            </div>
            <div>
              <label className={labelCls}>Fecha de Consumo</label>
              <input type="date" value={form.fecha_consumo} onChange={e => handleChange("fecha_consumo", e.target.value)} className={inputCls(null)} />
            </div>
          </div>

          {/* Fecha caducidad */}
          <div className="max-w-xs">
            <label className={labelCls}>Fecha de Caducidad</label>
            <input type="date" value={form.fecha_caducidad} onChange={e => handleChange("fecha_caducidad", e.target.value)} className={inputCls(null)} />
          </div>

          {/* Descripción */}
          <div data-error={errors.descripcion_producto ? true : undefined}>
            <label className={labelCls}>Descripción del Producto o Servicio *</label>
            <textarea value={form.descripcion_producto} placeholder="Describa detalladamente el producto o servicio..." rows={4} onChange={e => handleChange("descripcion_producto", e.target.value)} className={`${inputCls(errors.descripcion_producto)} resize-none`} />
            <FieldError msg={errors.descripcion_producto} />
          </div>

          {/* Detalle */}
          <div data-error={errors.detalle_reclamacion ? true : undefined}>
            <label className={labelCls}>Detalle de la Reclamación / Queja *</label>
            <textarea value={form.detalle_reclamacion} placeholder="Detallar los hechos del reclamo..." rows={4} onChange={e => handleChange("detalle_reclamacion", e.target.value)} className={`${inputCls(errors.detalle_reclamacion)} resize-none`} />
            <FieldError msg={errors.detalle_reclamacion} />
          </div>

          {/* Pedido */}
          <div data-error={errors.pedido_cliente ? true : undefined}>
            <label className={labelCls}>Pedido del Cliente *</label>
            <textarea value={form.pedido_cliente} placeholder="¿Qué solución espera el cliente?" rows={3} onChange={e => handleChange("pedido_cliente", e.target.value)} className={`${inputCls(errors.pedido_cliente)} resize-none`} />
            <FieldError msg={errors.pedido_cliente} />
          </div>

          {/* Nota informativa */}
          <div className="bg-[#123498]/5 border border-[#123498]/10 rounded-xl p-4 text-xs text-[#6b7a9f] leading-relaxed flex flex-col gap-2">
            <p><span className="font-bold text-[#123498]">(1) Reclamación:</span> Desacuerdo relacionado con productos y/o servicios.</p>
            <p><span className="font-bold text-[#123498]">(2) Queja:</span> Desacuerdo no relacionado con productos y/o servicios; o, malestar o insatisfacción con la atención al público.</p>
          </div>

          {/* Declaraciones */}
          <div className="flex flex-col gap-3">
            <label className="flex items-start gap-3 cursor-pointer" data-error={errors.acepta_declaracion ? true : undefined}>
              <input type="checkbox" checked={form.acepta_declaracion} onChange={e => handleChange("acepta_declaracion", e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#123498]" />
              <span className="text-xs font-bold text-[#1c2a52] uppercase leading-relaxed">
                Declaro que soy el dueño del servicio y acepto el contenido de este formulario al declarar bajo declaración jurada la veracidad de los hechos descritos.
              </span>
            </label>
            <FieldError msg={errors.acepta_declaracion} />

            {/* Aviso legal */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed flex flex-col gap-2">
              <p>• La formulación del reclamo no excluye el recurso a otros medios de resolución de controversias ni es un requisito previo para presentar una denuncia ante el Indecopi.</p>
              <p>• El proveedor debe responder a la reclamación en un plazo no superior a quince (15) días naturales, pudiendo ampliar el plazo hasta quince días.</p>
              <p>• Con la firma de este documento, el cliente autoriza a ser contactado después de la tramitación de la reclamación para evaluar la calidad y satisfacción del proceso de atención de reclamaciones.</p>
            </div>

            <label className="flex items-start gap-3 cursor-pointer" data-error={errors.acepta_politica ? true : undefined}>
              <input type="checkbox" checked={form.acepta_politica} onChange={e => handleChange("acepta_politica", e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#123498]" />
              <span className="text-xs text-[#6b7a9f] leading-relaxed">
                He leído y acepto la{" "}
                <Link to="/politica-privacidad" className="font-bold text-[#123498] underline">Política de Privacidad y Seguridad</Link>
                {" "}y la{" "}
                <Link to="/aviso-legal" className="font-bold text-[#123498] underline">Política de Cookies</Link>.
              </span>
            </label>
            <FieldError msg={errors.acepta_politica} />
          </div>

          {/* Botón */}
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={enviando}
              className="bg-[#123498] hover:bg-[#0f2a80] disabled:opacity-60 disabled:cursor-not-allowed text-white font-black text-sm px-12 py-3.5 rounded-xl transition-colors shadow-sm"
            >
              {enviando ? "Enviando..." : "Enviar Reclamo"}
            </button>
          </div>
        </div>
      </form>



    </div>
  );
}