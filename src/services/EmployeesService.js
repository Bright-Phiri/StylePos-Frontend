import Api from "./api"

export default {
    getData() {
        return Api().get('employees')
    },
    create(employee) {
        return Api().post('employees', employee)
    },
    disable(employee_id) {
        return Api().post(`disable_user/${employee_id}`)
    },
    activate(employee_id) {
        return Api().post(`activate_user/${employee_id}`)
    },
    show(employee_id) {
        return Api().get(`employees/${employee_id}`)
    },
    put(employee, employee_id) {
        return Api().put(`employees/${employee_id}`, employee)
    },
    delete(employee_id) {
        return Api().delete(`employees/${employee_id}`)
    }
}