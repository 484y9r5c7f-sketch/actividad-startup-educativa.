export default function FeatureCard({ icon, title, text }) {
  return (
    <div className="text-center bg-white rounded-lg shadow p-5 hover:shadow-lg transition">
      <div className="text-4xl text-blue-600 mb-3">{icon}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{text}</p>
    </div>
  );
}
