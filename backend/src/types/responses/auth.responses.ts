// Type definitions for responses related to authentication
export interface RegisterResponseData {
    user: {
        _id: string,
        email: string,
        username: string,
    }
}
export interface LoginResponseData {
    accessToken: string,
    user: {
        _id: string,
        email: string,
        username: string,
    }
}

export interface CheckAuthResponseData {
    user: {
        _id: string,
        email: string,
        username: string,
    }
}

export interface RefreshTokenResponseData {
    accessToken: string,
}