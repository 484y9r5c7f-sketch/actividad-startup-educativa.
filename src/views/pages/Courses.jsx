import React, { useMemo, useState } from 'react';
import CourseModal from '../components/CourseModal';
import { formatCOP, getCourses, getLevels, searchCourses } from '../../models/courseModel';

const advantages = [
	{
		key: 'practico',
		title: 'Enfoque práctico',
		icon: (size = 48) => (
			<svg
				width={size}
				height={size}
				viewBox="0 0 24 24"
				fill="none"
				style={{ transformOrigin: 'center' }}
				aria-hidden
			>
				<path d="M12 2v20" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
				<path d="M5 7h14" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
			</svg>
		),
	},
	{
		key: 'mentoria',
		title: 'Mentoría personalizada',
		icon: (size = 48) => (
			<svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
				<circle cx="12" cy="8" r="3" stroke="#0b6fff" strokeWidth="2" />
				<path d="M4 20c1.5-4 6-6 8-6s6.5 2 8 6" stroke="#0b6fff" strokeWidth="2" strokeLinecap="round" />
			</svg>
		),
	},
	{
		key: 'certificado',
		title: 'Certificado oficial',
		icon: (size = 48) => (
			<svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
				<rect x="3" y="4" width="14" height="16" rx="2" stroke="#f59e0b" strokeWidth="2" />
				<path d="M7 8h6" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
				<path d="M7 12h6" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
			</svg>
		),
	},
	{
		key: 'empleabilidad',
		title: 'Enfoque en empleabilidad',
		icon: (size = 48) => (
			<svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
				<path d="M3 12h18" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
				<path d="M12 3v18" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
			</svg>
		),
	},
];

const allCourses = getCourses();

const Courses = () => {
	const [currentIndex, setCurrentIndex] = useState(null); // null = lista, number = curso abierto
	const [hoveredAdv, setHoveredAdv] = useState(null);
	const [selectedCourse, setSelectedCourse] = useState(null);
	const [query, setQuery] = useState('');
	const [level, setLevel] = useState('');
	const visibleCourses = useMemo(() => searchCourses({ query, level }), [query, level]);

	if (currentIndex === null) {
		// listado de cursos con hero y ventajas
		return (
			<section id="cursos" style={{ padding: '2.5rem 1rem' }}>
				{/* Hero específico de cursos */}
				<div
					style={{
						display: 'flex',
						gap: '1rem',
						alignItems: 'center',
						justifyContent: 'space-between',
						background: 'linear-gradient(90deg,#eef2ff,#ffffff)',
						padding: '1.25rem',
						borderRadius: 10,
						marginBottom: '1rem',
						flexWrap: 'wrap',
					}}
				>
					<div style={{ flex: '1 1 420px' }}>
						<h2 style={{ margin: 0 }}>Nuestros cursos</h2>
						<p style={{ color: '#6b7280', marginTop: 6 }}>
							Programas prácticos diseñados para llevarte de la teoría a proyectos reales.
						</p>
						<div style={{ marginTop: 10 }}>
							<a href="#cursos" className="btn-primary" style={{ marginRight: 8 }}>
								Explorar
							</a>
							<a href="#nosotros" className="btn-outline">
								Conócenos
							</a>
						</div>
					</div>

					<div style={{ flex: '0 0 280px', minWidth: 220 }}>
						<img
							src="/src/assets/principal.png"
							alt="Edumotion"
							style={{
								width: '100%',
								height: 160,
								objectFit: 'cover',
								borderRadius: 8,
							}}
						/>
					</div>
				</div>

				<p style={{ color: '#6b7280', marginBottom: '0.75rem' }}>
					Haz click en cualquier curso para ver su plan de estudio, metas y precio.
				</p>

				<div className="course-filters" role="search">
					<label htmlFor="course-search" className="sr-only">Buscar curso</label>
					<input
						id="course-search"
						type="search"
						placeholder="Buscar curso..."
						value={query}
						maxLength={60}
						autoComplete="off"
						onChange={(e) => setQuery(e.target.value)}
					/>
					<label htmlFor="course-level" className="sr-only">Filtrar por nivel</label>
					<select id="course-level" value={level} onChange={(e) => setLevel(e.target.value)}>
						<option value="">Todos los niveles</option>
						{getLevels().map((l) => (
							<option key={l} value={l}>{l}</option>
						))}
					</select>
					<span aria-live="polite" style={{ color: '#6b7280' }}>
						{visibleCourses.length} curso(s)
					</span>
				</div>

				<div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
					{visibleCourses.length === 0 && (
						<p style={{ color: '#6b7280' }}>No encontramos cursos con ese criterio.</p>
					)}
					{visibleCourses.map((c) => (
						<article
							key={c.id}
							style={{
								flex: '1 1 280px',
								maxWidth: '360px',
								padding: 0,
								borderRadius: 8,
								boxShadow: '0 6px 18px rgba(15,23,42,0.06)',
								background: '#fff',
								overflow: 'hidden',
								display: 'flex',
								flexDirection: 'column',
							}}
						>
							<button
								type="button"
								onClick={() => setSelectedCourse(c)}
								aria-label={`Ver plan del curso ${c.title}`}
								style={{
									display: 'flex',
									flexDirection: 'column',
									width: '100%',
									height: '100%',
									padding: 0,
									border: 0,
									background: 'transparent',
									color: 'inherit',
									font: 'inherit',
									textAlign: 'left',
									cursor: 'pointer',
								}}
							>
								<img
									src={c.image}
									alt=""
									style={{ width: '100%', height: 160, objectFit: 'cover' }}
								/>
								<span style={{ display: 'block', padding: '1rem' }}>
									<span role="heading" aria-level="3" style={{ display: 'block', margin: '0 0 6px 0', fontSize: '1.17em', fontWeight: 700 }}>{c.title}</span>
									<span style={{ display: 'block', color: '#6b7280', margin: 0 }}>{c.description}</span>
									<span style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, alignItems: 'center' }}>
										<span style={{ fontWeight: 700 }}>{formatCOP(c.priceCOP)}</span>
										<span style={{ color: '#6b7280' }}>{c.duration}</span>
									</span>
									<span style={{ display: 'block', fontWeight: 600, marginTop: '0.75rem' }}>Ver plan →</span>
								</span>
							</button>
						</article>
					))}
				</div>

				<CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />

				{/* Ventajas */}
				<section aria-labelledby="advantages-heading" style={{ marginTop: '1.5rem' }}>
					<h3 id="advantages-heading" style={{ marginTop: '0.5rem' }}>
						Ventajas de nuestros cursos
					</h3>
					<p style={{ color: '#6b7280', marginTop: 6 }}>
						Diseñados para que aprendas haciendo y mejores tu empleabilidad.
					</p>
					<div
						style={{
							display: 'flex',
							gap: '1rem',
							flexWrap: 'wrap',
							marginTop: 10,
						}}
					>
						{advantages.map((a) => (
							<div
								key={a.key}
								onMouseEnter={() => setHoveredAdv(a.key)}
								onMouseLeave={() => setHoveredAdv(null)}
								style={{
									flex: '1 1 200px',
									minWidth: 180,
									background: '#fff',
									padding: '1rem',
									borderRadius: 8,
									boxShadow:
										hoveredAdv === a.key
											? '0 12px 28px rgba(2,6,23,0.12)'
											: '0 6px 18px rgba(15,23,42,0.04)',
									display: 'flex',
									gap: 12,
									alignItems: 'center',
									transition: 'box-shadow 220ms ease, transform 220ms ease',
									transform: hoveredAdv === a.key ? 'translateY(-6px)' : 'translateY(0)',
									cursor: 'default',
								}}
							>
								<div
									style={{
										width: 56,
										height: 56,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									{/* icon with subtle pulse when hover */}
									<div
										style={{
											transition: 'transform 220ms ease',
											transform: hoveredAdv === a.key ? 'scale(1.07)' : 'scale(1)',
										}}
									>
										{a.icon(44)}
									</div>
								</div>
								<div>
									<strong>{a.title}</strong>
									<div
										style={{
											color: '#6b7280',
											fontSize: 14,
										}}
									>
										{a.key === 'practico'
											? 'Proyectos reales'
											: a.key === 'mentoria'
											? 'Acompañamiento 1:1'
											: a.key === 'certificado'
											? 'Reconocido'
											: 'Con enfoque laboral'}
									</div>
								</div>
							</div>
						))}
					</div>
				</section>
			</section>
		);
	}

	// vista detalle de curso
	const curso = allCourses[currentIndex];

	return (
		<section style={{ padding: '2.5rem 1rem' }}>
			<button
				className="btn-outline"
				onClick={() => setCurrentIndex(null)}
				style={{ marginBottom: '1rem' }}
			>
				← Volver a cursos
			</button>

			<div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
				<div style={{ flex: '1 1 420px', maxWidth: '720px' }}>
					<img
						src={curso.image}
						alt={curso.title}
						style={{
							width: '100%',
							height: 260,
							objectFit: 'cover',
							borderRadius: 8,
							marginBottom: 12,
						}}
					/>
					<h2 style={{ marginTop: 0 }}>{curso.title}</h2>
					<p style={{ color: '#6b7280' }}>{curso.longDescription}</p>

					<div
						style={{
							display: 'flex',
							gap: 12,
							marginTop: 8,
							flexWrap: 'wrap',
						}}
					>
						<div
							style={{
								background: '#fff',
								padding: 10,
								borderRadius: 8,
								boxShadow: '0 6px 18px rgba(15,23,42,0.04)',
							}}
						>
							<strong>Precio</strong>
							<div style={{ marginTop: 6 }}>{formatCOP(curso.priceCOP)}</div>
						</div>
						<div
							style={{
								background: '#fff',
								padding: 10,
								borderRadius: 8,
								boxShadow: '0 6px 18px rgba(15,23,42,0.04)',
							}}
						>
							<strong>Duración</strong>
							<div style={{ marginTop: 6 }}>{curso.duration}</div>
						</div>
						<div
							style={{
								background: '#fff',
								padding: 10,
								borderRadius: 8,
								boxShadow: '0 6px 18px rgba(15,23,42,0.04)',
							}}
						>
							<strong>Nivel</strong>
							<div style={{ marginTop: 6 }}>{curso.level}</div>
						</div>
					</div>

					<h3 style={{ marginTop: 16 }}>Objetivos del curso</h3>
					<ul>
						{curso.goals.map((g) => (
							<li key={g}>{g}</li>
						))}
					</ul>

					<h3>Resultados esperados</h3>
					<ul>
						{curso.outcomes.map((o) => (
							<li key={o}>{o}</li>
						))}
					</ul>

					<h3>Plan de estudio</h3>
					<ol>
						{curso.plan.map((item) => (
							<li key={item} style={{ marginBottom: '0.5rem' }}>
								{item}
							</li>
						))}
					</ol>

					<h3>Requisitos</h3>
					<ul>
						{curso.prerequisites.map((r) => (
							<li key={r}>{r}</li>
						))}
					</ul>

					<h3>Modalidad y clases</h3>
					<p>
						Lecciones pregrabadas + sesiones en vivo semanales. Material descargable y proyecto final.
					</p>
				</div>

				<aside style={{ flex: '0 0 300px', minWidth: 260 }}>
					<div
						style={{
							padding: '1rem',
							borderRadius: 8,
							background: '#fff',
							boxShadow: '0 6px 18px rgba(15,23,42,0.06)',
						}}
					>
						<img
							src={curso.tutor.image}
							alt={curso.tutor.name}
							style={{
								width: '100%',
								height: 200,
								objectFit: 'cover',
								borderRadius: 6,
								marginBottom: '0.75rem',
							}}
						/>
						<h4 style={{ margin: '0 0 0.25rem 0' }}>{curso.tutor.name}</h4>
						<p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>{curso.tutor.bio}</p>
						<p style={{ fontSize: '0.9rem' }}>
							<strong>Clases:</strong> Lecciones pregrabadas + sesiones en vivo semanales
						</p>
						<p style={{ marginTop: 8 }}>
							<strong>Inscripción:</strong> {formatCOP(curso.priceCOP)}
						</p>
					</div>
				</aside>
			</div>

			<div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
				<button
					className="btn-secondary"
					onClick={() => setCurrentIndex((i) => (i > 0 ? i - 1 : allCourses.length - 1))}
				>
					← Anterior
				</button>
				<button
					className="btn-secondary"
					onClick={() => setCurrentIndex((i) => (i < allCourses.length - 1 ? i + 1 : 0))}
				>
					Siguiente →
				</button>
			</div>
		</section>
	);
};

export default Courses;