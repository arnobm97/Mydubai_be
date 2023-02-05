import { IUserProvider, IUser, Role, IUserPage, EmbededUser, MembershipType, Department, Club, IOtp, ISession } from "../core/IUserProvider";
import UserModel from "../models/UserModel";
import SessionModel from "../models/SessionModel";
import OtpModel from "../models/OtpModel";



export class UserProvider implements IUserProvider {

    public async list(instituteId: string, roles:Role[] = [], page:number = 1, size:number = 20, name?: string): Promise<IUserPage> {
        let filter: any = {
            role: { $in: roles },
            "institute._id": { $in: instituteId }
        };

        if(name) {
            filter = {...filter, name: { $regex: name, $options: 'i' }};
        }

        return {
            users: await UserModel.find(filter).skip(size * (page - 1)).limit(size),
            size,
            page,
            count: await UserModel.countDocuments(filter)
        };
    }

    public async get(mobile: string): Promise<IUser> {
        return await UserModel.findOne({ "mobile": mobile }).catch(err => null);
    }

    public async getById(id: string): Promise<IUser> {
        return await UserModel.findById(id).catch(err => null);
    }



    public async getEmbededUserById(id: string): Promise<EmbededUser> {
        return await UserModel.findById(id).select({"_id": 1, "name": 1, "email": 1}).catch(err => null);
    }

    public async create(name: string, email: string, mobile: string, role: Role, membershipType: MembershipType, department: Department.Accounts, image: string, club: Club): Promise<IUser> {
        return await UserModel.create({
            name,
            email,
            mobile,
            password: "xr4@rdaVrWe234c",
            role,
            membershipType,
            department,
            image,
            club,
            isActive: false
        });
    }

    /**
     * Do we need Update? I don't see a case where you would let them change email or name
     * we can simpley `let user = get(email);` then `user.role = Role.Fellow;` `user.save()` instead
     * Additionally if you do this, password will be invalid, because password is calculated based on `email` and password
     */
    /*public async update(name: string, email: string, type: Role, id: string): Promise<IUser> {
        return await UserModel.updateOne(
            {
                _id: id
            },
            {
                name,
                email,
                role: type
            }
        );
    }*/








    public async delete(id: string): Promise<IUser> {
        return await UserModel.findByIdAndDelete(id);
    }


    public async disable(email: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async enable(email: string): Promise<void> {
        throw new Error("Method not implemented.");
    }



    public async createSession(mobile: string, refreshToken: string): Promise<ISession> {
        const session: any = await SessionModel.findOne({ "mobile": mobile });
        if (session) {
            await SessionModel.updateOne({ mobile }, { refreshToken });
            return await SessionModel.findOne({ "mobile": mobile });
        } else {
            return await SessionModel.create({ mobile, refreshToken });
        }
    }


    public async checkSession(refreshToken: string): Promise<ISession> {
        return await SessionModel.findOne({ "refreshToken": refreshToken }).catch(err => null);
    }


    public async createOTPSession(mobile: string, otp: string): Promise<IOtp> {
        const hasOtp: any = await OtpModel.findOne({ "mobile": mobile });
        if (hasOtp) {
           // return await OtpModel.updateOne({ mobile }, { otp })
        } else {
            return await OtpModel.create({ mobile, otp });
        }
    }

    public async checkOTPSession(mobile: string, otp: string): Promise<IOtp> {
        return await OtpModel.findOne({ "mobile": mobile, "otp": otp }).catch(err => null);
    }

    public async removeOTPSession(mobile: string): Promise<boolean> {
        try {
            await OtpModel.deleteOne({ "mobile": mobile });
            return true;
        } catch (error) {
            return false;
        }
    }







}