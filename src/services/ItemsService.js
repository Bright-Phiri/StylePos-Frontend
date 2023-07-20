import Api from "./api";

export default {
    getData(page, perPage, search) {
        return Api().get('items', { params: { page: page, per_page: perPage, search: search } })
    },
    create(employee) {
        return Api().post('items', employee)
    },
    show(barcode) {
        return Api().get(`find_item/${barcode}`)
    },
    getItem(item_id,category_id) {
        return Api().get(`categories/${category_id}/items/${item_id}`)
    },
    put(item,category_id, item_id) {
        return Api().put(`categories/${category_id}/items/${item_id}`, item)
    },
    delete(item_id) {
        return Api().delete(`items/${item_id}`)
    }
}