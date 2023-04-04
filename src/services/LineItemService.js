import Api from "./api";

export default {
    getData(){
        return Api().get('items')
    },
    create(employee_id, order_id, line_item) {
        return Api().post(`employees/${employee_id}/orders/${order_id}/line_items`, line_item)
    },
    update(employee_id, order_id, line_item, line_item_id) {
        return Api().put(`employees/${employee_id}/orders/${order_id}/line_items/${line_item_id}`, line_item)
    },
    applyDiscount(employee_id, order_id, line_item, line_item_id) {
        return Api().put(`employees/${employee_id}/orders/${order_id}/apply_discount/${line_item_id}`, line_item)
    },
    delete(employee_id, order_id, line_item_id){
        return Api().delete(`employees/${employee_id}/orders/${order_id}/line_items/${line_item_id}`)
    }
}