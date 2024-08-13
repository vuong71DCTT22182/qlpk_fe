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
        <div style="width: 150px">Tên chức vụ</div>
        <ms-input
          :inpPopupDetail="true"
          v-model="currentItem.positionName"
        ></ms-input>
      </div>
    </template>
    <template v-slot:footer></template>
  </ms-popup>
</template>
  
  <script>
import positionApi from "@/js/api/systemmanagement/positionApi";
export default {
  /**
   * Tên component
   */
  name: "PositionsManagement",
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
      title: "Danh mục chức vụ",
      columns: [
        { name: "Chức vụ", field: "positionName", width: "200px" }, // Tên cột "Chức vụ" với độ rộng 200px
        { name: "Số lượng", field: "totalUser", width: "150px" }, // Tên cột "Số lượng" với độ rộng 150px
      ],
      data: [],
      total: 0,
      payload: {
        currentPage: 1,
        pageSize: 20,
        textSearch: "",
      },
      showPopup: false,
      titleDetail: "Chi tiết chức vụ",
      currentItem: {},
      isAdd: false,
      idField: "positionID",
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
      let res = await positionApi.getListAsync(payload);
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
    addoredit(data = {}, isNew = false) {
      const me = this;
      me.currentItem = data;
      me.showPopup = true;
      me.isAdd = isNew;
    },

    /**
     * Lưu fỏrm
     * @param {*} isNew
     */
    async save() {
      const me = this;
      let res = await positionApi.insertOrUpdateAsync(me.currentItem);
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
      let res = await positionApi.deleteAsync(
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