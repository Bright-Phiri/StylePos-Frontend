import Api from "../services/api";

export default {
    register (credentials) {
        return Api().post('register', credentials)
    },
    login (credentials) {
        return Api().post('login', credentials)
    },
    updatePassword(credentials, user_id){
        return Api().put(`update_password/${user_id}`, credentials)
    }
}