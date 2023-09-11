import Api from "./api";

export default {
    getData() {
        return Api().get('categories')
    },
    create(category) {
        return Api().post('categories', category)
    },
    show(category_id) {
        return Api().get(`categories/${category_id}`)
    },
    show_items(page, perPage, search, category_id) {
        return Api().get(`categories/show_items/${category_id}`, { params: { page: page, per_page: perPage, search: search } })
    },
    put(category, category_id) {
        return Api().put(`categories/${category_id}`, category)
    },
    delete(category_id) {
        return Api().delete(`categories/${category_id}`)
    }
}