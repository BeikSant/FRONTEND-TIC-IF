import { useAuthStore } from "src/stores/auth-stores"

export default {
    headers() {
        const authStore = useAuthStore()
        return {
            headers: { Authorization: `Bearer ${authStore.token}` }
        }
    }
}