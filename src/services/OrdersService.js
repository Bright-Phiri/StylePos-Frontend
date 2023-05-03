import Api from "./api";

export default {
    getData(page, perPage, search) {
        return Api().get('orders' , { params: { page: page, per_page: perPage, search: search} })
    },
    create(employee_id) {
        return Api().post(`employees/${employee_id}/orders`)
    },
    show(order_id) {
        return Api().get(`orders/${order_id}`)
    },
    delete(order_id) {
        return Api().delete(`orders/${order_id}`)
    },
    item_return(order_id, line_item_id) {
        return Api().delete(`orders/${order_id}/return_item/${line_item_id}`)
    }
}