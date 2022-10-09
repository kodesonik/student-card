import { Url } from 'url';
export default interface Establishment  {
    id?: string;
    logo: string | Url;
    name: string;
    poBOX: string;
    phoneNumber: string;
    phoneNumber2?: string;
    address: string;
    inspection: string;
    createdAt?;
}
