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
        <div style="width: 150px">Tên chỉ số khám</div>
        <ms-input
          :inpPopupDetail="true"
          v-model="currentItem.examinationName"
        ></ms-input>
      </div>
      <div class="field-item">
        <div style="width: 150px">Danh mục chỉ số khám</div>
        <ms-combobox
          :useApi="false"
          :dataProps="dataExamCate"
          v-model="currentItem.examCateID"
          propValue="examCateID"
          propName="examCateName"
          ref="cbxExamCate"
          style="width: 500px"
        ></ms-combobox>
      </div>
      <div class="field-item">
        <div style="width: 150px">Giá tiền</div>
        <ms-input :inpPopupDetail="true" v-model="currentItem.fee"></ms-input>
      </div>
    </template>
    <template v-slot:footer></template>
  </ms-popup>
</template>
  
  <script>
import examinationApi from "@/js/api/catalogmanagement/examinationApi";
import examCateApi from "@/js/api/catalogmanagement/examCateApi";
export default {
  /**
   * Tên component
   */
  name: "ExaminationManagement",
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
      title: "Danh sách chỉ số khám",
      columns: [
        {
          name: "Tên danh mục chỉ số khám",
          field: "examCateName",
          width: "200px",
        }, // Tên cột "Tên" với độ rộng 200px
        { name: "Tên chỉ số khám", field: "examinationName", width: "200px" }, // Tên cột "Tên" với độ rộng 200px
        { name: "Giá tiền", field: "fee", width: "150px" }, // Tên cột "Giá tiền" với độ rộng 150px
      ],
      data: [],
      total: 0,
      payload: {
        currentPage: 1,
        pageSize: 20,
        textSearch: "",
      },
      showPopup: false,
      titleDetail: "Chi tiết chỉ số khám",
      currentItem: {},
      isAdd: false,
      idField: "medicineID",
      dataExamCate: [],
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
      let res = await examinationApi.getListAsync(payload);
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
      let resExamCate = await examCateApi.getDataComboboxAsync();
      if (resExamCate && resExamCate.length >= 0) {
        me.dataExamCate = resExamCate;
      }
      me.showPopup = true;
    },

    /**
     * Lưu fỏrm
     * @param {*} isNew
     */
    async save() {
      const me = this;
      let res = await examinationApi.insertOrUpdateAsync(me.currentItem);
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
      let res = await examinationApi.deleteAsync(
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