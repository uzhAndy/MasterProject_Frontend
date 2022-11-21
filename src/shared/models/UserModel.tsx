import { Role } from "./loginform"

type User = {
    uuid: number,
    username: string,
    accepted: boolean,
    role: Role,
}


export type { User }