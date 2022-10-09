import { Url } from 'url';
import { Sex } from '../types';

export default interface SchoolYear {
    id?: string;
    start: number;
    end: number;
    managerName: string;
    managerSex: Sex;
    signature: string | Url;
    createdAt?;
}
