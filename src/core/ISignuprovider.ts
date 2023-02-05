import { Document } from "mongoose";

// IInstituteProvider
export interface ISignup extends Document {
  name: string;
  email: string;
  address: string;
  phone: string;
  institute_name:string,
  institute_type:string
}

// Signup provider responsible for CRUD operations and any specific operations
export interface ISignupProvider {
  /**
   * Get specific Signup details
   * @param id of the Signed up user
   */
  getById(id: string): Promise<ISignup>;

  /**
   * Create User
   * @param name of the USer
   * @param address of the User
   * @param email of the User
   * @param phone number of the User
   */
  create(
    name: string,
    email: string,
    address: string,
    phone: string,
    instituteName:string,
    instituteType:string
  ): Promise<ISignup>;

  /**
   * Update Users info
   * @param name of the USer
   * @param address of the User
   * @param email of the User
   * @param phone number of the User
   */

  update(
    name: string,
    email: string,
    address: string,
    phone: string,
    instituteName:string,
    instituteType:string,
    id: string
  ): Promise<ISignup>;

  /**
   * Delete a User if needed
   * @param id of the User to delete
   */
  delete(id: string): Promise<ISignup>;
}
