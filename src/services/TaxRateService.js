import Api from "./api";

export default {
    getData() {
        return Api().get('tax_rates')
    },
    create(configuration) {
        return Api().post('tax_rates', configuration)
    },
    show(configuration_id) {
        return Api().get(`tax_rates/${configuration_id}`)
    },
    put(configuration, configuration_id) {
        return Api().put(`tax_rates/${configuration_id}`, configuration)
    },
    delete(configuration_id) {
        return Api().delete(`tax_rates/${configuration_id}`)
    }
}