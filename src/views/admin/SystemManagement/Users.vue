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
        <div style="width: 150px">
          Họ và Tên <span class="input-requied">*</span>
        </div>
        <ms-input
          :inpPopupDetail="true"
          v-model="currentItem.fullname"
          required
          ref="inpFullName"
        ></ms-input>
      </div>
      <div class="field-item">
        <div style="width: 150px">
          Tài khoản <span class="input-requied">*</span>
        </div>
        <ms-input
          :inpPopupDetail="true"
          v-model="currentItem.username"
          required
          ref="inpUserName"
        ></ms-input>
      </div>
      <div class="field-item">
        <div style="width: 150px">
          Mật khẩu <span class="input-requied">*</span>
        </div>
        <ms-input
          :inpPopupDetail="true"
          v-model="currentItem.password"
          required
          ref="inpPassword"
        ></ms-input>
      </div>
      <div class="field-item">
        <div style="width: 150px">Chức vụ</div>
        <ms-combobox
          :useApi="false"
          :dataProps="dataPositon"
          v-model="currentItem.positionID"
          propValue="positionID"
          propName="positionName"
          ref="cbxPosition"
          style="width: 500px"
        ></ms-combobox>
      </div>
      <div class="field-item">
        <div style="width: 150px">Phòng</div>
        <ms-combobox
          :useApi="false"
          :dataProps="dataRoom"
          v-model="currentItem.clinicID"
          propValue="clinicID"
          propName="clinicName"
          ref="cbxClinic"
          style="width: 500px"
        ></ms-combobox>
      </div>
      <div class="field-item">
        <div style="width: 150px">Chuyên môn</div>
        <ms-combobox
          :useApi="false"
          :dataProps="dataSpecialties"
          v-model="currentItem.specialistID"
          propValue="specialistID"
          propName="specialistName"
          ref="cbxSpecialist"
          style="width: 500px"
        ></ms-combobox>
      </div>
      <div class="field-item">
        <div style="width: 150px">Quyền</div>
        <ms-combobox
          :useApi="false"
          :dataProps="dataRole"
          v-model="currentItem.roleID"
          propValue="roleID"
          propName="roleName"
          ref="cbxRole"
          style="width: 500px"
        ></ms-combobox>
      </div>
    </template>
    <template v-slot:footer></template>
  </ms-popup>
</template>
  
  <script>
import userApi from "@/js/api/systemmanagement/userApi";
import roomAPI from "@/js/api/systemmanagement/roomApi";
import permissionApi from "@/js/api/systemmanagement/permissionApi";
import specialistApi from "@/js/api/systemmanagement/specialistApi";
import positionApi from "@/js/api/systemmanagement/positionApi";
export default {
  /**
   * Tên component
   */
  name: "UsersManagement",
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
      title: "Danh sách người dùng",
      columns: [
        { name: "Họ và Tên", field: "fullname", width: "200px" },
        { name: "Tài khoản", field: "username", width: "200px" },
        { name: "Chức vụ", field: "positionName", width: "150px" },
        { name: "Phòng", field: "clinicName", width: "150px" },
        { name: "Chuyên môn", field: "specialistName", width: "200px" },
        { name: "Quyền", field: "roleName", width: "150px" },
      ],
      data: [],
      total: 0,
      payload: {
        currentPage: 1,
        pageSize: 20,
        textSearch: "",
      },
      showPopup: false,
      titleDetail: "Chi tiết người dùng",
      currentItem: {},
      isAdd: false,
      idField: "userID",
      dataRoom: [],
      dataRole: [],
      dataPositon: [],
      dataSpecialties: [],
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
      let res = await userApi.getListAsync(payload);
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
      me.currentItem = data;
      me.isAdd = isNew;
      let resRoom = await roomAPI.getDataComboboxAsync();
      if (resRoom && resRoom.length >= 0) {
        me.dataRoom = resRoom;
      }
      let resRole = await permissionApi.getDataComboboxAsync();
      if (resRole && resRole.length >= 0) {
        me.dataRole = resRole;
      }
      let resPositon = await positionApi.getDataComboboxAsync();
      if (resPositon && resPositon.length >= 0) {
        me.dataPositon = resPositon;
      }
      let resSpecialt = await specialistApi.getDataComboboxAsync();
      if (resSpecialt && resSpecialt.length >= 0) {
        me.dataSpecialties = resSpecialt;
      }
      me.showPopup = true;
    },

    /**
     * Lưu fỏrm
     * @param {*} isNew
     */
    async save() {
      const me = this;
      let valite = ["inpFullName", "inpUserName", "inpPassword"];
      let valid = false;
      valite.forEach((item) => {
        let ret = me.$refs[item].validateInput();
        if (ret) {
          valid = ret;
        }
      });
      if (valid) {
        return;
      }
      let res = await userApi.insertOrUpdateAsync(me.currentItem);
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
      let res = await userApi.deleteAsync(`${me.idField}=${data[me.idField]}`);
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
.input-requied {
  color: red;
}
</style>