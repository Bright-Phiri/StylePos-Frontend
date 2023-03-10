import Api from "./api";

export default {
    getData(){
        return Api().get('orders')
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