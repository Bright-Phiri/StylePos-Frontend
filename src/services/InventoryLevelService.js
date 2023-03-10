import Api from "./api";

export default {
    getData(){
        return Api().get('inventory_levels')
    },
    create(inventoryLevel, item_id) {
        return Api().post(`items/${item_id}/inventory_levels`, inventoryLevel)
    },
    show(item_id, id) {
        return Api().get(`items/${item_id}/inventory_levels/${id}`)
    },
    put(inventoryLevel, item_id, inventory_id){
        return Api().put(`items/${item_id}/inventory_levels/${inventory_id}`,inventoryLevel)
    },
    delete(inventory_id){
        return Api().delete(`inventory_levels/${inventory_id}`)
    }
}