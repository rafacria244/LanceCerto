import banner from '../assets/banner.png';

function Hero() {
  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-dark-blue mb-4">
              Menos tempo escrevendo,
              <br />
              <span className="text-vibrant-green">mais tempo faturando.</span>
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Gere propostas comerciais personalizadas e persuasivas em segundos com inteligência artificial.
              Reduza o tempo de criação de propostas de 30 minutos para 30 segundos.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-vibrant-green font-bold">✓</span>
                <span>Propostas personalizadas</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-vibrant-green font-bold">✓</span>
                <span>5x mais conversão</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-vibrant-green font-bold">✓</span>
                <span>Economia de tempo</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <img 
              src={banner} 
              alt="Freelancer gerando propostas" 
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

