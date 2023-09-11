import Api from "../services/api";

export default {
    register(credentials) {
        return Api().post('employees/register', credentials)
    },
    login(credentials) {
        return Api().post('authentication/login', credentials)
    },
    forgotPassword(user_details) {
        return Api().post('passwords/forgot_password', user_details)
    },
    resetPassword(user_details) {
        return Api().post('passwords/reset_password', user_details)
    },
    updatePassword(credentials, user_id) {
        return Api().put(`passwords/update_password/${user_id}`, credentials)
    }
}