<template>
  <div>
    <div class="d-flex create-rate-content">
      <div class="rate-title">
        <h4>Product</h4>
      </div>
      <div class="ml-auto">
        <router-link class="no-underline" to="/createproduct" append>
          <button class="btn btn-primary">Create Product</button>
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
                v-if="products.length<=0 && !showLoader"
              >No Product Found</div>
            </td>
          </tr>
          <tr class="black" v-for="(product,index) in products" :key="index">
            <td>{{ index + 1 + (page - 1) * perPage }}</td>
            <td>{{ product._id }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.categoryId.name }}</td>
            <td>{{ product.categoryId._id }}</td>
            <td>{{ product.status }}</td>
            <td>
              <div class="d-flex">
                <router-link :to="{path:'/createproduct',query:{id:product._id}}">
                  <button v-b-modal.edit-modal class="btn btn-info mr-2">Edit</button>
                </router-link>
                <button
                  @click="passingId(product)"
                  v-b-modal.delete-modal
                  class="btn delet-btn btn-danger"
                >Delete</button>
              </div>
            </td>
            <!-- </tr> -->
          </tr>
          <deletModal v-if="showModel" :id="value" v-on:event_child="deleteOneProduct"></deletModal>
          <div class>
            <b-pagination
              v-if="totalRows>10"
              v-model="page"
              :total-rows="totalRows"
              :per-page="perPage"
              aria-controls="my-table"
              @input="getAllProduct(page)"
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
      totalRows: 0,
      tableHeaders: [
        {
          tableHeaderName: "Sr. No.",
          key: "key1"
        },
        {
          tableHeaderName: "ProuctId",
          key: "key1"
        },
        {
          tableHeaderName: "ProuctName",
          key: "key1"
        },
        {
          tableHeaderName: "CategoryName",
          key: "key1"
        },
        {
          tableHeaderName: "CategoryId",
          key: "key1"
        },
        {
          tableHeaderName: "Status",
          key: "key1"
        },
        {},
        {}
      ],
      products: [],
      showLoader: false,
      value: "",
      showModel: false,
      page: 1
    };
  },
  methods: {
    async getAllProduct(data) {
      this.products = [];
      let obj = {
        page: data
      };
      this.showLoader = true;
      let allProduct = await service.apiCallWithData(
        "/Product/getAllProduct",
        obj
      );
      // console.log("allProduct allProduct", allProduct);
      if (
        allProduct &&
        allProduct.data &&
        allProduct.data.results.length > 0 &&
        allProduct.status == 200
      ) {
        this.showLoader = false;
        this.products = allProduct.data.results;
        this.totalRows = allProduct.data.total;
        // console.log("this.categories", this.products);
      } else {
        this.showLoader = false;
        this.products = [];
        this.totalRows = 0;
      }
    },

    passingId(data) {
      this.showModel = true;
      this.value = data._id;
    },
    async deleteOneProduct(id) {
      let deleteData = await service.apiCallWithData("/Product/deleteProduct", {
        productId: id
      });
      // console.log("deleteData deleteData", deleteData);
      if (deleteData && deleteData.status == 200) {
        this.showModel = false;
        this.$toaster.success("Record Disable SuccessFully");

        this.getAllProduct();
      } else if (deleteData.status == 204) {
        this.showModel = false;
        this.$toaster.error("No Product Found");
      } else {
        this.showModel = false;
        this.$toaster.error("Internal Server Error!");
      }
    }
  },
  created() {
    this.getAllProduct(this.page);
  }
};
</script>

<style lang="scss">
</style>
