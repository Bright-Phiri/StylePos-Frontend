import Api from "./api";

export default {
    getData() {
        return Api().get('items')
    },
    create(order_id, line_item) {
        return Api().post(`orders/${order_id}/line_items`, line_item)
    },
    update(line_item, line_item_id) {
        return Api().put(`line_items/${line_item_id}`, line_item)
    },
    applyDiscount(order_id, line_item, line_item_id) {
        return Api().put(`orders/${order_id}/line_items/apply_discount/${line_item_id}`, line_item)
    },
    delete(line_item_id) {
        return Api().delete(`line_items/${line_item_id}`)
    }
}