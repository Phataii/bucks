import { model, Schema } from "mongoose";



export interface IBanks extends Document {
    name: string;
    code: string;
    country: string;
}



const banksSchema = new Schema<IBanks>(
    {
        name: { type: String },
        code: { type: String },
        country: { type: String, default: "NG" }

    })

    
const Banks = model<IBanks>("Banks", banksSchema);

export default Banks;