<template>
  <div>
    <ms-admin-grid
      :title="title"
      :columns="columns"
      :data="data"
      :total="total"
      :idField="idField"
      @loadData="loadData"
      @upgradeRow="addoredit"
      @editRow="addoredit"
      @add="addoredit"
      @deleteRow="deleteRow"
    ></ms-admin-grid>
  </div>

  <ms-popup
    v-if="showPopup"
    @close="closePopup"
    @save="save"
    :placeholderSave="getPlaceholderSave()"
    :showButtonDetail="currentItem.status === 0 || currentItem.status === 1"
  >
    <template v-slot:header>
      {{ titleDetail }}
    </template>
    <template v-slot:body>
      <div class="field-item">
        <div style="width: 150px;">Bác sĩ khám</div>
        <ms-combobox
          :useApi="false"
          :dataProps="dataDoctor"
          v-model="currentItem.doctorID"
          propValue="doctorID"
          propName="fullname"
          ref="cbxDoctor"
          style="width: 500px;"
        ></ms-combobox>
      </div>
      <div class="field-item">
        <div style="width: 150px;">Bệnh nhân khám</div>
        <ms-combobox
          :useApi="false"
          :dataProps="dataPatient"
          v-model="currentItem.patientID"
          propValue="patientID"
          propName="fullname"
          ref="cbxPatient"
          style="width: 500px;"
        ></ms-combobox>
      </div>
      <div class="field-item">
        <div style="width: 150px;">Thời gian khám</div>
        <el-date-picker
          v-model="currentItem.dateScheduled"
          format="YYYY/MM/DD HH:mm:ss"
          type="datetime"
          placeholder="Chọn ngày"
        >
        </el-date-picker>
      </div>
      <div class="field-item">
        <div style="width: 150px;">Nội dung khám</div>
        <ms-input
          :inpPopupDetail="true"
          v-model="currentItem.examContent"
        ></ms-input>
      </div>
      <div class="field-item">
        <div style="width: 150px;">Trạng thái</div>
        <div>{{ getStatus() }}</div>
      </div>
    </template>
    <template v-slot:footer></template>
  </ms-popup>
</template>

<script>
import examScheduleApi from "@/js/api/managerment/examScheduleApi";
import patientApi from "@/js/api/managerment/patientApi";
import enumResouce from "@/js/resource/resource";
import userAPI from "@/js/api/systemmanagement/userApi";
export default {
  /**
   * Tên component
   */
  name: "ExamScheduleManagement",
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
      title: "Danh sách lịch hẹn khám",
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
      },
      showPopup: false,
      titleDetail: "Chi tiết lịch hẹn khám",
      currentItem: {},
      isAdd: false,
      idField: "examScheduleID",
      dataPatient: [],
      dataDoctor: [],
    };
  },
  computed: {},
  /**
   * Phương thức
   */
  methods: {
    getDataDate() {
      if (this.currentItem.dateScheduled) {
        // Chuyển đổi sang đối tượng dayjs
        const scheduledDate = this.$dayjs(this.currentItem.dateScheduled).tz(
          "Asia/Ho_Chi_Minh"
        ); // Chuyển đổi sang múi giờ 'Asia/Ho_Chi_Minh'

        // Định dạng ngày giờ theo đúng format để gửi lên backend
        const formattedDate = scheduledDate.format("YYYY-MM-DDTHH:mm:ss[Z]");

        // Tạo đối tượng Date từ chuỗi đã định dạng
        return new Date(formattedDate);
      } else {
        // Nếu không có dateScheduled thì trả về ngày hiện tại
        return new Date();
      }
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
    getPlaceholderSave() {
      const me = this;
      //Xác định theo stattus
      if (me.isAdd) {
        return "Tạo mới";
      } else {
        switch (me.currentItem.status) {
          case enumResouce.statusExamSchedule.Add:
            return "Lưu";
          case enumResouce.statusExamSchedule.WaitingExamination:
            return "Chờ tới khám";
          // case enumResouce.statusExamSchedule.Examined:
          //   return "Đã khám";
          // case enumResouce.statusExamSchedule.Overdue:
          //   return "Quá hạn";
          // case enumResouce.statusExamSchedule.Canceled:
          //   return "Đã hủy";
          default:
            return "";
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
          if (item.status === 0) {
            item.updateRow = false;
            item.upGradeRow = true;
          } else {
            item.updateRow = true;
            item.upGradeRow = false;
          }
        });
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
    async addoredit(data = {}, isNew = false, isUpgrade = false) {
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
    },

    /**
     * Lưu fỏrm
     * @param {*} isNew
     */
    async save() {
      const me = this;
      //Thêm mới hoặc sửa
      if (me.isAdd || me.currentItem.status === 0) {
        let obj = this.data.find(
          (x) => x[this.idField] == this.currentItem[this.idField]
        );
        let param = {
          examSchedule: {
            examScheduleID: me.isAdd
              ? me.currentItem.examScheduleID
              : obj.examScheduleID,
            dateScheduled: me.getDataDate(),
            patientID: me.currentItem.patientID,
            doctorID: me.currentItem.doctorID,
            status: me.isAdd ? 0 : me.currentItem.status,
            examContent: me.currentItem.examContent,
          },
          examResult: {
            examResultID: me.isAdd ? 0 : obj.examResultID,
            examResultNumber: "",
            patientID: me.isAdd ? me.currentItem.patientID : obj.patientID,
            doctorID: me.currentItem.doctorID,
            examScheduleID: me.isAdd
              ? me.currentItem.examScheduleID
              : obj.examScheduleID,
            examDate: me.getDataDate(),
            feeExam: 0,
            feeMedicine: 0,
            feeTotal: 0,
            diagnose: "",
            handlingDirection: "",
            examContent: me.currentItem.examContent,
          },
        };
        if (me.isAdd) {
          param.examResult.status = 1; // Thêm trường "status" với giá trị 1
        }
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
      } else {
        //Update status
        let param = {
          examScheduleID: me.currentItem.examScheduleID,
          status: me.currentItem.status,
        };
        let res = await examScheduleApi.updateStatusAsync(param);
        if (res && res.status == 200) {
          me.$toast.success(
            `Chuyển trạng thái ${me.getPlaceholderSave()} thành công`
          );
        } else if (res && res.status == 400) {
          me.$toast.warning(res.errorMessage);
        } else {
          me.$toast.error("Có lỗi xảy ra vui lòng thử lại");
        }
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
      let res = await examScheduleApi.deleteAsync(
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
