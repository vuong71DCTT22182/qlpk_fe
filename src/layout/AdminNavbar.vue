<template>
  <div class="nav">
    <div class="anav-list">
      <div class="admin-info">
        <img src="../assets/image/logonhakhoa.jpg" alt="" />
      </div>

      <!-- Mục menu Thống kê -->
      <div
        class="anav-item anav-menu"
        :class="{
          'item-active': checkActive('/statistics'),
          active: activeItem === 'statistics',
        }"
        @click.stop="changeRouter('/statistics')"
        v-if="checkRole([1, 2])"
      >
        <div class="anav__text">
          Thống kê
        </div>
      </div>

      <!-- Mục menu Quản lý khám -->
      <div
        class="anav-item anav-menu"
        :class="{
          'item-active':
            checkActive('/examination-management') || expandedItems.examination,
          active: activeItem === 'examination',
        }"
        @click="toggleSubMenu('examination')"
      >
        <div class="anav__text">
          Quản lý khám
        </div>
        <i
          class="fa-solid"
          :class="{
            'fa-plus': !expandedItems.examination,
            'fa-minus': expandedItems.examination,
          }"
        ></i>
      </div>
      <div class="anav-submenu" v-show="expandedItems.examination">
        <div
          class="anav-item-submenu"
          @click.stop="
            changeRouter('/examination-management/patient-reception')
          "
          v-if="checkRole([1, 3])"
        >
          <div class="anav__texts">Tiếp đón bệnh nhân</div>
        </div>
        <div
          class="anav-item-submenu"
          @click.stop="changeRouter('/examination-management/exam-result')"
          v-if="checkRole([1, 2])"
        >
          <div class="anav__texts">DS phiếu khám bệnh</div>
        </div>
        <div
          class="anav-item-submenu"
          @click.stop="changeRouter('/examination-management/patients')"
          v-if="checkRole([1, 2, 3])"
        >
          <div class="anav__texts">DS bệnh nhân</div>
        </div>
        <div
          class="anav-item-submenu"
          @click.stop="changeRouter('/examination-management/appointments')"
          v-if="checkRole([1, 2, 3])"
        >
          <div class="anav__texts">Lịch hẹn khám</div>
        </div>
        <div
          class="anav-item-submenu"
          @click.stop="changeRouter('/examination-management/medical-history')"
          v-if="checkRole([1, 2, 3])"
        >
          <div class="anav__texts">Lịch sử khám bệnh</div>
        </div>
      </div>

      <!-- Mục menu Quản lý danh mục -->
      <div
        class="anav-item anav-menu"
        :class="{
          'item-active':
            checkActive('/catalog-management') || expandedItems.catalog,
          active: activeItem === 'catalog',
        }"
        style="margin-top: 4px;"
        @click="toggleSubMenu('catalog')"
        v-if="checkRole([1, 2])"
      >
        <div class="anav__text">
          Quản lý danh mục
        </div>
        <i
          class="fa-solid"
          :class="{
            'fa-plus': !expandedItems.catalog,
            'fa-minus': expandedItems.catalog,
          }"
        ></i>
      </div>
      <div class="anav-submenu" v-show="expandedItems.catalog">
        <div
          class="anav-item-submenu"
          @click.stop="changeRouter('/catalog-management/examcate')"
        >
          <div class="anav__texts">Danh mục chỉ số khám</div>
        </div>
        <div
          class="anav-item-submenu"
          @click.stop="changeRouter('/catalog-management/examination')"
        >
          <div class="anav__texts">Danh sách chỉ số khám</div>
        </div>
        <div
          class="anav-item-submenu"
          @click.stop="changeRouter('/catalog-management/medicalcate')"
        >
          <div class="anav__texts">Danh mục thuốc</div>
        </div>
        <div
          class="anav-item-submenu"
          @click.stop="changeRouter('/catalog-management/medical')"
        >
          <div class="anav__texts">Danh sách thuốc</div>
        </div>
        <div
          class="anav-item-submenu"
          @click.stop="changeRouter('/catalog-management/dosage')"
        >
          <div class="anav__texts">Quản lý liều dùng</div>
        </div>
      </div>
      <!-- Mục menu Quản trị hệ thống -->
      <div
        class="anav-item anav-menu"
        :class="{
          'item-active':
            checkActive('/system-management') || expandedItems.system,
          active: activeItem === 'system',
        }"
        style="margin-top: 4px;"
        @click="toggleSubMenu('system')"
        v-if="checkRole([1])"
      >
        <div class="anav__text">
          Quản trị hệ thống
        </div>
        <i
          class="fa-solid"
          :class="{
            'fa-plus': !expandedItems.system,
            'fa-minus': expandedItems.system,
          }"
        ></i>
      </div>
      <div class="anav-submenu" v-show="expandedItems.system">
        <div
          class="anav-item-submenu"
          @click.stop="changeRouter('/system-management/users')"
        >
          <div class="anav__texts">Quản lý người dùng</div>
        </div>
        <div
          class="anav-item-submenu"
          @click.stop="changeRouter('/system-management/rooms')"
        >
          <div class="anav__texts">Quản lý phòng</div>
        </div>
        <div
          class="anav-item-submenu"
          @click.stop="changeRouter('/system-management/permissions')"
        >
          <div class="anav__texts">Danh sách quyền</div>
        </div>
        <div
          class="anav-item-submenu"
          @click.stop="changeRouter('/system-management/positions')"
        >
          <div class="anav__texts">Danh mục chức vụ</div>
        </div>
        <div
          class="anav-item-submenu"
          @click.stop="changeRouter('/system-management/specialties')"
        >
          <div class="anav__texts">Danh mục chuyên khoa</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminNavbar",
  data() {
    return {
      expandedItems: {
        statistics: false,
        examination: false,
        catalog: false,
        system: false,
      },
      activeItem: null, // Dùng để làm nổi bật mục menu đang được chọn
    };
  },
  methods: {
    checkActive(data) {
      return this.$route.path.includes(data);
    },
    changeRouter(url) {
      if (this.$route.path !== url) {
        this.$router.push(url);
        // Đóng tất cả các submenu khác
        Object.keys(this.expandedItems).forEach((key) => {
          this.expandedItems[key] = false;
        });
      }
    },
    checkRole(role = []) {
      const me = this;
      let roleId = localStorage.getItem("roleId");
      if (role.length >= 0 && roleId) {
        return role.includes(Number.parseInt(roleId));
      }
      return false;
    },
    toggleSubMenu(item) {
      if (this.activeItem === item) {
        this.activeItem = null;
      } else {
        this.activeItem = item;
      }
      // Đóng tất cả các submenu khác
      Object.keys(this.expandedItems).forEach((key) => {
        if (key !== item) {
          this.expandedItems[key] = false;
        }
      });
      this.expandedItems[item] = !this.expandedItems[item];
    },
  },
};
</script>

<style>
@import url(../assets/css/admin/adminnavbar.css);
</style>
