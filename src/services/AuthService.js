import Api from "../services/api";

export default {
    register (credentials) {
        return Api().post('register', credentials)
    },
    login (credentials) {
        return Api().post('login', credentials)
    },
    forgotPassword (user_details) {
        return Api().post('forgot_password', user_details)
    },
    resetPassword (user_details) {
        return Api().post('reset_password', user_details)
    },
    updatePassword(credentials, user_id){
        return Api().put(`update_password/${user_id}`, credentials)
    }
}