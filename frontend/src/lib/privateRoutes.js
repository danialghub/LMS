import { privateAxios } from "./axios";
import { useAuthStore } from '@/store/useAuthStore'

class AxiosPrivateService {
    static instance = null;
    static refreshPromise = null;

    static getInstance() {
        if (!this.instance) {
            this.instance = privateAxios

            this.setupInterceptors();
        }
        return this.instance;
    }

    static setupInterceptors() {

        this.instance.interceptors.request.use(
            (config) => {
                const token = useAuthStore.getState().token;
                if (token && !config.headers["Authorization"]) {
                    config.headers["Authorization"] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        this.instance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const prevRequest = error?.config;

                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;

                    if (!this.refreshPromise) {
                        this.refreshPromise = await useAuthStore.getState().issueRefreshToken();
                    }

                    try {
                        const newToken = this.refreshPromise;
                        prevRequest.headers["Authorization"] = `Bearer ${newToken}`;
                        

                        return this.instance(prevRequest);
                    } finally {
                        this.refreshPromise = null;
                    }
                }

                return Promise.reject(error);
            }
        );
    }
}
export const privateRoutes = AxiosPrivateService.getInstance();