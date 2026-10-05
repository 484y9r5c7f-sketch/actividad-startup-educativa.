// Modelo: datos de cursos (fuente única de verdad)
const rawCourses = [
	{
		id: 'desarrollo-web',
		title: 'Desarrollo Web',
		description: 'Aprende HTML, CSS y JavaScript desde cero hasta proyectos reales.',
		longDescription:
			'Programa intensivo para construir aplicaciones web modernas. Desde los fundamentos hasta buenas prácticas en producción, con énfasis en accesibilidad y performance.',
		image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80&auto=format&fit=crop',
		priceCOP: 1299000,
		duration: '12 semanas',
		level: 'Desde cero',
		goals: [
			'Construir SPAs con React',
			'Desplegar aplicaciones estáticas',
			'Crear layouts responsivos y accesibles',
		],
		outcomes: [
			'Portfolio con 2 proyectos completos',
			'Dominio de HTML/CSS/JS y React básico',
			'Preparación para entrevistas frontend',
		],
		prerequisites: ['Conexión a Internet', 'Ganas de practicar'],
		plan: [
			'Fundamentos de la web (HTML/CSS)',
			'JavaScript y DOM',
			'React: componentes y estado',
			'Proyecto final: SPA responsive',
		],
		tutor: {
			name: 'Ana Castillo',
			bio: 'Ingeniera de software con 6 años de experiencia desarrollando aplicaciones web y enseñando React.',
			image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=800&q=80&auto=format&fit=crop',
		},
	},
	{
		id: 'data-science',
		title: 'Data Science',
		description: 'Análisis de datos, visualización y modelos básicos con Python.',
		longDescription:
			'Formación práctica en Python para análisis, limpieza de datos, visualización y primeros modelos de machine learning aplicables a casos reales.',
		image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&q=80&auto=format&fit=crop',
		priceCOP: 1499000,
		duration: '14 semanas',
		level: 'Intermedio',
		goals: [
			'Manejar pipelines de datos',
			'Crear visualizaciones que comuniquen insights',
			'Entrenar modelos supervisados simples',
		],
		outcomes: [
			'Proyecto final con pipeline de datos',
			'Portfolio con notebooks reproducibles',
			'Capacidad básica para producción de modelos',
		],
		prerequisites: ['Conocimientos básicos de programación (recomendado)'],
		plan: [
			'Python para datos',
			'Limpieza y visualización',
			'Modelos supervisados',
			'Proyecto final: pipeline de datos',
		],
		tutor: {
			name: 'Marcos Peña',
			bio: 'Científico de datos con experiencia en analytics y ML en producción.',
			image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&q=80&auto=format&fit=crop',
		},
	},
	{
		id: 'marketing-digital',
		title: 'Marketing Digital',
		description: 'Estrategias, métricas y campañas para crecer canales digitales.',
		longDescription:
			'Programa orientado a planificación y ejecución de campañas digitales, medición de métricas clave y optimización para conversión.',
		image: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=1200&q=80&auto=format&fit=crop',
		priceCOP: 990000,
		duration: '8 semanas',
		level: 'Inicio / Intermedio',
		goals: [
			'Diseñar embudos de conversión',
			'Configurar campañas en redes y Google Ads',
			'Medir y optimizar resultados',
		],
		outcomes: [
			'Campaña de prueba con métricas reales',
			'Dashboard básico de analítica',
			'Estrategia de contenido y ads',
		],
		prerequisites: ['Conocimientos básicos de redes sociales (beneficioso)'],
		plan: [
			'Fundamentos de marketing',
			'Publicidad en redes',
			'Analítica y conversiones',
			'Proyecto final: campaña integral',
		],
		tutor: {
			name: 'Carolina Ríos',
			bio: 'Especialista en marketing con foco en growth y analítica para startups.',
			image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80&auto=format&fit=crop',
		},
	},
	{
		id: 'ingles-profesional',
		title: 'Inglés Profesional',
		description: 'Inglés orientado a entornos laborales y entrevistas técnicas.',
		longDescription:
			'Curso práctico centrado en comunicación profesional, entrevistas técnicas y redacción de CV/LinkedIn en inglés.',
		image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=1200&q=80&auto=format&fit=crop',
		priceCOP: 650000,
		duration: '6 semanas',
		level: 'Intermedio',
		goals: [
			'Mejorar fluidez en contextos laborales',
			'Prepararse para entrevistas técnicas',
			'Redactar documentos profesionales en inglés',
		],
		outcomes: [
			'Simulacros de entrevistas (en vivo)',
			'CV y perfil de LinkedIn en inglés',
			'Mayor confianza conversacional',
		],
		prerequisites: ['Nivel intermedio de inglés (B1+) recomendado'],
		plan: [
			'Inglés conversacional profesional',
			'Inglés para entrevistas técnicas',
			'Escritura profesional',
			'Práctica con casos reales',
		],
		tutor: {
			name: 'Laura Gómez',
			bio: 'Profesora de inglés con experiencia en entornos corporativos y técnicas comunicativas.',
			image: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=800&q=80&auto=format&fit=crop',
		},
	},
	{
		id: 'certificacion-frontend',
		title: 'Certificación Frontend',
		description: 'Domina herramientas modernas para frontend y obtén una certificación práctica.',
		longDescription:
			'Programa intensivo para dominar herramientas modernas de frontend, testing y optimización, finalizando con un proyecto certificador.',
		image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=1200&q=80&auto=format&fit=crop',
		priceCOP: 1799000,
		duration: '16 semanas',
		level: 'Intermedio/Avanzado',
		goals: [
			'Dominar React avanzado y arquitectura de UI',
			'Implementar testing y performance',
			'Preparar para roles Senior/Lead frontend',
		],
		outcomes: [
			'Proyecto certificador con evaluación',
			'Buenas prácticas de testing y rendimiento',
			'Mentoría para entrevistas técnicas',
		],
		prerequisites: ['HTML/CSS/JS básicos', 'Conocimiento de React básico recomendado'],
		plan: [
			'HTML/CSS avanzado',
			'JavaScript moderno y testing',
			'React avanzado y optimización',
			'Proyecto certificador',
		],
		tutor: {
			name: 'Pedro Silva',
			bio: 'Desarrollador frontend senior con experiencia en optimización y arquitectura de UI.',
			image: 'https://images.unsplash.com/photo-1531123414780-f1f9c7e5f8b5?w=800&q=80&auto=format&fit=crop',
		},
	},
];

export default rawCourses;
