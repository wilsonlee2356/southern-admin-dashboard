export type user = {
    uid: string;
    sn: string;
    cn: string;
    roles: string[];
}

export type userCreateType = {
    username: string;
    password: string;
    cn: string;
    sn: string;
    role: string;
}