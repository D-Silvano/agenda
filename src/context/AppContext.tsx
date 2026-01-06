import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Patient, Doctor, Appointment, ViewType, User, SchedulingList } from '../types';

interface AppContextType {
    // View Management
    currentView: ViewType;
    setCurrentView: (view: ViewType) => void;

    // Patients
    patients: Patient[];
    addPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => void;
    updatePatient: (id: string, patient: Partial<Omit<Patient, 'id' | 'createdAt'>>) => void;
    deletePatient: (id: string) => void;

    // Doctors
    doctors: Doctor[];
    addDoctor: (doctor: Omit<Doctor, 'id'>) => void;
    deleteDoctor: (id: string) => void;

    // Appointments
    appointments: Appointment[];
    addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => void;
    updateAppointmentStatus: (id: string, status: Appointment['status']) => void;

    // Scheduling Lists (Agenda)
    schedulingLists: SchedulingList[];
    addSchedulingList: (list: Omit<SchedulingList, 'id'>) => void;
    deleteSchedulingList: (id: string) => void;
    addPatientToList: (listId: string, patientId: string) => void;
    removePatientFromList: (listId: string, patientId: string) => void;

    // Users
    users: User[];
    addUser: (user: Omit<User, 'id'>) => void;

    // Auth
    isAuthenticated: boolean;
    currentUser: User | null;
    login: (cpf: string, password: string) => void;
    logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock Data
const mockDoctors: Doctor[] = [
    { id: '1', name: 'Dr. Ana Silva', specialty: 'Clínico Geral', crm: '12345-SP', cpf: '111.111.111-11', procedures: ['Consulta', 'Exame Físico'] },
    { id: '2', name: 'Dr. Carlos Santos', specialty: 'Pediatria', crm: '23456-SP', cpf: '222.222.222-22', procedures: ['Acompanhamento Infantil', 'Vacinas'] },
    { id: '3', name: 'Dra. Maria Oliveira', specialty: 'Cardiologia', crm: '34567-SP', cpf: '333.333.333-33', procedures: ['Eletrocardiograma', 'Check-up'] },
];

const mockPatients: Patient[] = [
    {
        id: '1',
        name: 'João da Silva',
        cpf: '123.456.789-00',
        phone: '(11) 98765-4321',
        basicHealthUnit: 'UBS Centro',
        address: 'Rua das Flores, 123',
        susCard: '123456789012345',
        communityAgent: 'Maria Santos',
        doctorType: 'Clínico Geral',
        registeredBy: '2', // Fixed to a health professional for demo
        createdAt: new Date('2024-01-15'),
    },
    {
        id: '2',
        name: 'Maria Souza',
        cpf: '987.654.321-00',
        phone: '(11) 91234-5678',
        basicHealthUnit: 'UBS Vila Nova',
        address: 'Av. Principal, 456',
        susCard: '987654321098765',
        communityAgent: 'José Oliveira',
        doctorType: 'Pediatria',
        registeredBy: '2',
        createdAt: new Date('2024-02-20'),
    },
    {
        id: '3',
        name: 'Carlos Alberto Lima',
        cpf: '456.789.012-33',
        phone: '(11) 97777-8888',
        basicHealthUnit: 'UBS Centro',
        address: 'Rua B, 50',
        susCard: '333444555666777',
        communityAgent: 'Maria Santos',
        doctorType: 'Cardiologia',
        registeredBy: '2',
        createdAt: new Date('2024-03-10'),
    },
    {
        id: '4',
        name: 'Ana Paula Rodrigues',
        cpf: '321.654.987-11',
        phone: '(11) 96666-5555',
        basicHealthUnit: 'UBS Principal',
        address: 'Rua das Palmeiras, 10',
        susCard: '111222333444555',
        communityAgent: 'Ricardo Silva',
        doctorType: 'Clínico Geral',
        registeredBy: '2',
        createdAt: new Date('2024-03-12'),
    },
    {
        id: '5',
        name: 'Marcos Vinícius Santos',
        cpf: '789.012.345-66',
        phone: '(11) 95555-4444',
        basicHealthUnit: 'UBS Principal',
        address: 'Av. Getúlio Vargas, 1000',
        susCard: '555666777888999',
        communityAgent: 'Ricardo Silva',
        doctorType: 'Pediatria',
        registeredBy: '2',
        createdAt: new Date('2024-03-15'),
    },
];

const mockAppointments: Appointment[] = [
    {
        id: '1',
        patientId: '1',
        doctorId: '1',
        date: '2024-12-18',
        time: '09:00',
        status: 'scheduled',
        createdByRole: 'administrator',
        createdAt: new Date(),
    },
    {
        id: '2',
        patientId: '2',
        doctorId: '2',
        date: '2024-12-18',
        time: '10:00',
        status: 'scheduled',
        createdByRole: 'administrator',
        createdAt: new Date(),
    },
    {
        id: '3',
        patientId: '3',
        doctorId: '3',
        date: '2024-12-19',
        time: '14:00',
        status: 'scheduled',
        createdByRole: 'administrator',
        createdAt: new Date(),
    },
    {
        id: '4',
        patientId: '4',
        doctorId: '1',
        date: '2024-12-20',
        time: '08:30',
        status: 'scheduled',
        createdByRole: 'administrator',
        createdAt: new Date(),
    },
    {
        id: '5',
        patientId: '5',
        doctorId: '2',
        date: '2024-12-20',
        time: '11:00',
        status: 'scheduled',
        createdByRole: 'administrator',
        createdAt: new Date(),
    },
];

const mockUsers: User[] = [
    {
        id: '1',
        name: 'Administrador',
        role: 'administrator',
        cpf: '1234',
        establishment: 'Sede Central',
        password: '1234'
    },
    {
        id: '2',
        name: 'Profissional de Saúde',
        role: 'health_professional',
        cpf: '777',
        establishment: 'UBS Principal',
        password: '777'
    }
];

const mockSchedulingLists: SchedulingList[] = [
    {
        id: '1',
        name: 'Mutirão de Cardiologia',
        date: '2024-12-19',
        doctorId: '3',
        doctorType: 'Cardiologia',
        patientIds: ['3'],
    },
    {
        id: '2',
        name: 'Consultas Pediatria - Manhã',
        date: '2024-12-20',
        doctorId: '2',
        doctorType: 'Pediatria',
        patientIds: ['2', '5'],
    }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentView, setCurrentView] = useState<ViewType>('dashboard');
    const [patients, setPatients] = useState<Patient[]>(mockPatients);
    const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
    const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
    const [schedulingLists, setSchedulingLists] = useState<SchedulingList[]>(mockSchedulingLists);
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const login = (cpf: string, password: string) => {
        const user = users.find(u => u.cpf === cpf && u.password === password);
        if (user) {
            setCurrentUser(user);
            setIsAuthenticated(true);
        } else {
            alert('CPF ou senha incorretos');
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setCurrentView('dashboard');
    };

    const addUser = (userData: Omit<User, 'id'>) => {
        const newUser: User = {
            ...userData,
            id: Date.now().toString(),
        };
        setUsers([...users, newUser]);
    };

    const addPatient = (patientData: Omit<Patient, 'id' | 'createdAt'>) => {
        const newPatient: Patient = {
            ...patientData,
            id: Date.now().toString(),
            registeredBy: currentUser?.id || '1',
            createdAt: new Date(),
        };
        setPatients([...patients, newPatient]);
    };

    const updatePatient = (id: string, patientData: Partial<Omit<Patient, 'id' | 'createdAt'>>) => {
        setPatients(
            patients.map((p) => (p.id === id ? { ...p, ...patientData } : p))
        );
    };

    const deletePatient = (id: string) => {
        setPatients(patients.filter((p) => p.id !== id));
    };

    const addAppointment = (appointmentData: Omit<Appointment, 'id' | 'createdAt'>) => {
        const newAppointment: Appointment = {
            ...appointmentData,
            id: Date.now().toString(),
            createdByRole: currentUser?.role,
            createdAt: new Date(),
        };
        setAppointments([...appointments, newAppointment]);
    };

    const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
        setAppointments(
            appointments.map((apt) => (apt.id === id ? { ...apt, status } : apt))
        );
    };

    const addSchedulingList = (listData: Omit<SchedulingList, 'id'>) => {
        const newList: SchedulingList = {
            ...listData,
            id: Date.now().toString(),
        };
        setSchedulingLists([...schedulingLists, newList]);
    };

    const deleteSchedulingList = (id: string) => {
        setSchedulingLists(schedulingLists.filter(l => l.id !== id));
    };

    const addPatientToList = (listId: string, patientId: string) => {
        setSchedulingLists(schedulingLists.map(list => {
            if (list.id === listId) {
                // When an administrator adds a patient to a list, create a notification/appointment
                if (currentUser?.role === 'administrator') {
                    const newAppointment: Appointment = {
                        id: Date.now().toString(),
                        patientId: patientId,
                        doctorId: list.doctorId,
                        date: list.date,
                        time: 'A definir (Lista: ' + list.name + ')',
                        status: 'scheduled',
                        createdByRole: 'administrator',
                        createdAt: new Date(),
                    };
                    setAppointments(prev => [...prev, newAppointment]);
                }
                return { ...list, patientIds: [...list.patientIds, patientId] };
            }
            return list;
        }));
    };

    const removePatientFromList = (listId: string, patientId: string) => {
        setSchedulingLists(schedulingLists.map(list =>
            list.id === listId
                ? { ...list, patientIds: list.patientIds.filter(pid => pid !== patientId) }
                : list
        ));
    };

    const addDoctor = (doctorData: Omit<Doctor, 'id'>) => {
        const newDoctor: Doctor = {
            ...doctorData,
            id: Date.now().toString(),
        };
        setDoctors([...doctors, newDoctor]);
    };

    const deleteDoctor = (id: string) => {
        setDoctors(doctors.filter(d => d.id !== id));
    };

    return (
        <AppContext.Provider
            value={{
                currentView,
                setCurrentView,
                patients,
                addPatient,
                updatePatient,
                deletePatient,
                doctors,
                addDoctor,
                deleteDoctor,
                appointments,
                addAppointment,
                updateAppointmentStatus,
                schedulingLists,
                addSchedulingList,
                deleteSchedulingList,
                addPatientToList,
                removePatientFromList,
                isAuthenticated,
                currentUser,
                login,
                logout,
                users,
                addUser,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};
