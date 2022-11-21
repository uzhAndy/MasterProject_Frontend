import { Role } from '../shared/models/loginform'

export interface ClientState{
    clientId: string | unknown
    firstname: string | unknown
    lastname: string | unknown
}

export interface UserState {
    uuid: number | unknown
    username: string | unknown
    role: Role | unknown
  }
  
export interface Consult {
    sidebarOpen: boolean
    riskQuestionnaireCompleted: boolean
    explanationDialogOpen: boolean
  }
  