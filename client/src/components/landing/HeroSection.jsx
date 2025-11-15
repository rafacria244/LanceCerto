import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import banner from '../../assets/banner.png';

function HeroSection() {
  const { user } = useAuth();

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-blue mb-6 leading-tight">
              Menos tempo escrevendo,
              <br />
              <span className="text-vibrant-green">mais tempo faturando.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Gere propostas comerciais personalizadas e persuasivas em segundos com inteligência artificial. 
              Reduza o tempo de criação de propostas de 30 minutos para apenas 30 segundos.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-vibrant-green font-bold text-lg">✓</span>
                <span>Propostas personalizadas</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-vibrant-green font-bold text-lg">✓</span>
                <span>5x mais conversão</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-vibrant-green font-bold text-lg">✓</span>
                <span>Economia de tempo</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to={user ? "/gerar" : "/login"}
                className="bg-vibrant-green text-white font-semibold py-4 px-8 rounded-lg hover:bg-green-600 transition-colors text-lg"
              >
                Gerar Proposta
              </Link>
              {!user && (
                <Link
                  to="/login"
                  className="bg-white border-2 border-dark-blue text-dark-blue font-semibold py-4 px-8 rounded-lg hover:bg-light-gray transition-colors text-lg"
                >
                  Criar Conta
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex justify-center md:justify-end">
            <img 
              src={banner} 
              alt="Freelancer gerando propostas" 
              className="max-w-full h-auto rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

