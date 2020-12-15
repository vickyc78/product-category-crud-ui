<template>
  <div>
    <div class="text-center" v-if="!$route.query.id">Create Product</div>
    <div class="text-center" v-if="$route.query.id">Edit Product</div>
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
                      placeholder="Name"
                      v-model="formData.name"
                      required
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
                  <label>Category:</label>
                  <v-select
                    class="col-md-6"
                    placeholder="select status"
                    :options="categories"
                    label="name"
                    v-model="formData.categoryId"
                    @blur="$v.formData.status.$touch()"
                  ></v-select>
                  <div
                    v-if="$v.formData.categoryId.$error"
                    class="mt-2 text-danger validation-text"
                  >status is required</div>
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
                  >status is required</div>
                </div>
              </div>
              <div class="text-center" style="margin-right: 250px">
                <button
                  type="submit"
                  class="btn btn-primary btn-lg mr-2"
                  v-if="$route.query.id"
                  :disabled="!formData.name || !formData.categoryId || !formData.status"
                  @click="editProduct(formData)"
                >Edit</button>
                <button
                  type="submit"
                  class="btn btn-primary btn-lg mr-2"
                  v-if="!$route.query.id"
                  :disabled="!formData.name || !formData.categoryId || !formData.status"
                  @click="createProduct(formData)"
                >Create</button>
                <router-link class="no-underline" to="/product" append>
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
      formData: { name: "", status: "", categoryId: "" },
      status: ["Enable", "Disable"],
      categories: []
    };
  },
  validations: {
    formData: {
      name: { required },
      status: { required },
      categoryId: { required }
    }
  },
  methods: {
    async createProduct(data) {
      this.formData = { name: "", status: "", categoryId: "" };
      // console.log("createProduct createProduct", data);
      let sendObj = {
        name: data.name,
        categoryId: data.categoryId._id
      };
      let saveData = await service.apiCallWithData(
        "/Product/saveProduct",
        sendObj
      );
      // console.log("DDDDDDDDDDDD", saveData);
      if (saveData && saveData.data && saveData.status == 200) {
        this.$toaster.success("Product Save SuccessFully");
        this.$router.push({ path: "/Product" });
      } else if (saveData.status == 204) {
        this.$toaster.error("No Enable Category Found");
      } else {
        this.$toaster.error("Internal server error");
      }
    },
    async getOneProduct(id) {
      let oneData = await service.apiCallWithDataGetMethode(
        `/Product/getOneProduct/${id}`
      );
      if (oneData && oneData.data && oneData.status == 200) {
        this.formData = oneData.data;
      } else {
        this.$toaster.error("Internal server error");
      }
    },
    async editProduct(data) {
      this.formData = { name: "", status: "", categoryId: "" };
      data.productId = this.$route.query.id;

      let editData = await service.apiCallWithData(
        "/Product/editProduct",
        data
      );
      // console.log("DDDDDDDDDDDD", editData);
      if (editData && editData.data && editData.status == 200) {
        this.$toaster.success("Product edit SuccessFully");
        this.$router.push({ path: "/Product" });
      } else {
        this.$toaster.error("Internal server error");
      }
    },
    async getAllCategory() {
      this.showLoader = true;
      let allCategory = await service.apiCallWithData(
        "/Category/getAllCategory",
        { name: "product" }
      );
      // console.log("allCategory allCategory", allCategory);
      if (
        allCategory &&
        allCategory.data &&
        allCategory.data.results.length > 0 &&
        allCategory.status == 200
      ) {
        this.showLoader = false;
        this.categories = allCategory.data.results;
        // console.log("this.categories", this.categories);
      } else {
        this.categories = [];
      }
    }
  },
  created() {
    if (this.$route.query.id) {
      this.getOneProduct(this.$route.query.id);
    }
    this.getAllCategory();
  }
};
</script>

<style lang="scss">
</style>
