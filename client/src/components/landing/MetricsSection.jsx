function MetricsSection() {
  return (
    <section className="bg-dark-blue text-white py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-5xl md:text-6xl font-bold text-vibrant-green mb-2">5x</div>
            <div className="text-xl text-gray-300">Taxa de conversão</div>
          </div>
          <div>
            <div className="text-5xl md:text-6xl font-bold text-vibrant-green mb-2">30s</div>
            <div className="text-xl text-gray-300">Tempo médio</div>
          </div>
          <div>
            <div className="text-5xl md:text-6xl font-bold text-vibrant-green mb-2">1000+</div>
            <div className="text-xl text-gray-300">Freelancers</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MetricsSection;

