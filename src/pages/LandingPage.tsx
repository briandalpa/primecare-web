import ServicesSection from '@/features/landing-page/company-services/ServicesSection';
import FAQSection from '@/features/landing-page/faq/FAQSection';
import FeaturesStrip from '@/features/landing-page/features-strip/FeaturesStrip';
import HeroSection from '@/features/landing-page/hero/HeroSection';
import HowItWorksSection from '@/features/landing-page/how-it-works/HowItWorksSection';
import OutletsSection from '@/features/landing-page/outlet/OutletSection';
import MainLayout from '@/layouts/MainLayout';

export default function LandingPage() {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturesStrip />
      <ServicesSection />
      <HowItWorksSection />
      <FAQSection />
      <OutletsSection />
    </MainLayout>
  );
}
