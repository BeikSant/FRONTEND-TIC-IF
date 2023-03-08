import { defineStore } from 'pinia';
import { api } from 'src/boot/axios'
import { ref } from 'vue'

export const useAuthStore = defineStore("auth", () => {

    const token = ref(null);
    const expiresIn = ref(null);
    const rol = ref(null);

    const login = async (email, password) => {
        try {
            const res = await api.post("/user/login", {
                username: email,
                password: password
            });
            token.value = res.data.token;
            expiresIn.value = res.data.expiresIn
            rol.value = res.data.rol
            sessionStorage.setItem('user', res.data.rol)
            setTime();
            return { status: res.status }
        } catch (e) {
            if (e.response) {
                return { status: e.response.status, message: e.response.data.message }
            } else {
                return { status: 500, message: "Error interno del servidor" }
            }
        }
    }

    const refreshToken = async () => {
        try {
            const res = await api.get('/user/refresh');
            token.value = res.data.token
            expiresIn.value = res.data.expiresIn
            rol.value = res.data.rol
            sessionStorage.setItem('user', res.data.rol)
            setTime();
        } catch (e) {
            sessionStorage.removeItem("user");
        }
    }

    const setTime = () => {
        setTimeout(() => {
            refreshToken();
        }, expiresIn.value * 1000 - 6000)
    }

    const logout = async () => {
        try {
            await api.get("/user/logout");
            resetStore();
        } catch (error) {
        }
    };

    const resetStore = () => {
        token.value = null;
        expiresIn.value = null;
        rol.value = null
        sessionStorage.removeItem('user');
    };

    return {
        login,
        refreshToken,
        token,
        expiresIn,
        rol,
        logout,
    }

});