export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    errors?: { path: string; message: string }[];
}