import Api from "./api";

export default {
    getData(page, perPage) {
        return Api().get('orders' , { params: { page: page, per_page: perPage } })
    },
    create(employee_id) {
        return Api().post(`employees/${employee_id}/orders`)
    },
    show(order_id) {
        return Api().get(`orders/${order_id}`)
    },
    delete(order_id) {
        return Api().delete(`orders/${order_id}`)
    }
}