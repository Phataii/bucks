import { Types } from "mongoose";

export interface personDTO {
    currency: string; // NGN, USD, EUR
    idType: string;
    idNumber: string;
    bvn: string;
}

export interface createPerson {
    firstName: string;
    lastName: string;
    otherName: string;
    phone: string;
    email: string;
    dob: string;
    idLevel: string;
    idType: string;
    idNumber: string;
    bankIdNumber: string;
    kycLevel: string;
    countryId: string;
    address: {
        address: string;
        city: string,
        state: string,
        country: string,
        postal_code: string;
    };
    background_information?: {
        employment_status?: string,
        occupation?: string,
        primary_purpose?: string,
        source_of_funds?: string,
        expected_monthly_inflow?: number
    },
}

export interface updatePerson {
    employmentStatus: string;
    occupation: string;
    primaryPurpose: string;
    sourceOfFunds: string;
    expectedMonthlyInflow: number;
    documents?: documents[]
}

export interface documents {
    type: string;
    url: string;
    issueDate: string;
    expiryDate: string;
}
export interface createWallet {
    personId: string;
    label: string;
    currency: string;
}