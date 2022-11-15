import { Url } from 'url';
import { Level, Serie } from './../types';
export default interface Card {
    id: string;
    logo: string;
    avatar: string | Url;
    firstName: string;
    lastName: string;
    sex: string;
    birthDate: string;
    birthPlace: string;
    birthCountry?: string;
    contact: string;
    schoolYear: string;
    establishmentName: string;
    establishmentContact: string;
    level: Level;
    serie: Serie;
    classNum?: string;
    managerSex: string;
    managerName: string;
    signature: string | Url;
    theme?: string;
}
