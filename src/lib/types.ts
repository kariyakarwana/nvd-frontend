// Type definitions matching backend models

export const Role = {
  ADMIN: 'ROLE_ADMIN',
  CITIZEN: 'ROLE_CITIZEN',
  HEALTH_WORKER: 'ROLE_HEALTH_WORKER'  // ✅ Matches backend
} as const;

export type Role = typeof Role[keyof typeof Role];

export interface User {
  id: number;
  email: string;
  password?: string; // Optional since often excluded
  role: Role;
  fullname?: string;
  nic?: string;
  address?: string;
  phone?: string;
  dob?: string; // ISO date string
}

export interface Vaccine {
  id: number;
  name: string;
  totalDoses: number;
  minAgeMonths: number;
  maxAgeMonths: number;
}

export interface VaccinationRecord {
  id: number;
  citizen: User; // Note: backend has JsonIgnoreProperties on password, address, phone
  vaccine?: Vaccine;
  doseNumber?: number;
  administrationDate: string; // ISO date string
  manufacturer: string;
  lotNumber: string;
  expiryDate: string; // ISO date string
  providerName: string;
  providerOffice?: string;
  providerTitle?: string;
  visDate: string; // ISO date string
}

// API request types
export interface AddVaccinationRequest {
  vaccine: { id: number };
  doseNumber: number;
  administrationDate: string;
  manufacturer: string;
  lotNumber: string;
  expiryDate: string;
  providerName: string;
  providerOffice?: string;
  providerTitle?: string;
  visDate: string;
}