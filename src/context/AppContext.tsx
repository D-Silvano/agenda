import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase, supabaseUrl, supabaseKey } from '../lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { Patient, Doctor, Appointment, ViewType, User, SchedulingList } from '../types';

interface AppContextType {
    // View Management
    currentView: ViewType;
    setCurrentView: (view: ViewType) => void;

    // Patients
    patients: Patient[];
    addPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => Promise<{ error?: string }>;
    updatePatient: (id: string, patient: Partial<Omit<Patient, 'id' | 'createdAt'>>) => Promise<{ error?: string }>;
    deletePatient: (id: string) => Promise<void>;

    // Doctors
    doctors: Doctor[];
    addDoctor: (doctor: Omit<Doctor, 'id'>) => Promise<{ error?: string }>;
    deleteDoctor: (id: string) => Promise<void>;

    // Appointments
    appointments: Appointment[];
    addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => Promise<{ error?: string }>;
    updateAppointmentStatus: (id: string, status: Appointment['status']) => Promise<void>;

    // Scheduling Lists (Agenda)
    schedulingLists: SchedulingList[];
    addSchedulingList: (list: Omit<SchedulingList, 'id'>) => Promise<{ error?: string }>;
    deleteSchedulingList: (id: string) => Promise<void>;
    addPatientToList: (listId: string, patientId: string) => Promise<void>;
    removePatientFromList: (listId: string, patientId: string) => Promise<void>;
    updatePatientStatusInList: (listId: string, patientId: string, status: 'postponed' | 'desisted' | null) => Promise<void>;

    // Users
    users: User[];
    addUser: (user: Omit<User, 'id'>) => Promise<{ error?: string }>;
    updateUser: (id: string, userData: Partial<Omit<User, 'id'>>) => Promise<{ error?: string }>;
    deleteUser: (id: string) => Promise<{ error?: string }>;

    // Auth
    isAuthenticated: boolean;
    isLoading: boolean;
    isUsersLoading: boolean;
    currentUser: User | null;
    login: (cpf: string, password: string) => Promise<{ error?: string }>;
    logout: () => Promise<void>;
    fetchUsers: () => Promise<void>;

    // App Settings
    bannerImageUrl: string;
    updateBannerImage: (url: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock Data removed as we are using Supabase

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentView, setCurrentView] = useState<ViewType>('dashboard');
    const [patients, setPatients] = useState<Patient[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [schedulingLists, setSchedulingLists] = useState<SchedulingList[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isUsersLoading, setIsUsersLoading] = useState<boolean>(false);
    const [bannerImageUrl, setBannerImageUrl] = useState<string>('');

    const fetchPatients = async () => {
        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .order('name');

        if (data) {
            setPatients(data.map(p => ({
                id: p.id,
                name: p.name,
                cpf: p.cpf,
                phone: p.phone,
                basicHealthUnit: p.basic_health_unit,
                address: p.address,
                susCard: p.sus_card,
                communityAgent: p.community_agent,
                doctorType: p.doctor_type,
                registeredBy: p.registered_by,
                createdAt: new Date(p.created_at),
            })));
        } else if (error) {
            console.error('Error fetching patients:', error);
        }
    };

    const fetchDoctors = async () => {
        const { data, error } = await supabase
            .from('doctors')
            .select('*')
            .order('name');

        if (data) {
            setDoctors(data.map(d => ({
                id: d.id,
                name: d.name,
                cpf: d.cpf,
                specialty: d.specialty,
                crm: d.crm,
                procedures: d.procedures || [],
            })));
        } else if (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const fetchAppointments = async () => {
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .order('date', { ascending: true });

        if (data) {
            setAppointments(data.map(a => ({
                id: a.id,
                patientId: a.patient_id,
                doctorId: a.doctor_id,
                date: a.date,
                time: a.time,
                status: a.status,
                notes: a.notes,
                createdByRole: a.created_by_role,
                createdAt: new Date(a.created_at),
            })));
        } else if (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const fetchSchedulingLists = async () => {
        const { data, error } = await supabase
            .from('scheduling_lists')
            .select('*, scheduling_list_patients(patient_id, status)')
            .order('date', { ascending: true });

        if (data) {
            setSchedulingLists(data.map(l => ({
                id: l.id,
                name: l.name,
                date: l.date,
                doctorId: l.doctor_id,
                doctorType: l.doctor_type || '',
                patientIds: l.scheduling_list_patients?.map((p: any) => p.patient_id) || [],
                patientStatuses: l.scheduling_list_patients?.reduce((acc: any, p: any) => ({ ...acc, [p.patient_id]: p.status }), {}) || {},
            })));
        } else if (error) {
            console.error('Error fetching scheduling lists:', error);
        }
    };

    const fetchUsers = async () => {
        setIsUsersLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('name');

            if (error) {
                console.error('Error fetching users:', error);
            } else if (data) {
                setUsers(data.map(p => ({
                    id: p.id,
                    name: p.name,
                    role: p.role,
                    cpf: p.cpf,
                    establishment: p.establishment || '',
                })));
            }
        } catch (err) {
            console.error('Unexpected error in fetchUsers:', err);
        } finally {
            setIsUsersLoading(false);
        }
    };

    const fetchBannerImage = async () => {
        const { data, error } = await supabase
            .from('app_settings')
            .select('setting_value')
            .eq('setting_key', 'banner_image_url')
            .single();

        if (data && !error) {
            setBannerImageUrl(data.setting_value || '');
        } else if (error) {
            console.error('Error fetching banner image:', error);
        }
    };

    const loadAllData = async () => {
        setIsLoading(true);
        await Promise.all([
            fetchPatients(),
            fetchDoctors(),
            fetchAppointments(),
            fetchSchedulingLists(),
            fetchBannerImage()
        ]);
        setIsLoading(false);
    };

    useEffect(() => {
        if (isAuthenticated) {
            loadAllData();
            if (currentUser?.role === 'administrator') {
                fetchUsers();
            }
        }
    }, [isAuthenticated]);

    useEffect(() => {
        // Check active sessions and sets the user
        const checkSession = async () => {
            setIsLoading(true);
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (profile) {
                    setCurrentUser({
                        id: profile.id,
                        name: profile.name,
                        role: profile.role,
                        cpf: profile.cpf,
                        establishment: profile.establishment || '',
                    });
                    setIsAuthenticated(true);
                }
            }
            setIsLoading(false);
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth event:', event, session?.user?.id);
            if (session?.user) {
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (profile) {
                    console.log('Profile found:', profile);
                    setCurrentUser({
                        id: profile.id,
                        name: profile.name,
                        role: profile.role,
                        cpf: profile.cpf,
                        establishment: profile.establishment || '',
                    });
                    setIsAuthenticated(true);

                    // Set default view based on role if no view is set or if switching roles
                    if (profile.role === 'health_professional') {
                        setCurrentView('appointments_list');
                    } else {
                        setCurrentView('dashboard');
                    }
                } else {
                    console.error('Profile not found for user:', session.user.id, profileError);
                    // If profile is missing but user is authed, we might need to handle this
                    // For now, let's at least not keep them in a loading state
                    setIsAuthenticated(false);
                }
            } else {
                setCurrentUser(null);
                setIsAuthenticated(false);
                setPatients([]);
                setDoctors([]);
                setAppointments([]);
                setUsers([]);
            }
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (cpf: string, password: string) => {
        try {
            console.log('Attempting login for CPF:', cpf);
            let email = '';

            // 1. Find email by CPF
            const cleanedCpf = cpf.replace(/\D/g, '');
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('email')
                .eq('cpf', cleanedCpf)
                .single();

            if (profileError || !profile) {
                console.warn('Profile not found for cleaned CPF:', cleanedCpf, profileError);
                // If not found with clean CPF, try exactly as typed
                const { data: profileAlt, error: profileErrorAlt } = await supabase
                    .from('profiles')
                    .select('email')
                    .eq('cpf', cpf)
                    .single();

                if (profileErrorAlt || !profileAlt) {
                    console.error('Profile not found for exact CPF either:', cpf, profileErrorAlt);
                    return { error: 'Usuário não encontrado com este CPF no banco de dados.' };
                }

                email = profileAlt.email;
            } else {
                email = profile.email;
            }

            console.log('Found email for login:', email);

            // 2. Sign in with email and password
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password: password,
            });

            if (authError) {
                console.error('Auth sign in error:', authError);
                return { error: `Erro na autenticação: ${authError.message}` };
            }

            console.log('Login successful, waiting for session listener...');
            return {};
        } catch (err: any) {
            console.error('Login exception:', err);
            return { error: err.message || 'Erro inesperado ao realizar login.' };
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setIsAuthenticated(false);
        setCurrentUser(null);
        setCurrentView('dashboard');
    };

    const addUser = async (userData: Omit<User, 'id'>) => {
        try {
            console.log('addUser: Início do processo', userData);
            const cleanedCpf = userData.cpf.replace(/\D/g, '').trim();
            const email = ((userData as any).email || `${cleanedCpf}@agenda.com`).trim().toLowerCase();

            console.log(`addUser: Validando existência de e-mail (${email}) ou CPF (${cleanedCpf})`);

            // 1. Check if user already exists in profiles (Atomic check)
            const { data: existingUsers, error: checkError } = await supabase
                .from('profiles')
                .select('email, cpf')
                .or(`email.eq."${email}",cpf.eq."${cleanedCpf}"`)
                .limit(1);

            if (checkError) {
                console.warn('addUser: Erro ao verificar usuário existente:', checkError);
            }

            if (existingUsers && existingUsers.length > 0) {
                const existingUser = existingUsers[0];
                console.log('addUser: Usuário duplicado encontrado:', existingUser);
                if (existingUser.cpf === cleanedCpf) {
                    return { error: 'Este CPF já está cadastrado no sistema.' };
                }
                if (existingUser.email.toLowerCase() === email) {
                    return { error: 'Este e-mail já está em uso por outro usuário.' };
                }
            }

            console.log('addUser: Nenhum duplicado encontrado em profiles, procedendo com signUp');

            // 2. Proceed with signup if not exists
            const tempClient = createClient(supabaseUrl, supabaseKey, {
                auth: {
                    persistSession: false,
                    autoRefreshToken: false,
                    detectSessionInUrl: false
                }
            });

            const { data, error: authError } = await tempClient.auth.signUp({
                email,
                password: userData.password || 'senha123',
                options: {
                    data: {
                        name: userData.name,
                        role: userData.role,
                        cpf: cleanedCpf,
                        establishment: userData.establishment,
                    }
                }
            });

            if (authError) {
                console.error('addUser: Erro no signUp do Supabase Auth:', authError);
                return { error: authError.message };
            }

            if (data.user) {
                console.log('addUser: Usuário criado com sucesso no Auth, aguardando trigger do profile...');
                // Wait a bit for the trigger to create the profile
                await new Promise(resolve => setTimeout(resolve, 3000));
                console.log('addUser: Atualizando lista de usuários...');
                await fetchUsers();
                return {};
            }
            return { error: 'Ocorreu um erro desconhecido ao criar a conta.' };
        } catch (err: any) {
            console.error('addUser: Exceção inesperada:', err);
            return { error: err.message || 'Erro inesperado ao realizar cadastro.' };
        }
    };

    const updateUser = async (id: string, userData: Partial<Omit<User, 'id'>>) => {
        try {
            console.log('updateUser: Início do processo', id, userData);

            // Preparar dados para atualização
            const updateData: any = {};
            if (userData.name) updateData.name = userData.name;
            if (userData.role) updateData.role = userData.role;
            if (userData.cpf) updateData.cpf = userData.cpf.replace(/\D/g, '');
            if (userData.establishment) updateData.establishment = userData.establishment;

            console.log('updateUser: Dados preparados:', updateData);

            // Atualizar no banco de dados
            const { error } = await supabase
                .from('profiles')
                .update(updateData)
                .eq('id', id);

            if (error) {
                console.error('updateUser: Erro ao atualizar:', error);
                return { error: error.message };
            }

            console.log('updateUser: Atualização bem-sucedida, recarregando lista...');
            // Atualizar lista local
            await fetchUsers();
            return {};
        } catch (err: any) {
            console.error('updateUser: Exceção inesperada:', err);
            return { error: err.message || 'Erro inesperado ao atualizar usuário.' };
        }
    };

    const deleteUser = async (id: string) => {
        try {
            console.log('deleteUser: Início do processo', id);

            // Verificar se não está tentando excluir o próprio usuário
            if (id === currentUser?.id) {
                console.warn('deleteUser: Tentativa de excluir próprio usuário');
                return { error: 'Você não pode excluir seu próprio usuário.' };
            }

            // Excluir do banco de dados
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('deleteUser: Erro ao excluir:', error);
                return { error: error.message };
            }

            console.log('deleteUser: Exclusão bem-sucedida, atualizando lista local...');
            // Atualizar lista local
            setUsers(prev => prev.filter(u => u.id !== id));
            return {};
        } catch (err: any) {
            console.error('deleteUser: Exceção inesperada:', err);
            return { error: err.message || 'Erro inesperado ao excluir usuário.' };
        }
    };

    const addPatient = async (patientData: Omit<Patient, 'id' | 'createdAt'>) => {
        const { data, error } = await supabase
            .from('patients')
            .insert([{
                name: patientData.name,
                cpf: patientData.cpf,
                phone: patientData.phone,
                basic_health_unit: patientData.basicHealthUnit,
                address: patientData.address,
                sus_card: patientData.susCard,
                community_agent: patientData.communityAgent,
                doctor_type: patientData.doctorType,
                registered_by: currentUser?.id,
            }])
            .select()
            .single();

        if (error) {
            console.error('Error adding patient:', error);
            return { error: error.message };
        } else {
            if (data) {
                const newPatient: Patient = {
                    id: data.id,
                    name: data.name,
                    cpf: data.cpf,
                    phone: data.phone,
                    basicHealthUnit: data.basic_health_unit,
                    address: data.address,
                    susCard: data.sus_card,
                    communityAgent: data.community_agent,
                    doctorType: data.doctor_type,
                    registeredBy: data.registered_by,
                    createdAt: new Date(data.created_at),
                };
                setPatients(prev => [...prev, newPatient].sort((a, b) => a.name.localeCompare(b.name)));
            }
            return {};
        }
    };

    const updatePatient = async (id: string, patientData: Partial<Omit<Patient, 'id' | 'createdAt'>>) => {
        const mappedData: any = {};
        if (patientData.name) mappedData.name = patientData.name;
        if (patientData.cpf) mappedData.cpf = patientData.cpf;
        if (patientData.phone) mappedData.phone = patientData.phone;
        if (patientData.basicHealthUnit) mappedData.basic_health_unit = patientData.basicHealthUnit;
        if (patientData.address) mappedData.address = patientData.address;
        if (patientData.susCard) mappedData.sus_card = patientData.susCard;
        if (patientData.communityAgent) mappedData.community_agent = patientData.communityAgent;
        if (patientData.doctorType) mappedData.doctor_type = patientData.doctorType;

        const { error } = await supabase
            .from('patients')
            .update(mappedData)
            .eq('id', id);

        if (error) {
            console.error('Error updating patient:', error);
            return { error: error.message };
        } else {
            await fetchPatients();
            return {};
        }
    };

    const deletePatient = async (id: string) => {
        const { error } = await supabase
            .from('patients')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting patient:', error);
        } else {
            setPatients(prev => prev.filter(p => p.id !== id));
        }
    };

    const addAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt'>) => {
        const { data, error } = await supabase
            .from('appointments')
            .insert([{
                patient_id: appointmentData.patientId,
                doctor_id: appointmentData.doctorId,
                date: appointmentData.date,
                time: appointmentData.time,
                status: appointmentData.status,
                notes: appointmentData.notes,
                created_by_role: currentUser?.role,
            }])
            .select()
            .single();

        if (error) {
            console.error('Error adding appointment:', error);
            return { error: error.message };
        } else {
            if (data) {
                const newAppointment: Appointment = {
                    id: data.id,
                    patientId: data.patient_id,
                    doctorId: data.doctor_id,
                    date: data.date,
                    time: data.time,
                    status: data.status,
                    notes: data.notes,
                    createdByRole: data.created_by_role,
                    createdAt: new Date(data.created_at),
                };
                setAppointments(prev => [...prev, newAppointment].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
            }
            return {};
        }
    };

    const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
        const { error } = await supabase
            .from('appointments')
            .update({ status })
            .eq('id', id);

        if (error) {
            console.error('Error updating appointment status:', error);
        } else {
            setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
        }
    };

    const addSchedulingList = async (listData: Omit<SchedulingList, 'id'>) => {
        const { data, error } = await supabase
            .from('scheduling_lists')
            .insert([{
                name: listData.name,
                date: listData.date,
                doctor_id: listData.doctorId,
                doctor_type: listData.doctorType,
                created_by: currentUser?.id,
            }])
            .select()
            .single();

        if (error) {
            console.error('Error adding scheduling list:', error);
            return { error: error.message };
        } else if (data) {
            // Also add initial patients if any
            if (listData.patientIds && listData.patientIds.length > 0) {
                const mappings = listData.patientIds.map(pid => ({
                    list_id: data.id,
                    patient_id: pid
                }));
                const { error: junctionError } = await supabase.from('scheduling_list_patients').insert(mappings);
                if (junctionError) {
                    console.error('Error adding patients to list:', junctionError);
                }
            }
            await fetchSchedulingLists();
            return {};
        }
        return { error: 'Ocorreu um erro desconhecido.' };
    };

    const deleteSchedulingList = async (id: string) => {
        const { error } = await supabase
            .from('scheduling_lists')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting scheduling list:', error);
        } else {
            setSchedulingLists(prev => prev.filter(l => l.id !== id));
        }
    };

    const addPatientToList = async (listId: string, patientId: string) => {
        const { error } = await supabase
            .from('scheduling_list_patients')
            .insert([{
                list_id: listId,
                patient_id: patientId
            }]);

        if (error) {
            console.error('Error adding patient to list:', error);
        } else {
            // If administrator, also create an appointment automatically as per previous logic
            if (currentUser?.role === 'administrator') {
                const list = schedulingLists.find(l => l.id === listId);
                if (list) {
                    await addAppointment({
                        patientId: patientId,
                        doctorId: list.doctorId,
                        date: list.date,
                        time: 'A definir (Lista: ' + list.name + ')',
                        status: 'scheduled',
                        createdByRole: 'administrator',
                    });
                }
            }
            fetchSchedulingLists();
        }
    };

    const updatePatientStatusInList = async (listId: string, patientId: string, status: 'postponed' | 'desisted' | null) => {
        const { error } = await supabase
            .from('scheduling_list_patients')
            .update({ status })
            .match({ list_id: listId, patient_id: patientId });

        if (error) {
            console.error('Error updating patient status in list:', error);
        } else {
            setSchedulingLists(prev => prev.map(l => {
                if (l.id === listId) {
                    return {
                        ...l,
                        patientStatuses: {
                            ...l.patientStatuses,
                            [patientId]: status
                        }
                    };
                }
                return l;
            }));
        }
    };

    const removePatientFromList = async (listId: string, patientId: string) => {
        const { error } = await supabase
            .from('scheduling_list_patients')
            .delete()
            .match({ list_id: listId, patient_id: patientId });

        if (error) {
            console.error('Error removing patient from list:', error);
        } else {
            fetchSchedulingLists();
        }
    };

    const addDoctor = async (doctorData: Omit<Doctor, 'id'>) => {
        const { data, error } = await supabase
            .from('doctors')
            .insert([{
                name: doctorData.name,
                cpf: doctorData.cpf,
                specialty: doctorData.specialty,
                crm: doctorData.crm,
                procedures: doctorData.procedures,
            }])
            .select()
            .single();

        if (error) {
            console.error('Error adding doctor:', error);
            return { error: error.message };
        } else {
            if (data) {
                const newDoctor: Doctor = {
                    id: data.id,
                    name: data.name,
                    cpf: data.cpf,
                    specialty: data.specialty,
                    crm: data.crm,
                    procedures: data.procedures || [],
                };
                setDoctors(prev => [...prev, newDoctor].sort((a, b) => a.name.localeCompare(b.name)));
            }
            return {};
        }
    };

    const deleteDoctor = async (id: string) => {
        const { error } = await supabase
            .from('doctors')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting doctor:', error);
        } else {
            setDoctors(prev => prev.filter(d => d.id !== id));
        }
    };

    const updateBannerImage = async (url: string) => {
        const { error } = await supabase
            .from('app_settings')
            .update({
                setting_value: url,
                updated_at: new Date().toISOString(),
                updated_by: currentUser?.id
            })
            .eq('setting_key', 'banner_image_url');

        if (!error) {
            setBannerImageUrl(url);
        } else {
            console.error('Error updating banner image:', error);
        }
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
                updatePatientStatusInList,
                users,
                isAuthenticated,
                isLoading,
                isUsersLoading,
                currentUser,
                login,
                logout,
                addUser,
                updateUser,
                deleteUser,
                fetchUsers,
                bannerImageUrl,
                updateBannerImage,
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
