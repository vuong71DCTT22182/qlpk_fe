import { createRouter, createWebHistory } from "vue-router";
import ForBidden from "@/views/ForBidden.vue"; // Trang báo lỗi 403
import NotFound from "@/views/NotFound.vue"; // Trang báo lỗi 404
//login
import Login from "@/views/Login.vue";

// Admin
import AdminHome from "@/views/admin/AdminHome.vue"; // Trang chủ quản trị
import Statistics from "@/views/admin/Statistics.vue"; // Trang thống kê

// Management
import Management from "@/views/admin/Management/Management.vue"; // Trang quản lý
import PatientReception from "@/views/admin/Management/PatientReception.vue"; // Trang tiếp đón bệnh nhân
import ExamResult from "@/views/admin/Management/ExamResult.vue"; // Trang danh sách phiếu khám bệnh
import Patients from "@/views/admin/Management/Patients.vue"; // Trang danh sách bệnh nhân
import Appointments from "@/views/admin/Management/ExamSchedule.vue"; // Trang lịch hẹn khám
import MedicalHistory from "@/views/admin/Management/MedicalHistory.vue"; // Trang lịch sử khám bệnh

// Catalog Management
import CatalogManagement from "@/views/admin/CatalogManagement/CatalogManagement.vue"; // Trang quản lý danh mục
import Medicine from "@/views/admin/CatalogManagement/Medicine.vue"; // Trang danh mục chỉ số khám
import MedicineCate from "@/views/admin/CatalogManagement/MedicineCate.vue"; // Trang danh mục chỉ số khám
import Examination from "@/views/admin/CatalogManagement/Examination.vue"; // Trang danh mục thuốc
import Dosage from "@/views/admin/CatalogManagement/Dosage.vue"; // Trang danh mục thuốc
import ExamCate from "@/views/admin/CatalogManagement/ExamCate.vue"; // Trang danh mục thuốc

// System Management
import SystemManagement from "@/views/admin/SystemManagement/SystemManagement.vue"; // Trang quản trị hệ thống
import Users from "@/views/admin/SystemManagement/Users.vue"; // Trang quản lý người dùng
import Rooms from "@/views/admin/SystemManagement/Rooms.vue"; // Trang quản lý phòng
import Permissions from "@/views/admin/SystemManagement/Permissions.vue"; // Trang danh sách quyền
import Positions from "@/views/admin/SystemManagement/Positions.vue"; // Trang danh mục chức vụ
import Specialties from "@/views/admin/SystemManagement/Specialties.vue"; // Trang danh mục chuyên khoa

const routes = [
  {
    path: "/",
    component: AdminHome,
    children: [
      { path: "statistics", component: Statistics }, // Đường dẫn đến trang thống kê
      {
        path: "examination-management",
        component: Management,
        children: [
          { path: "patient-reception", component: PatientReception }, // Đường dẫn đến trang tiếp đón bệnh nhân
          { path: "exam-result", component: ExamResult }, // Đường dẫn đến trang danh sách phiếu khám bệnh
          { path: "patients", component: Patients }, // Đường dẫn đến trang danh sách bệnh nhân
          { path: "appointments", component: Appointments }, // Đường dẫn đến trang lịch hẹn khám
          { path: "medical-history", component: MedicalHistory }, // Đường dẫn đến trang lịch sử khám bệnh
        ],
      },
      {
        path: "catalog-management",
        component: CatalogManagement,
        children: [
          { path: "medical", component: Medicine }, // Đường dẫn đến trang danh mục chỉ số khám
          { path: "medicalcate", component: MedicineCate }, // Đường dẫn đến trang danh mục chỉ số khám
          { path: "examination", component: Examination }, // Đường dẫn đến trang danh mục thuốc
          { path: "examcate", component: ExamCate }, // Đường dẫn đến trang danh mục thuốc
          { path: "dosage", component: Dosage }, // Đường dẫn đến trang lịch sử khám bệnh
        ],
      },
      {
        path: "system-management",
        component: SystemManagement,
        children: [
          { path: "users", component: Users }, // Đường dẫn đến trang quản lý người dùng
          { path: "rooms", component: Rooms }, // Đường dẫn đến trang quản lý phòng
          { path: "permissions", component: Permissions }, // Đường dẫn đến trang danh sách quyền
          { path: "positions", component: Positions }, // Đường dẫn đến trang danh mục chức vụ
          { path: "specialties", component: Specialties }, // Đường dẫn đến trang danh mục chuyên khoa
        ],
      },
    ],
  },
  {
    name: "login",
    path: "/login",
    component: Login,
  },
  {
    name: "logout",
    path: "/logout",
    component: Login,
  },
  // Trang báo lỗi 403 và 404
  { name: "forbidden", path: "/forbidden", component: ForBidden },
  {
    path: "/:catchAll(.*)",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
  scrollBehavior(to, from, savedPosition) {},
});

export default router;
