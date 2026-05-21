export interface UserInterface {
    name: string, 
    email: string,
    password: string,
    role?: 'maintainer' | 'contributor',
}

