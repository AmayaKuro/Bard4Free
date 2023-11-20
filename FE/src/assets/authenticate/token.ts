import { BackendFetch } from "../fetch/BE";

export const refreshAccessToken = async (refreshToken?: string) => {
    // If no refresh token, throw error
    if (!refreshToken) {
        throw new Error("No refresh token");
    }

    try {
        const response = await BackendFetch("/token/refresh/", {
            method: "POST",
            body: {
                refresh: refreshToken,
            },
        });

        if(response.status !== 200) throw new Error("Cannot authenticate");

        return await response.json();
    }
    // If cannnot get a new access token, sign out
    catch (e) {
        // Throw error can lead to error in app
        throw new Error("Cannot authenticate");
    }
};


export const getCurrentEpochTime = () => {
    return Math.floor(Date.now() / 1000);
};