
export interface signUpDTO {
    firstName: string;
    lastName: string;
    otherName?: string;
    username?: string;
    phone: string;
    dob: string;
    gender: string;
    email: string;
    password: string;
    referralBy?: string;
    address: address;
}

interface address {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
}

export interface loginDTO {
    email: string;
    password: string;
}