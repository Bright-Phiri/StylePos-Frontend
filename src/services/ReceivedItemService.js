import Api from "./api";

export default {
    getData() {
        return Api().get('received_items')
    },
    create(item, item_id) {
        return Api().post(`items/${item_id}/received_items`, item)
    },
    show(item_id) {
        return Api().get(`received_items/${item_id}`)
    },
    put(item, item_id) {
        return Api().put(`received_items/${item_id}`, item)
    },
    delete(item_id) {
        return Api().delete(`received_items/${item_id}`)
    }
}