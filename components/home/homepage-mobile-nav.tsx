'use client'

import { useState } from 'react'
import HamburgerButton from '@/components/ui/hamburger-button'
import MobileNavDrawer from '@/components/ui/mobile-nav-drawer'

export interface HomepageMobileNavProps {
  isAdmin: boolean
}

export default function HomepageMobileNav({ isAdmin }: HomepageMobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <HamburgerButton isOpen={isOpen} onToggle={() => setIsOpen((v) => !v)} />
      <MobileNavDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isAdmin={isAdmin}
      />
    </>
  )
}
