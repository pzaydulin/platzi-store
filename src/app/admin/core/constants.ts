import { environment as env} from "../../../environments/environment";

export const apiEndpoint = {
    AUTH: {
        LOGIN: env.apiUrl + '/api/v1/auth/login',
        PROFILE: env.apiUrl + '/api/v1/auth/profile',
        REFRESH_TOKEN: env.apiUrl + '/api/v1/auth/refresh-token',
    },
    PRODUCTS: {
        LIST: env.apiUrl + '/api/v1/products',
        DETAIL: env.apiUrl + '/api/v1/products',
        CREATE: env.apiUrl + '/api/v1/products',
        UPDATE: env.apiUrl + '/api/v1/products',
        DELETE: env.apiUrl + '/api/v1/products',
    },
    CATEGORIES: {
        LIST: env.apiUrl + '/api/v1/categories',
        CREATE: env.apiUrl + '/api/v1/categories',
        UPDATE: env.apiUrl + '/api/v1/categories',
        DELETE: env.apiUrl + '/api/v1/categories',
    }

};
