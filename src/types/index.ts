export interface Patient {
    id: string;
    name: string;
    cpf: string;
    phone: string;
    basicHealthUnit: string;
    address: string;
    susCard: string;
    communityAgent: string;
    doctorType: string;
    registeredBy: string; // User ID of who registered the patient
    createdAt: Date;
}

export interface Doctor {
    id: string;
    name: string;
    cpf: string;
    specialty: string;
    crm: string;
    procedures: string[];
}

export interface TimeSlot {
    id: string;
    time: string;
    available: boolean;
}

export interface Appointment {
    id: string;
    patientId: string;
    doctorId: string;
    date: string;
    time: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    notes?: string;
    createdByRole?: UserRole; // Track who made the appointment
    createdAt: Date;
}

export interface SchedulingList {
    id: string;
    name: string;
    date: string;
    doctorId: string;
    doctorType: string;
    patientIds: string[];
}

export type UserRole = 'administrator' | 'health_professional';

export interface User {
    id: string;
    name: string;
    role: UserRole;
    cpf: string;
    establishment: string;
    password?: string;
}

export type ViewType = 'dashboard' | 'patients' | 'doctors' | 'schedule' | 'users' | 'appointments_list';
