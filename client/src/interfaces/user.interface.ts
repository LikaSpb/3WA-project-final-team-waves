export interface IUser {
	_id?: string
	firstname: string
	profilePicture: string
	lastname: string
	dateOfBirth?: Date
	email: string
	jobTitle?: string
	company?: string
	password: string
	role?: IUserRole
	token?: string
	agent?: string
	currentUser?: IUser
	connected?: boolean
  }
  
  export enum IUserRole {
	ADMIN = 2,
	AUTHENTIFICATED = 1,
	PUBLIC = 0,
  }
  