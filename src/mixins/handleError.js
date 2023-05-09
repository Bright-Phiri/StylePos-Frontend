export default {
  methods: {
    handleError(error) {
      if (error.request.status === 0) {
        this.$swal("Error", error.message + ", Couldn't reach API", "error");
      } else {
        if (error.response.status === 400) {
          this.$swal("Error", error.response.data.error, "error");
        } else if (error.response.status === 403) {
          this.$swal("Warning", error.response.data.message, "warning");
        }
        else if (error.response.status === 404) {
          this.$swal("Error", error.response.data.error, "error");
        } else if (error.response.status === 422) {
          this.errors = error.response.data;
          this.$swal("Error", this.errors.join(", "), "error");
        }
      }
    },
  },
};
