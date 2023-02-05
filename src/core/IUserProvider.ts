import { Document } from "mongoose";


export interface ISession extends Document {
    mobile: string,
    refreshToken: string,
}

export interface IOtp extends Document {
    mobile: string,
    otp: string,
}


export enum Club {
    BananiClub = "Banani Club",
    KhulnaClub = "Khulna Club",
    BoatClub = "Boat Club",
    GulshanClub = "Gulshan Club"
}

export enum Role {
    Superadmin = "Superadmin",
    Admin = "Admin",
    Member = "Member",
}

export enum Department {
    Accounts = "Accounts",
    Finance = "Finance",
    Restaurant = "Restaurant"
}

export enum MembershipType {
    Affiliated = "Affiliated",
    Associate = "Associate",
    Corporate = "Corporate",
    Donor = "Donor",
    Foreign = "Foreign",
    Guest = "Guest",
    Honorary = "Honorary",
    LifeTime = "Life Member",
    Parmanent = "Parmanent"
}

export interface EmbededUser {
    _id: string,
    name: string,
    email: string,
    mobile: string,
    membershipType: MembershipType,
    image: string
}

export interface IUserToken {
    id: string,
    name: string,
    email: string,
    mobile: string,
    department: Department,
    role: Role,
    signedAt: Date
}


export interface IUser extends Document {
    name: string,
    email: string,
    mobile: string,
    password: string,
    role: Role,
    membershipType: MembershipType,
    department: Department,
    image: string,
    club: Club,
    isActive: boolean
}

export interface IUserPage {
    users: IUser[], // User List
    size: number,   // Page size (Max users per page)
    page: number,   // Current page number
    count: number   // Total number of users
}


export interface IUserProvider {
    /**
     * Get an user by email address
     * @param email to look for
     */
    get(mobile: string): Promise<IUser>;


    /**
     * Get an user by id
     * @param getById to look for
     */
    getById(id: string): Promise<IUser>;


    getEmbededUserById(id: string): Promise<EmbededUser>;

    /**
     * List users (Should be by role and page)
     */
    list(instituteId: string, roles?: Role[], page?: number, size?: number, name?: string): Promise<IUserPage>;

    /**
     * Create a new user based on
     * @param name of the User
     * @param email address of the User
     * @param role of the User
     */
    create(name: string, email: string, mobile: string, role: Role, membershipType: MembershipType, department: Department.Accounts, image: string, club: Club): Promise<IUser>;

    /**
     * Do we need Update? I don't see a case where you would let them change email or name
     * we can simpley `let user = get(email);` then `user.role = Role.Fellow;` `user.save()` instead
     */

    // update(name: string, email: string, role: Role, id: string): Promise<IUser>;



    delete(id: string): Promise<IUser>;

    disable(email: string): Promise<void>;

    enable(email: string): Promise<void>;



    /**
     * To create an user session by phone number
     * @param mobile to create for
     * @param refreshToken to create for
     */

    createSession(mobile: string, refreshToken: string ): Promise<ISession>;
    checkSession(refreshToken: string): Promise<ISession>;
    createOTPSession(mobile: string, otp: string): Promise<IOtp>;
    checkOTPSession(mobile: string, otp: string): Promise<IOtp>;
    removeOTPSession(mobile: string): Promise<boolean>;






}