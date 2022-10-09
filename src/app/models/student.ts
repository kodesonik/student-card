import { Url } from 'url';
import { Sex } from './../types/';
export default interface Student {
    avatar: string | Url;
    id: string;
    firstName: string;
    lastName: string;
    sex: Sex;
    birthDate: string;
    birthPlace: string;
    phoneNumber: string;
    nationality: string;
    classRoomId: string;
    createdAt?;
    isChecked?;
}
