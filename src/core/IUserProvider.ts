import { Document } from "mongoose";

export enum Role {
    Admin = "Admin",
    Moderator = "Moderator",
    User = "User"
}

export interface EmbededUser {
    id: string,
    fullName: string,
}


export interface IUser extends Document {
    fullName: string,
    email: string,
    password: string,
    avatar: string,
    role: Role,
    isActive: boolean,
}

export interface ISession extends Document {
    email: string,
    refreshToken: string,
}

export interface IUserToken {
    id: string,
    name: string,
    email: string,
    role: Role,
    signedAt: Date,
    remember: boolean,
    check: string
}


export interface IUserPage {
    size: number,
    page: number,
    count: number,
    data: IUser[]
}


export interface IUserProvider {

    count(): Promise<number>;

    /**
     * Get an user by phone number
     * @param email to look for
     */

    get(email: string): Promise<IUser>;

    getAll(page:number, size:number): Promise<IUserPage>;

    /**
     * To create an new user
     * @param fullName to create for
     * @param email to create for
     * @param password to create for
     * @param role to create for
     */
    create(fullName: string, email: string, password: string, role: Role): Promise<IUser>;

    /**
     *
     * @param id of user
     */
    getById(id: string): Promise<IUser>

    /**
     * To create an user session by email
     * @param email to create for
     * @param refreshToken to create for
     */
    createSession(email: string, refreshToken: string ): Promise<ISession>;

    checkSession(refreshToken: string): Promise<ISession>;

}