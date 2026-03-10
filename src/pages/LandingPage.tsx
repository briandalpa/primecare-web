import ServicesSection from '@/features/landing-page/company-services/ServicesSection';
import FeaturesStrip from '@/features/landing-page/features-strip/FeaturesStrip';
import HeroSection from '@/features/landing-page/hero/HeroSection';
import MainLayout from '@/layouts/MainLayout';

export default function LandingPage() {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturesStrip />
      <ServicesSection />
    </MainLayout>
  );
}
