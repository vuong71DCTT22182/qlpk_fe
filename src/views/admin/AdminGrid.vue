<template>
  <div class="admin-content">
    <div
      class="header"
      v-click-outside-element="closeBtn"
      @click="showBtnLogout"
    >
      <div class="header1">
        <img
          class="header-img"
          src="../../assets/image/logonhakhoa.jpg"
          alt=""
        />
        <div :class="{ 'text-decr': showLogout }">Xin chào, {{ fullName }}</div>

        <i style="padding-left: 6px;" class="fa-solid fa-chevron-down"></i>
      </div>
      <div class="logout" v-show="showLogout" @click.stop="logout">
        Đăng xuất
      </div>
    </div>
    <div class="line"></div>
    <div class="title">{{ title }}</div>
    <div class="under-title">
      <ms-input
        :placeholder="'Tìm kiếm'"
        :inpPopupDetail="true"
        @enterInput="enterInput"
        v-model="textSearch"
      ></ms-input>
      <div class="filter-date">
        <el-date-picker
          v-if="showFilterDate"
          v-model="filterDate"
          type="datetimerange"
          range-separator="Đến"
          start-placeholder="Ngày bắt đầu"
          end-placeholder="Ngày kết thúc"
        />
      </div>
      <ms-button
        v-if="showButtonAdd"
        @actionButtonClick="actionButtonClick"
        :placeholder="'Thêm mới'"
      ></ms-button>
    </div>
    <div class="grid-viewer">
      <ms-grid-viewer
        :columns="columns"
        :data="data"
        :totalRecord="total"
        @upgradeRow="upgradeRow"
        @printRow="printRow"
        @editRow="editRow"
        @deleteRow="deleteRow"
        @loadData="loadData"
        :showAction="showAction"
      ></ms-grid-viewer>
    </div>
  </div>
</template>

<script>
export default {
  /**
   * Tên component
   */
  name: "AdminNavbar",
  /**
   * Hứng nhận
   */
  props: {
    title: {
      type: String,
      default: "",
    },
    columns: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
    total: {
      type: Number,
      default: 0,
    },
    idField: {
      type: String,
      default: "",
    },
    showButtonAdd: {
      type: Boolean,
      default: true,
    },
    showAction: {
      type: Boolean,
      default: true,
    },
    showFilterDate: {
      type: Boolean,
      default: false,
    },
  },
  /**
   * Component được sử dụng
   */
  components: {},
  /**
   * Data
   */
  data() {
    // Lấy ngày hiện tại
    const today = new Date();

    // Đặt giờ phút giây của ngày hiện tại thành 00:00:00
    today.setHours(0, 0, 0, 0);

    // Tạo ngày kết thúc là ngày hiện tại với giờ phút giây là 23:59:59
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    return {
      textSearch: "",
      fullName: localStorage.getItem("fullname"),
      showLogout: false,
      filterDate: [today, endOfDay],
    };
  },
  computed: {},
  /**
   * Phương thức
   */
  methods: {
    showBtnLogout() {
      this.showLogout = !this.showLogout;
    },
    closeBtn() {
      this.showLogout = false;
    },
    logout() {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("fullname");
      this.$router.push("/login");
    },
    actionButtonClick() {
      let obj = {
        [this.idField]: 0,
      };
      this.$emit("add", this.idField ? obj : {}, true);
    },

    enterInput(value) {
      const me = this;
      setTimeout(() => {
        me.$emit("loadData", {
          currentPage: 1,
          pageSize: 20,
          textSearch: value,
          filterDate: me.filterDate,
        });
      }, 300);
    },

    deleteRow(data) {
      this.$emit("deleteRow", data);
    },

    editRow(data) {
      this.$emit("editRow", data, false);
    },

    upgradeRow(data) {
      this.$emit("upgradeRow", data, false, true);
    },
    printRow(data) {
      this.$emit("printRow", data);
    },

    loadData(payload) {
      const me = this;
      me.$emit("loadData", {
        currentPage: payload.pageChoice,
        pageSize: payload.pageSize,
        textSearch: me.textSearch,
        filterDate: me.filterDate,
      });
    },
  },
  created() {},
  /**
   * Theo dõi sự thay đổi
   */
  watch: {
    filterDate: {
      handler(newVal, oldVal) {
        const me = this;
        me.$emit("loadData", {
          currentPage: 1,
          pageSize: 20,
          textSearch: me.textSearch,
          filterDate: newVal,
        });
      },
    },
  },
};
</script>

<style>
@import url(../../assets/css/admin/admingrid.css);
.text-decr {
  text-decoration: underline;
}
.filter-date {
  width: 400px;
  position: absolute;
  left: 530px;
}
.el-range-editor.el-input__wrapper {
  height: 36px !important;
}
</style>
