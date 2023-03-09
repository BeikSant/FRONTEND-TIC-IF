
import Cookies from "js-cookie"

export default {
    headers() {
        return {
            headers: { Authorization: `Bearer ${Cookies.get('auth-informefinal')}` }
        }
    }
}