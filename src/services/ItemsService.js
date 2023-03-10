import Api from "./api";

export default {
    getData(){
        return Api().get('items')
    },
    create(employee) {
        return Api().post('items', employee)
    },
    show(item_id) {
        return Api().get(`items/${item_id}`)
    },
    put(item, item_id){
        return Api().put(`items/${item_id}`,item)
    },
    delete(item_id){
        return Api().delete(`items/${item_id}`)
    }
}