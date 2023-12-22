export default {
  methods: {
    handleError(error) {
      if (error.request.status === 0) {
        this.$swal("Error", error.message + ", Couldn't reach API", "error");
      } else {
        if (error.response.status === 400) {
          if (error.response.data.error) {
            this.$swal("Error", error.response.data.error, "error");
          } else{
            this.$swal("Error", error.response.data.message, "error");
          }
          
        } else if (error.response.status === 401) {
          if (error.response.data.status && error.response.data.status === "login"){
            this.$router.push({ path: '/logout' });
          } else{
            this.$swal("Error", error.response.data.error, "error");
          }
        } else if (error.response.status === 403) {
          this.$swal("Warning", error.response.data.message, "warning");
        } else if (error.response.status === 404) {
          this.$swal("Error", error.response.data.error, "error");
        } else if (error.response.status === 422) {
          if (error.response.data.errors) {
            this.errors = error.response.data.errors;
          } else {
            this.errors = error.response.data;
          }
          this.$swal("Error", this.errors.join(", "), "error");
        } else if (error.response.status == 423) {
          this.$swal("Message", error.response.data.message, "info");
        }
      }
    },
  },
};
