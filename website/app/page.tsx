import Hero from '@/components/sections/Hero'
import FeatureShowcase from '@/components/sections/FeatureShowcase'
import ProductDemo from '@/components/sections/ProductDemo'
import FeatureDeepDive from '@/components/sections/FeatureDeepDive'
import SkillsSection from '@/components/sections/SkillsSection'
import UseCasesSection from '@/components/sections/UseCasesSection'
import PricingSection from '@/components/sections/PricingSection'
import FinalCTA from '@/components/sections/FinalCTA'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <div>
      <Hero />
      <FeatureShowcase />
      <ProductDemo />
      <FeatureDeepDive />
      <SkillsSection />
      <UseCasesSection />
      <PricingSection />
      <FinalCTA />
      <Footer />
    </div>
  )
}
