<template>
  <div>
    <ms-admin-grid :showAction="false" :showButtonAdd="true" :title="title" :columns="columns" :data="data"
      :total="total" :idField="idField" @loadData="loadData" @upgradeRow="addoredit" @add="addoredit"></ms-admin-grid>
  </div>
  <ms-popup v-if="showPopup" @close="closePopup" @save="save" :placeholderSave="'Lưu'"
    :showButtonDetail="currentItem.status === 0 || currentItem.status === 1">
    <template v-slot:header>
      {{ titleDetail }}
    </template>
    <template v-slot:body>
      <div class="field-item">
        <div style="width: 150px;">Bác sĩ khám</div>
        <ms-combobox :useApi="false" :dataProps="dataDoctor" v-model="currentItem.doctorID" propValue="doctorID"
          propName="fullname" ref="cbxDoctor" style="width: 500px;"></ms-combobox>
      </div>
      <div class="field-item">
        <div style="width: 150px;">Bệnh nhân khám</div>
        <ms-combobox :useApi="false" :dataProps="dataPatient" v-model="currentItem.patientID" propValue="patientID"
          propName="fullname" ref="cbxPatient" style="width: 500px;"></ms-combobox>
      </div>
      <div class="field-item">
        <div style="width: 150px;">Thời gian khám</div>
        <el-date-picker v-model="currentItem.dateScheduled" format="YYYY/MM/DD HH:mm:ss" type="datetime"
          placeholder="Chọn ngày">
        </el-date-picker>
      </div>
      <div class="field-item">
        <div style="width: 150px;">Nội dung khám</div>
        <ms-input :inpPopupDetail="true" v-model="currentItem.examContent"></ms-input>
      </div>
      <div class="field-item">
        <div style="width: 150px;">Trạng thái</div>
        <div>Chờ tới khám</div>
      </div>
    </template>
    <template v-slot:footer></template>
  </ms-popup>
</template>

<script>
import examResultAPI from "@/js/api/managerment/examResultApi";
import examScheduleApi from "@/js/api/managerment/examScheduleApi";
import patientApi from "@/js/api/managerment/patientApi";
import enumResouce from "@/js/resource/resource";
import userAPI from "@/js/api/systemmanagement/userApi";
export default {
  /**
   * Tên component
   */
  name: "PatientReceptionManagement",
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
      title: "Danh sách tiếp đón bệnh nhân",
      columns: [
        { name: "Họ và tên", field: "patientName", width: "200px" }, // Tên cột "Họ và tên" với độ rộng 200px
        { name: "Mã bệnh nhân", field: "patientNumber", width: "150px" }, // Tên cột "Mã bệnh nhân" với độ rộng 150px
        {
          name: "Thời gian khám",
          field: "dateScheduled",
          type: "datetime",
          width: "150px",
        }, // Tên cột "Thời gian khám" với độ rộng 150px
        { name: "Bác sĩ khám", field: "doctorName", width: "150px" }, // Tên cột "Mã bệnh nhân" với độ rộng 150px
        { name: "Nội dung khám", field: "examContent", width: "150px" }, // Tên cột "Mã bệnh nhân" với độ rộng 150px
        { name: "Trạng thái", field: "statusName", width: "150px" }, // Tên cột "Trạng thái" với độ rộng 150px
      ],
      data: [],
      total: 0,
      payload: {
        currentPage: 1,
        pageSize: 20,
        textSearch: "",
        status: 1,
      },
      showPopup: false,
      titleDetail: "Chi tiết lịch hẹn khám",
      currentItem: {},
      isAdd: false,
      idField: "examScheduleID",
      timeZone: "Asia/Ho_Chi_Minh",
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
      dataPatient: [],
      dataDoctor: [],
    };
  },
  computed: {},
  /**
   * Phương thức
   */
  methods: {
    /**
     * Lưu fỏrm
     * @param {*} isNew
     */
    async save() {
      const me = this;
      let param = {
        examSchedule: {
          examScheduleID: 0,
          dateScheduled: this.$convertToLocalTime(me.currentItem.dateScheduled),
          patientID: me.currentItem.patientID,
          doctorID: me.currentItem.doctorID,
          status: 1,
          examContent: me.currentItem.examContent,
        },
        examResult: {
          examResultID: 0,
          examResultNumber: "",
          patientID: me.currentItem.patientID,
          doctorID: me.currentItem.doctorID,
          examScheduleID: 0,
          examDate: this.$convertToLocalTime(me.currentItem.dateScheduled),
          feeExam: 0,
          feeMedicine: 0,
          feeTotal: 0,
          diagnose: "",
          handlingDirection: "",
          examContent: me.currentItem.examContent,
          status: 1
        },
      };

      let res = await examScheduleApi.insertOrUpdateAsync(param);
      if (me.isAdd) {
        res
          ? me.$toast.success("Thêm mới thành công")
          : me.$toast.error("Thêm mới thất bại");
      } else {
        res
          ? me.$toast.success("Sửa thành công")
          : me.$toast.error("Sửa thất bại");
      }
      me.showPopup = false
      await me.loadData();
    },

    /**
 * Đóng form
 */
    closePopup() {
      const me = this;
      me.showPopup = false;
      me.loadData();
    },
    getStatus() {
      const me = this;
      //Xác định theo stattus
      if (me.isAdd) {
        return "Mới tạo";
      } else {
        let status = me.currentItem.status;
        if (status > 0) {
          status -= 1;
        }

        switch (status) {
          case enumResouce.statusExamSchedule.Add:
            return "Mới tạo";
          case enumResouce.statusExamSchedule.WaitingExamination:
            return "Chờ tới khám";
          case enumResouce.statusExamSchedule.Examined:
            return "Đã khám";
          case enumResouce.statusExamSchedule.Overdue:
            return "Quá hạn";
          case enumResouce.statusExamSchedule.Canceled:
            return "Đã hủy";
          default:
            return "";
          //Xác định theo stattus
        }
      }
    },
    /**
     * Load data
     * @param {*} param
     */
    async loadData(param = {}) {
      const me = this;
      let payload = { ...me.payload, ...param };
      let res = await examScheduleApi.getListAsync(payload);
      if (res && res.data.length >= 0 && res.total >= 0) {
        res.data.forEach((item) => {
          if (item.status == 1) {
            item.updateRow = true;
            item.upGradeRow = true;
          }
        });
        me.data = res.data;
        me.total = res.total;
      }
    },

    /**
     * Thêm hoặc sửa
     * @param {*} data
     * @param {*} isNew
     */
    async addoredit(data = {}, isNew = false, isUpgrade = false) {
      const me = this;
      if (isNew) {
        const me = this;
        me.isAdd = isNew;
        me.currentItem = data;
        if (isNew) {
          me.currentItem.status = 0;
        }
        if (isUpgrade) {
          me.currentItem.status += 1;
        }
        let res = await patientApi.getDataComboboxAsync();
        if (res && res.length >= 0) {
          me.dataPatient = res;
        }
        let resDoctors = await userAPI.getAllDoctorAsync();
        if (resDoctors && resDoctors.data.length > 0) {
          me.dataDoctor = resDoctors.data;
        }
        me.showPopup = true;
        return;
      }

      //Trạng thái chờ khám => đang khám
      if (data.status == 1) {
        // data.status += 1; // Đang khám
        let res = await examResultAPI.receiptPatientAsync(data.examResultID);
        if (res) {
          me.$toast.success("Tiếp đón bệnh nhân thành công");
        } else {
          me.$toast.error("Có lỗi xảy ra");
        }
        // Lấy ngày hiện tại
        const today = new Date();

        // Đặt giờ phút giây của ngày hiện tại thành 00:00:00
        today.setHours(0, 0, 0, 0);

        // Tạo ngày kết thúc là ngày hiện tại với giờ phút giây là 23:59:59
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);
        let param = {
          fromDate: this.$convertToLocalTime(today),
          toDate: this.$convertToLocalTime(endOfDay),
        };
        me.loadData(param);
        return;
      }
    },
  },
  async created() {
    const me = this;
    // Lấy ngày hiện tại
    const today = new Date();

    // Đặt giờ phút giây của ngày hiện tại thành 00:00:00
    today.setHours(0, 0, 0, 0);

    // Tạo ngày kết thúc là ngày hiện tại với giờ phút giây là 23:59:59
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    let param = {
      fromDate: this.$convertToLocalTime(today),
      toDate: this.$convertToLocalTime(endOfDay),
    };
    me.loadData(param);
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
