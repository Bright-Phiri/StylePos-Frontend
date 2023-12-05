import Api from "./api";

export default {
    getData() {
        return Api().get('configurations')
    },
    create(configuration) {
        return Api().post('configurations', configuration)
    },
    show(configuration_id) {
        return Api().get(`configurations/${configuration_id}`)
    },
    put(configuration, configuration_id) {
        return Api().put(`configurations/${configuration_id}`, configuration)
    },
    delete(configuration_id) {
        return Api().delete(`configurations/${configuration_id}`)
    }
}