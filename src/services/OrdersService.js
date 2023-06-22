import Api from "./api";

export default {
    getData(page, perPage, search) {
        return Api().get('orders', { params: { page: page, per_page: perPage, search: search } })
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
    item_return(return_details, order_id, line_item_id) {
        return Api().post(`orders/${order_id}/return_item/${line_item_id}`, return_details)
    },
    getRetuns() {
        return Api().get('returns')
    },
    filter_transactions(page, perPage, filter){
      return Api().get('filter_transactions', { params: { page: page, per_page: perPage, selected_filter: filter} })
    }
}