import { User as AppUser } from "./typings";

declare global {
  namespace Express {
    interface User extends AppUser {}
  }
}

declare module "otp-generator";
