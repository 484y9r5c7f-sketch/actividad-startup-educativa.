export default function CourseCard({ course }) {
  return (
    <article className="course-card visual">
      <img
        src={course.image}
        className="course-img visual"
        alt={course.title}
      />
      <div className="course-content">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-duration">{course.duration}</p>
        <p className="course-description">{course.description}</p>
      </div>
    </article>
  );
}
