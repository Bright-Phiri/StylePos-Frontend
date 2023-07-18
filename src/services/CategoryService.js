import Api from "./api";

export default {
    getData() {
        return Api().get('categories')
    },
    create(category) {
        return Api().post('categories', category)
    },
    show_items(category_id) {
        return Api().get(`show_items/${category_id}`)
    },
    put(category, category_id) {
        return Api().put(`categories/${category_id}`, category)
    },
    delete(category_id) {
        return Api().delete(`categories/${category_id}`)
    }
}