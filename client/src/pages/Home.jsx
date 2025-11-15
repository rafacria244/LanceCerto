import Header from '../components/Header';
import HeroSection from '../components/landing/HeroSection';
import MetricsSection from '../components/landing/MetricsSection';
import WhySection from '../components/landing/WhySection';
import PlansSection from '../components/landing/PlansSection';
import FinalSection from '../components/landing/FinalSection';

function Home() {
  return (
    <div className="min-h-screen bg-light-gray">
      <Header />
      <HeroSection />
      <MetricsSection />
      <WhySection />
      <PlansSection />
      <FinalSection />
    </div>
  );
}

export default Home;

