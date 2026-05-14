function StatCard({ title, value }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:scale-105 transition-all duration-300 shadow-xl">

      <p className="text-gray-400 mb-3 text-lg">
        {title}
      </p>

      <h2 className="text-5xl font-bold text-white">
        {value}
      </h2>

    </div>
  );
}

export default StatCard;