import { ClientType } from "../../components/clientManagement/ClientTypes"

type ClientFormValues = {
    name: string,
    surname: string,
    clientType: ClientType,
    street: string,
    // zip: number,
    city: string,
    country: string,
    // dateOfBirth: Date,
    // nrOfCounselings: number,
    // AuMs: number
}

export type {ClientFormValues}