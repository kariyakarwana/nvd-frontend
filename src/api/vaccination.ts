import api from "./axios";
import type { User, Vaccine, VaccinationRecord, AddVaccinationRequest } from "@/lib/types";

export const searchCitizen = (nic: string) => api.get<User>(`/citizen/search/${nic}`);
export const getAllCitizens = () => api.get<User[]>("/citizen/all");
export const getVaccines = () => api.get<Vaccine[]>("/vaccines");

export const addVaccination = (nic: string, data: AddVaccinationRequest) =>
    api.post(`/vaccination/${nic}`, data);

export const getVaccinationHistory = (nic: string) =>
    api.get<VaccinationRecord[]>(`/vaccination/${nic}`);

export const getMyVaccinations = () =>
  api.get("/vaccination/me");
