import Api from "./api"

export default {
    getData() {
        return Api().get('employees')
    },
    create(employee) {
        return Api().post('employees', employee)
    },
    disable(employee_id) {
        return Api().patch(`employees/${employee_id}/disable_user`)
    },
    activate(employee_id) {
        return Api().patch(`employees/${employee_id}/activate_user`)
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