<template>
  <div>
    <ms-admin-grid
      :title="title"
      :columns="columns"
      :data="data"
      :total="total"
      :idField="idField"
      @loadData="loadData"
      @editRow="addoredit"
      @add="addoredit"
      @deleteRow="deleteRow"
    ></ms-admin-grid>
  </div>

  <ms-popup v-if="showPopup" @close="closePopup" @save="save">
    <template v-slot:header>
      {{ titleDetail }}
    </template>
    <template v-slot:body>
      <div class="field-item">
        <div style="width: 150px;">Tên thuốc</div>
        <ms-input
          :inpPopupDetail="true"
          v-model="currentItem.medicineName"
        ></ms-input>
      </div>
      <div class="field-item">
        <div style="width: 150px;">Danh mục thuốc</div>
        <ms-combobox
          :useApi="false"
          :dataProps="dataMedicineCate"
          v-model="currentItem.medicineCateID"
          propValue="medicineCateID"
          propName="medicineCateName"
          ref="cbxMedicineCate"
          style="width: 500px;"
        ></ms-combobox>
      </div>
      <div class="field-item">
        <div style="width: 150px;">Giá tiền</div>
        <ms-input :inpPopupDetail="true" v-model="currentItem.fee"></ms-input>
      </div>
      <div class="field-item">
        <div style="width: 150px;">Đơn vị tính</div>
        <ms-input :inpPopupDetail="true" v-model="currentItem.unit"></ms-input>
      </div>
    </template>
    <template v-slot:footer></template>
  </ms-popup>
</template>

<script>
import medicineApi from "@/js/api/catalogmanagement/medicineApi";
import medicineCateApi from "@/js/api/catalogmanagement/medicineCateApi";
export default {
  /**
   * Tên component
   */
  name: "MedicineManagement",
  /**
   * Hứng nhận
   */
  props: {},
  /**
   * Component được sử dụng
   */
  components: {},
  /**
   * Data
   */
  data() {
    return {
      title: "Danh sách thuốc",
      columns: [
        { name: "Danh mục thuốc", field: "medicineCateName", width: "200px" }, // Cột "Tên" với độ rộng 200px
        { name: "Tên thuốc", field: "medicineName", width: "200px" }, // Cột "Tên" với độ rộng 200px
        { name: "Giá tiền", field: "fee", width: "150px" }, // Cột "Giá tiền" với độ rộng 150px
        { name: "Đơn vị tính", field: "unit", width: "150px" }, // Cột "Giá tiền" với độ rộng 150px
      ],
      data: [],
      total: 0,
      payload: {
        currentPage: 1,
        pageSize: 20,
        textSearch: "",
      },
      showPopup: false,
      titleDetail: "Chi tiết thuốc",
      currentItem: {},
      isAdd: false,
      idField: "medicineID",
      dataMedicine: [],
    };
  },
  computed: {},
  /**
   * Phương thức
   */
  methods: {
    /**
     * Load data
     * @param {*} param
     */
    async loadData(param = {}) {
      const me = this;
      let payload = { ...me.payload, ...param };
      let res = await medicineApi.getListAsync(payload);
      if (res && res.data.length >= 0 && res.total >= 0) {
        me.data = res.data;
        me.total = res.total;
      }
    },

    /**
     * Đóng form
     */
    closePopup() {
      const me = this;
      me.showPopup = false;
      me.loadData();
    },

    /**
     * Thêm hoặc sửa
     * @param {*} data
     * @param {*} isNew
     */
    async addoredit(data = {}, isNew = false) {
      const me = this;
      me.isAdd = isNew;
      me.currentItem = data;
      let resMedicineCate = await medicineCateApi.getDataComboboxAsync();
      if (resMedicineCate && resMedicineCate.length >= 0) {
        me.dataMedicineCate = resMedicineCate;
      }
      me.showPopup = true;
    },

    /**
     * Lưu fỏrm
     * @param {*} isNew
     */
    async save() {
      const me = this;
      let res = await medicineApi.insertOrUpdateAsync(me.currentItem);
      if (me.isAdd) {
        res
          ? me.$toast.success("Thêm mới thành công")
          : me.$toast.error("Thêm mới thất bại");
      } else {
        res
          ? me.$toast.success("Sửa thành công")
          : me.$toast.error("Sửa thất bại");
      }
      me.showPopup = false;
      await me.loadData();
    },

    /**
     * Xóa
     * @param {*} data
     */
    async deleteRow(data) {
      const me = this;
      let res = await medicineApi.deleteAsync(
        `${me.idField}=${data[me.idField]}`
      );
      if (res) {
        me.$toast.success("Xóa thành công");
      } else {
        me.$toast.error("Xóa thất bại");
      }
      await me.loadData();
    },
  },
  async created() {
    const me = this;
    me.loadData();
  },

  /**
   * Theo dõi sự thay đổi
   */
  watch: {},
};
</script>

<style>
.field-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
</style>
