<template>
  <div>
    <div class="ahomecontent">
      <AdminNavbar></AdminNavbar>
      <div class="arouter-view-content" style="height: 100vh">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
  
<script>
import AdminNavbar from "@/layout/AdminNavbar.vue";
export default {
  /**
   * Tên component
   */
  name: "AdminHome",
  /**
   * Hứng nhận
   */
  props: {},
  /**
   * Component được sử dụng
   */
  components: {
    AdminNavbar,
  },
  /**
   * Data
   */
  data() {
    return {};
  },
  /**
   * Phương thức
   */
  methods: {},
  created() {},
  /**
   * Theo dõi sự thay đổi
   */
  watch: {},
  computed: {},
};
</script>
  
<style>
@import url(../../assets/css/admin/adminhome.css);
</style>