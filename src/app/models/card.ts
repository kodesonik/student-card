import { Url } from 'url';
import { Level, Serie } from './../types';
export default interface Card {
    id: string;
    avatar: string | Url;
    firstName: string;
    lastName: string;
    sex: string;
    birthDate: string;
    contact: string;
    schoolYear: string;
    establishmentName: string;
    level: Level;
    serie: Serie;
    managerSex: string;
    managerName: string;
    signature: string | Url;
}
