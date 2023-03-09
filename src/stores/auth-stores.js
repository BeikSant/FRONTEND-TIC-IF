import { defineStore } from 'pinia';
import { api } from 'src/boot/axios'
import Cookies from 'js-cookie';

export const useAuthStore = defineStore("auth", () => {
    const login = async (email, password) => {
        try {
            const res = await api.post("/user/login", {
                username: email,
                password: password
            });
            Cookies.set('auth-informefinal')

        } catch (e) {
            if (e.response) {
                return { status: e.response.status, message: e.response.data.message }
            } else {
                return { status: 500, message: "Error interno del servidor" }
            }
        }
    }

    return {
        login,
    }

});