// src/services/adminService.js
import { empresasService } from "./empresasService";
import { ofertasService } from "./ofertasService";
import { apiFetch } from "./api";

// --- COMPANIES CRUD (API Real) ---
export const getCompanies = async () => {
    const result = await empresasService.listar();
    return result.data || [];
};

export const getUbicacionesUnicas = async () => {
    const result = await apiFetch("/admin/?resource=empresas&action=ubicaciones");
    return result.data || [];
};

export const saveCompany = async (company, logoFile = null) => {
    const formData = new FormData();
    formData.append("nombre",      company.nombre);
    formData.append("ruc",         company.ruc         || "");
    formData.append("sector",      company.sector);
    formData.append("descripcion", company.descripcion  || "");

    // ── Campos nuevos ──────────────────────────────────────
    formData.append("ubicacion",      company.ubicacion      || "");
    formData.append("anio_fundacion", company.anio_fundacion || "");
    formData.append("num_empleados",  company.num_empleados  || "");
    formData.append("sitio_web",      company.sitio_web      || "");
    formData.append("beneficios",     company.beneficios     || "[]");

    if (company.id) {
        formData.append("id", company.id);
    }
    if (logoFile) {
        formData.append("logo", logoFile);
    }

    if (company.id) {
        return await empresasService.editar(formData);
    } else {
        return await empresasService.crear(formData);
    }
};

export const deleteCompany = async (id) => {
    return await empresasService.eliminar(id);
};

// --- OFFERS CRUD (API Real) ---
export const getOffers = async () => {
    const result = await ofertasService.listar();
    return result.data || [];
};

export const saveOffer = async (offer) => {
    const data = {
        empresa_id: offer.empresa_id,
        titulo: offer.titulo,
        descripcion: offer.descripcion || "",
        requisitos: offer.requisitos || null,
        salario_min: offer.salario_min || null,
        salario_max: offer.salario_max || null,
        ubicacion: offer.ubicacion || null,
        modalidad: offer.modalidad || "presencial",
        horario: offer.horario || null,
        tipo_contrato: offer.tipo_contrato || "Tiempo completo",
        nivel_experiencia: offer.nivel_experiencia || null,
        categoria_id: offer.categoria_id || null,
        estado: offer.estado || "activa",
        fecha_publicacion: offer.fecha_publicacion || null,
        fecha_expiracion: offer.fecha_expiracion || null,
    };

    if (offer.id) {
        data.id = offer.id;
        return await apiFetch("/admin/?resource=ofertas&action=editar", {
            method: "POST",
            body: JSON.stringify(data)
        });
    } else {
        return await apiFetch("/admin/?resource=ofertas&action=crear", {
            method: "POST",
            body: JSON.stringify(data)
        });
    }
};

export const deleteOffer = async (id) => {
    return await ofertasService.eliminar(id);
};

export const toggleOfferStatus = async (id) => {
    return await ofertasService.toggleEstado(id);
};

export const closeOffer = async (id) => {
    return await ofertasService.cerrar(id);
};

// --- CANDIDATES (stub temporal, sin backend aún) ---
export const getCandidates = async () => [];
export const updateCandidateStage = async () => {};

// --- CATEGORIES CRUD ---
export const saveCategory = async (category) => {
    const formData = new FormData();
    formData.append("nombre", category.nombre);
    
    if (category.id) {
        formData.append("id", category.id);
        return await apiFetch("/admin/?resource=categorias&action=editar", {
            method: "POST",
            body: formData // <- Ahora enviamos FormData
        });
    } else {
        return await apiFetch("/admin/?resource=categorias&action=crear", {
            method: "POST",
            body: formData // <- Ahora enviamos FormData
        });
    }
};

export const deleteCategory = async (id) => {
    const formData = new FormData();
    formData.append("id", id);
    
    return await apiFetch("/admin/?resource=categorias&action=eliminar", {
        method: "POST",
        body: formData // <- Ahora enviamos FormData
    });
};

// --- REPORTES ---
export const getReportes = async () => {
    const res = await apiFetch("/admin/?resource=reportes&action=listar");
    return res.data || [];
};

export const marcarReporteRevisado = async (id) => {
    return await apiFetch("/admin/?resource=reportes&action=marcar_revisado", {
        method: "POST",
        body: JSON.stringify({ id })
    });
};

export const marcarReporteDescartado = async (id) => {
    return await apiFetch("/admin/?resource=reportes&action=marcar_descartado", {
        method: "POST",
        body: JSON.stringify({ id })
    });
};

// --- PREGUNTAS CRUD ---
export const getQuestions = async (oferta_id) => {
    const result = await apiFetch(`/admin/?resource=preguntas&action=listar&oferta_id=${oferta_id}`);
    return result.data || [];
};

export const saveQuestion = async (question) => {
    // Volvemos a usar JSON.stringify() porque el backend usa getBody() aquí
    if (question.id) {
        return await apiFetch("/admin/?resource=preguntas&action=editar", {
            method: "POST",
            body: JSON.stringify(question)
        });
    } else {
        return await apiFetch("/admin/?resource=preguntas&action=crear", {
            method: "POST",
            body: JSON.stringify(question)
        });
    }
};

export const deleteQuestion = async (id) => {
    return await apiFetch("/admin/?resource=preguntas&action=eliminar", {
        method: "POST",
        body: JSON.stringify({ id })
    });
};

export const deleteQuestionsByOffer = async (oferta_id) => {
    return await apiFetch("/admin/?resource=preguntas&action=eliminar_por_oferta", {
        method: "POST",
        body: JSON.stringify({ oferta_id })
    });
};

// --- POSTULACIONES ---
export const getPostulaciones = async () => {
    const result = await apiFetch("/admin/?resource=postulaciones&action=listar");
    return result.data || [];
};

export const getPostulacionDetalle = async (id) => {
    const result = await apiFetch(`/admin/?resource=postulaciones&action=detalle&id=${id}`);
    return result.data;
};

export const changePostulacionEstado = async (id, estado) => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("estado", estado);
    
    return await apiFetch("/admin/?resource=postulaciones&action=cambiar_estado", {
        method: "POST",
        body: formData // <- Ahora enviamos FormData
    });
};

export const savePostulacionNota = async (id, nota) => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("nota", nota);
    
    return await apiFetch("/admin/?resource=postulaciones&action=agregar_nota", {
        method: "POST",
        body: formData // <- Ahora enviamos FormData
    });
};

// --- STATS HELPER ---
export const getStatsSummary = async () => {
    const companies = await getCompanies();
    const offers = await getOffers();
    const postulaciones = await getPostulaciones();

    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    const todayCount = postulaciones.filter(p =>
        p.fecha_postulacion && p.fecha_postulacion.startsWith(today)
    ).length;

    const activeOffersCount = offers.filter(o => o.estado === 'activa').length;
    const companiesCount = companies.length;

    const total = postulaciones.length;
    const aprobados = postulaciones.filter(p => p.estado === 'aprobado').length;
    const approvalRate = total > 0 ? Math.round((aprobados / total) * 100) : 0;

    const estadoCounts = {};
    postulaciones.forEach(p => { estadoCounts[p.estado] = (estadoCounts[p.estado] || 0) + 1; });

    const funnelStages = [
        { label: "Recibido", count: estadoCounts.recibido || 0, color: "#123498" },
        { label: "Revisado", count: estadoCounts.revisado || 0, color: "#7C3AED" },
        { label: "Entrevista", count: estadoCounts.entrevista || 0, color: "#F59E0B" },
        { label: "Aprobado", count: estadoCounts.aprobado || 0, color: "#16A34A" },
        { label: "Rechazado", count: estadoCounts.rechazado || 0, color: "#DC2626" },
    ];
    const maxFunnel = Math.max(...funnelStages.map(s => s.count), 1);
    funnelStages.forEach(s => { s.width = `${Math.round((s.count / maxFunnel) * 100)}%`; });

    const recentActivity = postulaciones.slice(0, 5).map(p => ({
        candidato: p.candidato_nombre,
        oferta: p.oferta_titulo,
        empresa: p.empresa_nombre,
        estado: p.estado
    }));

    return { todayCount, activeOffersCount, companiesCount, approvalRate, funnelStages, recentActivity };
};