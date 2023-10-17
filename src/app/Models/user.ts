import { Role } from "./role";

export class User {
    _id: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    role: Role;
    token?: string;
}