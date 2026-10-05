import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
	{
		name: 'María González',
		image: 'https://randomuser.me/api/portraits/women/44.jpg',
		text: 'Edumotion me ayudó a descubrir mi pasión por la tecnología. Los cursos son prácticos y el equipo siempre está dispuesto a ayudar.',
		course: 'Desarrollo Web',
		stars: 5,
	},
	{
		name: 'Carlos Ramírez',
		image: 'https://randomuser.me/api/portraits/men/32.jpg',
		text: 'La experiencia fue increíble. Aprendí mucho más de lo que esperaba y ahora tengo nuevas oportunidades laborales.',
		course: 'Data Science',
		stars: 5,
	},
	{
		name: 'Lucía Torres',
		image: 'https://randomuser.me/api/portraits/women/68.jpg',
		text: 'Me encantó la metodología de Edumotion. Las clases son dinámicas y los profesores muy cercanos.',
		course: 'Marketing Digital',
		stars: 4,
	},
	{
		name: 'Javier Soto',
		image: 'https://randomuser.me/api/portraits/men/15.jpg',
		text: 'Recomiendo Edumotion a todos los que quieren crecer profesionalmente. El acompañamiento es excelente.',
		course: 'Productividad y Liderazgo',
		stars: 5,
	},
	{
		name: 'Sofía Méndez',
		image: 'https://randomuser.me/api/portraits/women/12.jpg',
		text: 'Gracias a Edumotion logré certificarme y conseguir mi primer empleo en tecnología. ¡Son los mejores!',
		course: 'Certificación Frontend',
		stars: 5,
	},
	{
		name: 'Pedro Álvarez',
		image: 'https://randomuser.me/api/portraits/men/23.jpg',
		text: 'El curso de inglés profesional me abrió puertas en empresas internacionales. Súper recomendado.',
		course: 'Inglés Profesional',
		stars: 4,
	},
];

function StarRating({ stars }) {
	return (
		<div className="testimonial-stars" aria-hidden="true">
			{Array.from({ length: 5 }).map((_, i) => (
				<span
					key={`star-${i}`}
					style={{
						color: i < stars ? '#fbbf24' : '#e5e7eb',
						fontSize: '1.2em',
					}}
				>
					★
				</span>
			))}
		</div>
	);
}

function buildSlides(testimonialsList) {
	if (!testimonialsList || testimonialsList.length === 0) return [];
	const slides = [];
	const totalSlides = 3;
	const perSlide = 3;
	for (let s = 0; s < totalSlides; s++) {
		const slide = [];
		for (let i = 0; i < perSlide; i++) {
			const idx = (s * perSlide + i) % testimonialsList.length;
			slide.push(testimonialsList[idx]);
		}
		slides.push(slide);
	}
	return slides;
}

const Testimonials = () => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => setVisible(true), 180);
		return () => clearTimeout(timer);
	}, []);

	if (!testimonials || testimonials.length === 0) {
		return null;
	}

	const slides = buildSlides(testimonials);

	if (!slides || slides.length === 0) {
		return null;
	}

	return (
		<section
			id="testimonios"
			className="testimonials"
			aria-label="Testimonios de estudiantes"
			style={{
				transition: 'opacity 600ms ease, transform 600ms ease',
				opacity: visible ? 1 : 0,
				transform: visible ? 'translateY(0)' : 'translateY(12px)',
				padding: '3rem 1rem',
			}}
		>
			<h2 style={{ marginBottom: '0.25rem' }}>Lo que dicen nuestros estudiantes</h2>
			<p style={{ marginTop: 0, marginBottom: '1rem', color: '#6b7280' }}>
				Historias reales de personas que empezaron donde tú estás y hoy trabajan en lo que aman.
			</p>

			<Swiper
				slidesPerView={1}
				spaceBetween={20}
				grabCursor
				autoplay={{ delay: 3500, disableOnInteraction: false }}
				loop
				pagination={{ clickable: true }}
				keyboard={{ enabled: true }}
				modules={[Autoplay, Pagination, Keyboard]}
				className="testimonials-slider"
			>
				{slides.map((slideTestimonials, slideIdx) => (
					<SwiperSlide key={`slide-${slideIdx}`}>
						<div
							className="testimonial-slide"
							role="group"
							aria-roledescription="slide"
							aria-label={`Testimonios ${slideIdx + 1} de ${slides.length}`}
							style={{
								display: 'flex',
								gap: '1rem',
								justifyContent: 'center',
								alignItems: 'stretch',
								flexWrap: 'wrap',
							}}
						>
							{slideTestimonials.map((t, idx) => (
								<div
									className="testimonial-card"
									key={`card-${slideIdx}-${idx}`}
									style={{
										flex: '1 1 30%',
										minWidth: '220px',
										maxWidth: '360px',
										background: '#fff',
										borderRadius: '8px',
										padding: '1rem',
										boxShadow: '0 6px 18px rgba(15,23,42,0.06)',
										display: 'flex',
										flexDirection: 'column',
										gap: '0.5rem',
									}}
								>
									<img
										src={t.image}
										alt={`${t.name} — ${t.course}`}
										loading="lazy"
										className="testimonial-img"
										style={{
											width: 64,
											height: 64,
											borderRadius: '50%',
											objectFit: 'cover',
										}}
									/>
									<StarRating stars={t.stars} />
									<p className="testimonial-text" style={{ marginTop: '0.25rem', flexGrow: 1, color: '#374151' }}>
										"{t.text}"
									</p>
									<p className="testimonial-course" style={{ fontSize: '0.9rem', color: '#6b7280' }}>{t.course}</p>
									<p className="testimonial-name" style={{ fontWeight: 600 }}>{t.name}</p>
								</div>
							))}
						</div>
					</SwiperSlide>
				))}
			</Swiper>
		</section>
	);
};

export default Testimonials;