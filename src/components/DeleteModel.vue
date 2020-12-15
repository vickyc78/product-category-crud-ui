<template>
  <div>
    <b-modal id="delete-modal" ref="my-modal" hide-footer>
      <div class="modal-content text-center">
        <div class="font-20">Do you want to delete the record?</div>
        <div class="p-3">
          <div class="row">
            <div class="col-md-6">
              <button class="btn btn-block btn-outline-success" @click="deleteConfirm">Yes</button>
            </div>
            <div class="col-md-6">
              <button class="btn btn-block btn-outline-danger" @click="deleteCancel">No</button>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>
<script>
export default {
  props: ["id"],
  methods: {
    deleteConfirm: function() {
      this.$root.$emit("bv::hide::modal", "delete-modal", "#btnShow");
      this.$emit("event_child", this.id);
    },
    deleteCancel: function() {
      this.$root.$emit("bv::hide::modal", "delete-modal", "#btnShow");
    }
  }
};
</script>
<style lang="scss">
.modal-header {
  border-bottom: none;
}
.modal-content {
  border: none;
}
</style>
