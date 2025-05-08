export type Appointment = {
    id: string;
    patient_id: number;
    doctor_id: string;
    appointment_time: string;
    appointment_date: string;
    status: 'scheduled' | 'canceled' | 'completed';
    appointment_type: string;
    diagnosis?: string;
    file_url?: string;
    comment?: string;
    created_at: string;
    updated_at: string;
};
