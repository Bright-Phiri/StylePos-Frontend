import Api from "./api"

export default {
    getData() {
        return Api().get('dashboard')
    }
}