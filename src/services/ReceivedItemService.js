import Api from "./api";

export default {
    getData(page, perPage, search) {
        return Api().get('received_items', { params: { page: page, per_page: perPage, search: search } })
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