import { Serie } from './../types/serie';
import { Level } from '../types/level';

export default interface ClassRoom  {
    id?: string;
    level: Level;
    serie: Serie;
    num?: string;
    createdAt?;
}
