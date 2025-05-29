export interface TimeSlot {
    id: number;
    doctor_profile_id: number;
    date: Date;
    time: Date;
    duration: number;
    is_booked: boolean;
}
