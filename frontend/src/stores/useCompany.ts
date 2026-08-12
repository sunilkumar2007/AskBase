import { useState } from 'react'

export interface CompanyProfile {
  name: string
  industry: string
  description: string
  currency: string
  primaryDatabase: string
}

const DEFAULT_COMPANY: CompanyProfile = {
  name: 'Acme Global Enterprises',
  industry: 'E-Commerce & Retail Analytics',
  description: 'Enterprise distributor of high-performance components, widgets, and services.',
  currency: 'INR (₹)',
  primaryDatabase: 'PostgreSQL / SQLite',
}

export function useCompany() {
  const [company, setCompanyState] = useState<CompanyProfile>(() => {
    const saved = localStorage.getItem('askbase_company_profile')
    return saved ? JSON.parse(saved) : DEFAULT_COMPANY
  })

  const updateCompany = (updated: Partial<CompanyProfile>) => {
    const newProfile = { ...company, ...updated }
    setCompanyState(newProfile)
    localStorage.setItem('askbase_company_profile', JSON.stringify(newProfile))
  }

  return {
    company,
    updateCompany,
  }
}
