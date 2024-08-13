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
  </div>
  <MyChart></MyChart>
</template>

<script>
import MyChart from "@/views/admin/MyChart.vue";

export default {
  /**
   * Tên component
   */
  name: "StatisticsManagement",
  /**
   * Hứng nhận
   */
  props: {},
  /**
   * Component được sử dụng
   */
  components: { MyChart },
  /**
   * Data
   */
  data() {
    return {
      fullName: localStorage.getItem("fullname"),
      showLogout: false,
    };
  },
  computed: {},
  /**
   * Phương thức
   */
  methods: {
    closeBtn() {
      this.showLogout = false;
    },
    showBtnLogout() {
      this.showLogout = !this.showLogout;
    },
    logout() {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("fullname");
      this.$router.push("/login");
    },
  },
  created() {},
  /**
   * Theo dõi sự thay đổi
   */
  watch: {},
};
</script>

<style scope>
@import url(../../assets/css/admin/admingrid.css);
.text-decr {
  text-decoration: underline;
}
</style>
