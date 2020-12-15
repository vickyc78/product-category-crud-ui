<template>
  <div>
    <div class="d-flex create-rate-content">
      <div class="rate-title">
        <h4>Category</h4>
      </div>
      <div class="ml-auto">
        <!-- <a class="btn btn-primary rounded-0 float-right mt-minus7 ml-3" href="/createsubmarketinfo"> Create </a> -->
        <!-- <button v-b-modal.ratemodal class="btn btn-brown">
          Create Sub Market Info
        </button>-->
        <router-link class="no-underline" to="/createcategory" append>
          <button class="btn btn-primary">Create Category</button>
        </router-link>
      </div>
    </div>
    <div class="submarket-info-content">
      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th
              v-for="tableHeader in tableHeaders"
              v-bind:key="tableHeader.tableHeaderName"
            >{{ tableHeader.tableHeaderName }}</th>
          </tr>
        </thead>
        <tbody class="white table-strip">
          <tr>
            <td colspan="7">
              <b-spinner v-if="showLoader"></b-spinner>
              <div
                class="justify-content-md-center text-blue text-center"
                v-if="categories.length <= 0 && !showLoader"
              >No Category Found</div>
            </td>
          </tr>
          <tr class="black" v-for="(category, index) in categories" :key="index">
            <td>{{ index + 1 + (page - 1) * perPage }}</td>
            <td>{{ category._id }}</td>
            <td>{{ category.name }}</td>
            <td>{{ category.status }}</td>
            <td>
              <div class="d-flex">
                <router-link
                  :to="{
                    path: '/createcategory',
                    query: { id: category._id }
                  }"
                >
                  <button class="btn btn-info mr-2">Edit</button>
                </router-link>
                <button
                  @click="passingId(category)"
                  v-b-modal.delete-modal
                  class="btn delet-btn btn-danger"
                >Delete</button>
              </div>
            </td>
            <!-- </tr> -->
          </tr>
          <deletModal v-if="showModel" :id="value" v-on:event_child="deleteOneCategory"></deletModal>
          <div>
            <b-pagination
              v-if="totalRows>10"
              v-model="page"
              :total-rows="totalRows"
              :per-page="perPage"
              aria-controls="my-table"
              @input="getAllCategory(page)"
              align="center"
            ></b-pagination>
          </div>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import service from "../../services/apiService";
import deletModal from "../components/DeleteModel";
export default {
  components: {
    deletModal
  },
  data() {
    return {
      perPage: 10,
      value: "",
      totalRows: 0,
      showModel: false,
      tableHeaders: [
        {
          tableHeaderName: "Sr. No.",
          key: "key1"
        },
        {
          tableHeaderName: "CategoryId",
          key: "key1"
        },
        {
          tableHeaderName: "CategoryName",
          key: "key1"
        },
        {
          tableHeaderName: "Status",
          key: "key1"
        },
        {},
        {}
      ],
      categories: [],
      page: 1
    };
  },
  methods: {
    async getAllCategory(data) {
      // console.log("HHHHHHHHHHH", data);
      this.categories = [];
      this.showLoader = true;
      let sendObj = {
        page: data
      };
      let allCategory = await service.apiCallWithData(
        "/Category/getAllCategory",
        sendObj
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
        this.totalRows = allCategory.data.total;
        // console.log("this.categories", this.categories);
      } else {
        this.showLoader = false;
        this.categories = [];
        this.totalRows = 0;
      }
    },

    passingId(data) {
      this.showModel = true;
      this.value = data._id;
    },
    async deleteOneCategory(id) {
      let deleteData = await service.apiCallWithData(
        "/Category/deleteCategory",
        { categoryId: id }
      );
      // console.log("deleteData deleteData", deleteData);
      if (deleteData && deleteData.status == 200) {
        this.showModel = false;
        this.$toaster.success("Record Disable SuccessFully");
        this.getAllCategory();
      } else if (deleteData.status == 204) {
        this.showModel = false;
        this.$toaster.error("No Category Found");
      } else {
        this.showModel = false;
        this.$toaster.error("Internal Server Error!");
      }
    }
  },
  created() {
    this.getAllCategory(this.page);
  }
};
</script>

<style lang="scss"></style>
