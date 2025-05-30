export interface TimeSlot {
    id: number;
    doctor_profile_id: number;
    date: number;
    time: number;
    duration: number;
    is_booked: boolean;
}
