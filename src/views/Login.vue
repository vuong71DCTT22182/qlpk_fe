<template>
  <div class="login-container">
    <div class="login-form">
      <!-- <span>Đăng nhập</span> -->
      <div class="input-login">
        <span class="text-lo">Tên đăng nhập:</span>
        <el-input
          v-model="username"
          style="width: 240px;"
          placeholder="Nhập tên đăng nhập"
        />
      </div>
      <div class="input-login">
        <span class="text-lo">Mật khẩu:</span>
        <el-input
          v-model="password"
          style="width: 240px;"
          type="password"
          placeholder="Nhập mật khẩu"
          show-password
        />
      </div>
      <div class="btn-login">
        <el-button type="success" @click="loginAsync">Đăng nhập</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import authenticationApi from "@/js/api/authenticationApi";
export default {
  /**
   * Tên component
   */
  name: "LoginHome",
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
      username: "",
      password: "",
    };
  },
  computed: {},
  /**
   * Phương thức
   */
  methods: {
    async loginAsync() {
      const me = this;
      if (me.username == "" || me.password == "") {
        me.$toast.warning("Bạn đã nhập thiếu tên đăng nhập hoặc mật khẩu!");
        return;
      }
      let res = await authenticationApi.LoginAsync({
        username: me.username,
        password: me.password,
      });
      if (res && res.data) {
        me.$toast.success("Đăng nhập thành công");
        localStorage.setItem("jwtToken", res.data.token);
        localStorage.setItem("fullname", res.data.userInfo.fullname);
        localStorage.setItem("roleId", res.data.role.roleID);
        if (res.data.role.roleID && res.data.role.roleID != 3) {
          me.$router.push("/statistics");
        } else {
          me.$router.push("/examination-management/patient-reception");
        }
      } else if (res && res.status == 400) {
        me.$toast.warning("Tên đăng nhập hoặc mật khẩu không chính xác!");
      }
    },
  },
  created() {},

  /**
   * Theo dõi sự thay đổi
   */
  watch: {},
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-image: url("../assets/image/login.jpg"); /* Đường dẫn tới ảnh nền */
  background-size: cover;
  background-position: center;
}

.login-form {
  background: rgba(255, 255, 255, 0.8); /* Màu nền trắng với độ trong suốt */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.text-lo {
  width: 200px;
}

.input-login {
  display: flex;
  align-items: center;
  margin: 10px 0;
}
.btn-login {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
