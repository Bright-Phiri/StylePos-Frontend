import Api from "./api";

export default {
    getData(page, perPage, search) {
        return Api().get('inventory_levels', { params: { page: page, per_page: perPage, search: search } })
    },
    create(inventoryLevel,category_id, item_id) {
        return Api().post(`categories/${category_id}/items/${item_id}/inventory_levels`, inventoryLevel)
    },
    show(item_id,category_id, id) {
        return Api().get(`categories/${category_id}/items/${item_id}/inventory_levels/${id}`)
    },
    put(inventoryLevel,category_id, item_id, inventory_id) {
        return Api().put(`categories/${category_id}/items/${item_id}/inventory_levels/${inventory_id}`, inventoryLevel)
    },
    delete(inventory_id) {
        return Api().delete(`inventory_levels/${inventory_id}`)
    }
}