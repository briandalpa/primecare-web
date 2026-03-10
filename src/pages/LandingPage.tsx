import BrandStorySection from '@/features/landing-page/brand-story/BrandStorySection';
import ServicesSection from '@/features/landing-page/company-services/ServicesSection';
import FAQSection from '@/features/landing-page/faq/FAQSection';
import FeaturesStrip from '@/features/landing-page/features-strip/FeaturesStrip';
import HeroSection from '@/features/landing-page/hero/HeroSection';
import HowItWorksSection from '@/features/landing-page/how-it-works/HowItWorksSection';
import OutletsSection from '@/features/landing-page/outlet/OutletsSection';
import TestimonialsSection from '@/features/landing-page/testimonial/TestimonialsSection';
import PricingSection from '@/features/pricing/PricingSection';
import MainLayout from '@/layouts/MainLayout';

export default function LandingPage() {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturesStrip />
      <ServicesSection />
      <TestimonialsSection />
      <PricingSection />
      <HowItWorksSection />
      <FAQSection />
      <OutletsSection />
      <BrandStorySection />
    </MainLayout>
  );
}
