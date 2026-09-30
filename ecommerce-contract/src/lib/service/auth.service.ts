import type { UserType } from "@/auth/types";

import { http } from "../baseRequest";

const authService = {
    createUser: (data: { publicAddress: string }): Promise<UserType> =>
        http.axios.request({
            method: 'POST',
            url: `/auth/create`,
            data,
        }),

    authenticate: (data: { publicAddress: string, signature: string }) =>
        http.axios.request({
            method: 'POST',
            url: `/auth/verify`,
            data,
        }),

    getMe: (): Promise<UserType> =>
        http.axios.request({
            method: 'GET',
            url: `/users/me`,
        }),

    becomeAffiliate: (): Promise<UserType> =>
        http.axios.request({
            method: 'POST',
            url: `/users/me/become-affiliate`,
        }),

    logout: (): Promise<{ success: boolean }> =>
        http.axios.request({
            method: 'POST',
            url: '/auth/sign-out',
        }),
};

export default authService;
