import Api from "./api";

export default {
    getData(page, perPage, search) {
        return Api().get('items', { params: { page: page, per_page: perPage, search: search } })
    },
    create(category_id,item) {
        return Api().post(`categories/${category_id}/items`, item)
    },
    show(barcode) {
        return Api().get(`items/find_item/${barcode}`)
    },
    getItem(item_id) {
        return Api().get(`items/${item_id}`)
    },
    put(item, item_id) {
        return Api().put(`items/${item_id}`, item)
    },
    delete(item_id) {
        return Api().delete(`items/${item_id}`)
    }
}