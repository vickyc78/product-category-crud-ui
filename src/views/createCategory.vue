<template>
  <div>
    <div class="text-center" v-if="!$route.query.id">Create Category</div>
    <div class="text-center" v-if="$route.query.id">Edit Category</div>
    <div class="row m-auto main-match-section">
      <div class="col-md-10 card-body card-section">
        <div class="border-bottom border-dark pb-3">
          <div>
            <form name="user" class="form" @submit.prevent style="margin-left: 469px">
              <div class="form-group">
                <div class="input-group">
                  <label>Name:</label>
                  <div>
                    <input
                      type="text"
                      class="form-control"
                      id="name"
                      v-model="formData.name"
                      placeholder="Name"
                      @blur="$v.formData.name.$touch()"
                    />
                    <div
                      v-if="$v.formData.name.$error"
                      class="mt-2 text-danger validation-text"
                    >Name is required</div>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <div class="input-group mb-2">
                  <label>Status:</label>
                  <v-select
                    class="col-md-6"
                    placeholder="select status"
                    :options="status"
                    label="status"
                    v-model="formData.status"
                    @blur="$v.formData.status.$touch()"
                  ></v-select>
                  <div
                    v-if="$v.formData.status.$error"
                    class="mt-2 text-danger validation-text"
                  >Status is required</div>
                </div>
              </div>
              <div class="text-center" style="margin-right: 250px">
                <button
                  type="submit"
                  class="btn btn-primary btn-lg mr-2"
                  v-if="$route.query.id"
                  :disabled="!formData.name || !formData.status"
                  @click="editCategory(formData)"
                >Edit</button>
                <button
                  type="submit"
                  class="btn btn-primary btn-lg mr-2"
                  v-if="!$route.query.id"
                  :disabled="!formData.name || !formData.status"
                  @click="createCategory(formData)"
                >Create</button>
                <router-link class="no-underline" to="/category" append>
                  <button type="submit" class="btn btn-danger btn-lg">Cancel</button>
                </router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import service from "../../services/apiService";
import { required } from "vuelidate/lib/validators";
export default {
  data() {
    return {
      formData: { name: "", status: "" },
      status: ["Enable", "Disable"]
    };
  },
  validations: {
    formData: {
      name: { required },
      status: { required }
    }
  },
  methods: {
    async createCategory(data) {
      this.formData = { name: "", status: "" };
      let saveData = await service.apiCallWithData(
        "/Category/saveCategory",
        data
      );
      // console.log("DDDDDDDDDDDD", saveData);
      if (saveData && saveData.data && saveData.status == 200) {
        this.$toaster.success("Category Save SuccessFully");
        this.$router.push({ path: "/category" });
      } else {
        this.$toaster.error("Internal server error");
      }
    },
    async getOneCategory(id) {
      let oneData = await service.apiCallWithDataGetMethode(
        `/Category/getOneCategory/${id}`
      );
      // console.log("DDDDDDDDDDDD", oneData);
      if (oneData && oneData.data && oneData.status == 200) {
        this.formData = oneData.data;
      } else {
        this.$toaster.error("Internal server error");
      }
    },
    async editCategory(data) {
      this.formData = { name: "", status: "" };
      data.categoryId = this.$route.query.id;
      let editData = await service.apiCallWithData(
        "/Category/editCategory",
        data
      );
      // console.log("DDDDDDDDDDDD", editData);
      if (editData && editData.data && editData.status == 200) {
        this.$toaster.success("Category edit SuccessFully");
        this.$router.push({ path: "/category" });
      } else {
        this.$toaster.error("Internal server error");
      }
    }
  },
  created() {
    if (this.$route.query.id) {
      this.getOneCategory(this.$route.query.id);
    }
  }
};
</script>

<style lang="scss"></style>
