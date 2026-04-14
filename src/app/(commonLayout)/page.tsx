import CategorySection from '@/components/static/CategorySection'
import SectionHero from '@/components/static/Hero'
import LandingTutor from '@/components/static/LandingTutor'


import OurServices from '@/components/static/OurServices'
import SectionSession from '@/components/static/Session'
import React from 'react'

export default function Home() {
  return (
    <div>

      <SectionHero />
      <LandingTutor />
      <OurServices />
      <CategorySection />
      <SectionSession />

    </div>
  )
}
