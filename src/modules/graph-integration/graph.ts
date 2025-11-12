import axios from "axios";
import Logger from "../../utils/logger";
import { createPerson, createWallet, updatePerson, uploadDocuments } from "./interfaces/graph.interface";



export default class GraphIntegration {
    private logger = new Logger('graph-integration');

    createPerson = async(payload: createPerson) => {
        const url = `${process.env.GRAPH_BASE_URL}/person`;
        const body = {
            name_first: payload.firstName,
            name_last: payload.lastName,
            name_other: payload.otherName,
            phone: payload.phone,
            email: payload.email,
            dob: payload.dob,
            id_level: payload.idLevel,
            id_type: payload.idType,
            id_number: payload.idNumber,
            id_country: payload.countryId,
            bank_id_number: payload.bankIdNumber,
            kyc_level: payload.kycLevel,
            address: {
                line1: payload.address.address,
                city: payload.address.city,
                state: payload.address.state,
                country: payload.address.country,
                postal_code: payload.address.postal_code
            },
            background_information: {
                employment_status: payload.background_information?.employment_status,
                occupation: payload.background_information?.occupation,
                primary_purpose: payload.background_information?.primary_purpose,
                source_of_funds: payload.background_information?.source_of_funds,
                expected_monthly_inflow: payload.background_information?.expected_monthly_inflow
            },
        }
        try {
            const response = await axios.post(url, body, {
                headers: {
                Authorization: `Bearer ${process.env.GRAPH_API_KEY}`,
                'Content-Type': 'application/json',
            },
            
        });
        
        return { 
            message: "Transaction Successful",
            data: response.data 
        };
        } catch (err) {
            const message = axios.isAxiosError(err)
                ? err.response?.data?.message || err.message
                : (err as Error).message;

            this.logger.error("Graph API Error:", message);
            throw new Error(message);
            }
        };

    updatePerson = async (payload: updatePerson, personId: string) => {
        const url = `${process.env.GRAPH_BASE_URL}/person/${personId}`;
            const body = {
                background_information: {
                    employment_status: payload.employmentStatus,
                    occupation: payload.occupation,
                    primary_purpose: payload.primaryPurpose,
                    source_of_funds: payload.sourceOfFunds,
                    expected_monthly_inflow: payload.expectedMonthlyInflow
                }
            }
            try {
                const response = await axios.patch(url, body, {
                    headers: {
                        Authorization: `Bearer ${process.env.GRAPH_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                });
                    return { 
                        message: "Person data updated Successfully",
                        data: response.data 
                };
            }
            catch (err) {
                const message = axios.isAxiosError(err)
                    ? err.response?.data?.message || err.message
                    : (err as Error).message;

                this.logger.error("Graph API Error:", message);
                throw new Error(message);
            }
    };

    uploadDocument = async (personId: string, payload: uploadDocuments) => {
        const url = `${process.env.GRAPH_BASE_URL}/entity_document`;
        const body = {
            entity_type: payload.type,
            // person_id: paylo"",
            business_id: "",
            type: "",
            url: "",
            issuance_date: "",
            expiry_date: ""
        }

        try{
            const response = await axios.post(url, body, {
                headers: {
                    Authorization: `Bearer ${process.env.GRAPH_API_KEY}`,
                    'Content-Type': 'application/json',
                }
            });
            return { 
                    message: "Transaction Successful",
                    data: response.data 
            };
        }
        catch (err) {
            const message = axios.isAxiosError(err)
                ? err.response?.data?.message || err.message
                : (err as Error).message;

            this.logger.error("Graph API Error:", message);
            throw new Error(message);
        }
    }
    requestAccount = async (payload: createWallet) => {
        const url = `${process.env.GRAPH_BASE_URL}/bank_account`;
        const body = {
            person_id: payload.personId,
            label: payload.label,
            currency: payload.currency,
            autosweep_enabled: true, 
            whitelist_enabled: false
        }
        console.log(body)
        try {
            const response = await axios.post(url, body, {
                headers: {
                    Authorization: `Bearer ${process.env.GRAPH_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            });
                return { 
                    message: "Transaction Successful",
                    data: response.data 
            };
        }
        catch (err) {
            const message = axios.isAxiosError(err)
                ? err.response?.data?.message || err.message
                : (err as Error).message;

            this.logger.error("Graph API Error:", message);
            throw new Error(message);
            }
    };
    
    getPerson = async ( ) => {
        const url = `${process.env.GRAPH_BASE_URL}/person/35d03975bb8611f0a28f0e74f6457b17`
        try {
            const response = await axios.get(url, {
                headers: {
                Authorization: `Bearer ${process.env.GRAPH_API_KEY}`,
                'Content-Type': 'application/json',
                Environment: process.env.GRAPH_ENV
            },
        });
        return { 
            message: "Person data retrieved",
            data: response.data 
        };
        } catch (err) {
            this.logger.error("Something went wrong while connecting to graph...", {
                reason: err
        });
        }
    }
    
    getAccount = async (accountId: string) => {
       const url = `${process.env.GRAPH_BASE_URL}/bank_account/${accountId}`
        try {
            const response = await axios.post(url, {
                headers: {
                Authorization: `Bearer ${process.env.GRAPH_API_KEY}`,
                'Content-Type': 'application/json',
                Environment: process.env.GRAPH_ENV
            },
        });

        return { 
            message: "account data retrieved",
            data: response.data 
        };
        } catch (err) {
        const message = axios.isAxiosError(err)
            ? err.response?.data?.message || err.message
            : (err as Error).message;

        this.logger.error("Graph API Error:", message);
        throw new Error(message);
        }
    }


    // ====== GRAPH WEBHOOKS ======

    
}