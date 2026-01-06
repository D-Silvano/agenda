import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const AppointmentBooking: React.FC = () => {
    const { patients, doctors, addAppointment } = useApp();
    const [selectedPatient, setSelectedPatient] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    const timeSlots = [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
        '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedPatient || !selectedDoctor || !selectedDate || !selectedTime) {
            alert('Por favor, preencha todos os campos');
            return;
        }

        addAppointment({
            patientId: selectedPatient,
            doctorId: selectedDoctor,
            date: selectedDate,
            time: selectedTime,
            status: 'scheduled',
        });

        // Reset form
        setSelectedPatient('');
        setSelectedDoctor('');
        setSelectedDate('');
        setSelectedTime('');

        alert('Consulta agendada com sucesso!');
    };

    return (
        <div className="card max-w-2xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Agendar Nova Consulta</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="input-label">Selecione o Paciente *</label>
                    <select
                        value={selectedPatient}
                        onChange={(e) => setSelectedPatient(e.target.value)}
                        className="input"
                        required
                    >
                        <option value="">Escolha um paciente</option>
                        {patients.map((patient) => (
                            <option key={patient.id} value={patient.id}>
                                {patient.name} - {patient.cpf}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="input-label">Selecione o Médico *</label>
                    <select
                        value={selectedDoctor}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        className="input"
                        required
                    >
                        <option value="">Escolha um médico</option>
                        {doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                                {doctor.name} - {doctor.specialty}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="input-label">Data da Consulta *</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="input"
                        min={new Date().toISOString().split('T')[0]}
                        required
                    />
                </div>

                <div>
                    <label className="input-label">Horário *</label>
                    <div className="grid grid-cols-4 gap-2">
                        {timeSlots.map((time) => (
                            <button
                                key={time}
                                type="button"
                                onClick={() => setSelectedTime(time)}
                                className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${selectedTime === time
                                    ? 'bg-gold-DEFAULT text-white border-gold-dark shadow-sm'
                                    : 'bg-white text-brown-900 border-gold-200 hover:border-gold-light hover:bg-gold-50/50'
                                    }`}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <button type="submit" className="btn btn-primary">
                        Confirmar Agendamento
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedPatient('');
                            setSelectedDoctor('');
                            setSelectedDate('');
                            setSelectedTime('');
                        }}
                        className="btn btn-secondary"
                    >
                        Limpar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AppointmentBooking;
