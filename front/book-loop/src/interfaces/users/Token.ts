export interface DecodedToken {
    _id: string;
    isAdmin?: boolean;
    iat?: number;
    exp?: number;
}