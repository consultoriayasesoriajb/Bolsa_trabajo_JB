export default function ComoFunciona() {
    return (
        <section id="como-funciona" className="bg-white border-b border-slate-100 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10 flex flex-col items-center">
                    <h2 className="text-2xl sm:text-3xl font-black text-[#123498] tracking-tight font-heading uppercase">
                        ¿ Cómo Funciona ?
                    </h2>
                    <div className="w-15 h-1 bg-naranja mt-2 mb-1 rounded-full" />
                    <p className="text-slate-400 text-base font-bold mt-1">
                        Descubre cómo nuestro proceso de empleo funciona
                    </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
                    <div className="flex flex-col items-center text-center max-w-xs">
                        <p className="bg-naranja text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">1</p>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Crea tu perfil</h3>
                        <p className="text-slate-400 text-base">Regístrate en nuestra plataforma y completa tu perfil con información relevante.</p>
                    </div>
                    <div className="flex flex-col items-center text-center max-w-xs">
                        <p className="bg-naranja text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">2</p>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Busca oportunidades</h3>
                        <p className="text-slate-400 text-base">Explora nuestras vacantes y encuentra la oportunidad perfecta para ti.</p>
                    </div>
                    <div className="flex flex-col items-center text-center max-w-xs">
                        <p className="bg-naranja text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">3</p>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Postula a empleos</h3>
                        <p className="text-slate-400 text-base">Envía tu postulación a las vacantes que te interesan y espera la respuesta.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}