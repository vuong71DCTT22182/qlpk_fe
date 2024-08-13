<template>
  <div>
    <ms-admin-grid :title="title" :columns="columns" :data="data" :total="total" :idField="idField" @loadData="loadData"
      @editRow="addoredit" @add="addoredit" @deleteRow="deleteRow"></ms-admin-grid>
  </div>

  <ms-popup v-if="showPopup" @close="closePopup" @save="save">
    <template v-slot:header>
      {{ titleDetail }}
    </template>
    <template v-slot:body>
      <div class="field-item">
        <div style="width: 150px">Họ và tên</div>
        <ms-input :inpPopupDetail="true" v-model="currentItem.fullname"></ms-input>
      </div>
      <div class="field-item" v-if="!isAdd">
        <div style="width: 150px">Mã bệnh nhân</div>
        <ms-input :inpPopupDetail="true" v-model="currentItem.patientNumber" :disabled="true"></ms-input>
      </div>
      <div class="field-item">
        <div style="width: 150px">Ngày sinh</div>
        <el-date-picker v-model="currentItem.birthday" format="YYYY/MM/DD" value-format="YYYY-MM-DD" type="date"
          placeholder="Chọn ngày">
        </el-date-picker>
      </div>
      <div class="field-item">
        <div style="width: 150px">Giới tính</div>
        <ms-combobox :useApi="false" :dataProps="dataGender" v-model="currentItem.sex" propValue="gender"
          propName="text" ref="cbxGender" style="width: 500px"></ms-combobox>
      </div>
      <div class="field-item">
        <div style="width: 150px">Số điện thoại</div>
        <ms-input :inpPopupDetail="true" v-model="currentItem.phone"></ms-input>
      </div>
      <div class="field-item">
        <div style="width: 150px">Địa chỉ</div>
        <ms-input :inpPopupDetail="true" v-model="currentItem.address"></ms-input>
      </div>
      <div class="field-item">
        <div style="width: 150px">CCCD</div>
        <ms-input :inpPopupDetail="true" v-model="currentItem.identication"></ms-input>
      </div>
      <div class="field-item" v-if="!isAdd">
        <div style="width: 150px">Chuẩn đoán gần nhất</div>
        <ms-input :inpPopupDetail="true" v-model="currentItem.lastDiagnose" :disabled="true"></ms-input>
      </div>
      <div class="field-item" v-if="!isAdd">
        <div style="width: 150px">Ngày khám gần nhất</div>
        <el-date-picker v-model="currentItem.lastDiagnoseDate" format="YYYY/MM/DD" value-format="YYYY-MM-DD" type="date"
          placeholder="Chọn ngày">
        </el-date-picker>
      </div>
    </template>
    <template v-slot:footer></template>
  </ms-popup>
</template>

<script>
import patientApi from "@/js/api/managerment/patientApi";

export default {
  /**
   * Tên component
   */
  name: "PatientsManagement",
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
      title: "Danh sách bệnh nhân",
      columns: [
        { name: "Họ và tên", field: "fullname", width: "200px" }, // Tên cột "Họ và tên" với độ rộng 200px
        { name: "Mã bệnh nhân", field: "patientNumber", width: "150px" }, // Tên cột "Mã bệnh nhân" với độ rộng 150px
        {
          name: "Ngày sinh",
          field: "birthday",
          type: "time",
          width: "150px",
        }, // Tên cột "Ngày sinh" với độ rộng 150px
        { name: "Giới tính", field: "sexName", type: "combobox", width: "100px" }, // Tên cột "Giới tính" với độ rộng 100px
        { name: "Số điện thoại", field: "phone", width: "150px" }, // Tên cột "Số điện thoại" với độ rộng 150px
        { name: "Địa chỉ", field: "address", width: "250px" }, // Tên cột "Địa chỉ" với độ rộng 250px
        { name: "CCCD", field: "identication", width: "150px" }, // Tên cột "CCCD" với độ rộng 150px
        {
          name: "Chuẩn đoán gần nhất",
          field: "lastDiagnose",
          width: "250px",
        }, // Tên cột "Chuẩn đoán gần nhất" với độ rộng 250px
        {
          name: "Ngày khám gần nhất",
          field: "lastDiagnoseDate",
          type: "time",
          width: "150px",
        }, // Tên cột "Ngày khám gần nhất" với độ rộng 150px
      ],
      data: [],
      total: 0,
      payload: {
        currentPage: 1,
        pageSize: 20,
        textSearch: "",
      },
      showPopup: false,
      titleDetail: "Chi tiết bệnh nhân",
      currentItem: {},
      isAdd: false,
      idField: "PatientID",
      dataGender: [
        {
          gender: 1,
          text: "Nam",
        },
        {
          gender: 2,
          text: "Nữ",
        },
        {
          gender: 0,
          text: "Khác",
        },
      ],
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
      let res = await patientApi.getListAsync(payload);
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
      let res = await patientApi.insertOrUpdateAsync(me.currentItem);
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
      let res = await patientApi.deleteAsync(
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