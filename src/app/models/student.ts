import { Url } from 'url';
import { Sex } from './../types/';
export default interface Student {
    avatar: string;
    id: string;
    firstName: string;
    lastName: string;
    sex: Sex;
    birthDate: string;
    birthPlace: string;
    birthCountry?: string;
    phoneNumber: string;
    nationality: string;
    classRoomId: string;
    createdAt?;
    isChecked?;
}
