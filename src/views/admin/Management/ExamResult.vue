<template>
  <div>
    <ms-admin-grid
      :showButtonAdd="false"
      :showAction="false"
      :title="title"
      :columns="columns"
      :data="data"
      :total="total"
      :idField="idField"
      @upgradeRow="addoredit"
      @printRow="printRow"
      @loadData="loadData"
      @add="addoredit"
      @deleteRow="deleteRow"
    ></ms-admin-grid>
  </div>

  <ms-popup
    v-if="showPopupConfirmExam"
    @close="closePopup"
    @save="saveConfirmExam"
    :width="'60%'"
  >
    <template v-slot:header>
      {{ titleDetail }}
    </template>
    <template v-slot:body>
      <div style="width: 250px;">Danh sách chỉ số khám</div>
      <div class="field-item">
        <table class="examination-table">
          <thead>
            <tr>
              <th style="padding-left: 10px;">Tên chỉ số khám</th>
              <th style="padding-left: 10px;">Đơn giá(vnd)</th>
              <th style="padding-left: 10px;">Kết luận</th>
              <th></th>
              <!-- Cột chứa nút + -->
              <th></th>
              <!-- Cột chứa nút - -->
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in examinations"
              :key="item"
              class="examination-item"
            >
              <td class="td-item">
                <ms-combobox
                  :useApi="false"
                  :dataProps="dataExamination"
                  v-model="item.examCateID"
                  propValue="examinationID"
                  propName="examinationName"
                  ref="cbxMedicine"
                  style="width: 300px;"
                  @selected="selectedExamination($event, index)"
                ></ms-combobox>
              </td>
              <td class="td-item">
                <div style="width: 100px;">{{ formatNumber(item.fee) }}</div>
              </td>
              <td class="td-item">
                <ms-input v-model="item.diagnose"></ms-input>
              </td>
              <td>
                <div class="examination-button" @click.stop="addNewExamination">
                  +
                </div>
              </td>
              <td>
                <div
                  class="examination-button"
                  @click.stop="removeExamination(index)"
                >
                  -
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="field-item">
        <div style="width: 150px;">Chuẩn đoán</div>
        <ms-input
          :inpPopupDetail="true"
          v-model="comfirmExamRequest.diagnose"
        ></ms-input>
      </div>
      <div class="field-item">
        <div style="width: 150px;">Hướng xử lý</div>
        <ms-input
          :inpPopupDetail="true"
          v-model="comfirmExamRequest.handlingDirection"
        ></ms-input>
      </div>
    </template>
    <template v-slot:footer></template>
  </ms-popup>

  <ms-popup
    v-if="showPopupPrescription"
    @close="closePopup"
    @save="savePrescription"
    :width="'80%'"
  >
    <template v-slot:header>
      {{ titleDetailPrescription }}
    </template>
    <template v-slot:body>
      <div style="width: 150px;">Danh sách thuốc</div>
      <div class="field-item">
        <table class="examination-table">
          <thead>
            <tr>
              <th style="padding-left: 10px;">Tên thuốc</th>
              <th style="padding-left: 10px;">Đơn giá(vnd)</th>
              <th style="padding-left: 10px;">Đơn vị tính</th>
              <th style="padding-left: 10px;">Số lượng</th>
              <th style="padding-left: 10px;">Liều lượng</th>
              <th></th>
              <!-- Cột chứa nút + -->
              <th></th>
              <!-- Cột chứa nút - -->
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in medicines"
              :key="item"
              class="examination-item"
            >
              <td class="td-item">
                <ms-combobox
                  :useApi="false"
                  :dataProps="dataMedicine"
                  v-model="item.medicineID"
                  propValue="medicineID"
                  propName="medicineName"
                  ref="cbxMedicine"
                  style="width: 250px;"
                  @selected="selectedMedicine($event, index)"
                ></ms-combobox>
              </td>
              <td class="td-item">
                <div style="width: 100px;">{{ formatNumber(item.fee) }}</div>
              </td>
              <td class="td-item">
                <ms-input v-model="item.unit"></ms-input>
                <!-- <div style="width: 100px;">{{ item.unit }}</div> -->
              </td>
              <td class="td-item">
                <ms-input
                  :styleInput="dynamicStyle"
                  :type="'number'"
                  :minValue="1"
                  v-model="item.quantity"
                ></ms-input>
              </td>
              <td class="td-item">
                <ms-combobox
                  :useApi="false"
                  :dataProps="dataDosage"
                  v-model="item.dosage"
                  propValue="dosageID"
                  propName="dosageName"
                  ref="cbxMedicine"
                  style="width: 150px;"
                  @selected="selectedDosage($event, index)"
                ></ms-combobox>
                <!-- <ms-input v-model="item.dosage"></ms-input> -->
              </td>
              <td>
                <div class="examination-button" @click.stop="addNewMedicine">
                  +
                </div>
              </td>
              <td>
                <div
                  class="examination-button"
                  @click.stop="removeMedicine(index)"
                >
                  -
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="field-item">Tổng tiền : {{ formatNumber(getTotalFee) }}</div>
    </template>
    <template v-slot:footer></template>
  </ms-popup>
  <MsLoading v-if="showLoading"></MsLoading>
</template>

<script>
import medicineAPI from "@/js/api/catalogmanagement/medicineApi";
import examinationApi from "@/js/api/catalogmanagement/examinationApi";
import examResultAPI from "@/js/api/managerment/examResultApi";
import dosageAPI from "@/js/api/catalogmanagement/dosageApi";
import axios from "axios";
import MsLoading from "@/components/MsLoading.vue";
export default {
  /**
   * Tên component
   */
  name: "ExamResultManagement",
  /**
   * Hứng nhận
   */
  props: {},
  /**
   * Component được sử dụng
   */
  components: {
    MsLoading,
  },
  /**
   * Data
   */
  data() {
    return {
      title: "Danh sách phiếu khám bệnh",
      columns: [
        { name: "Số phiếu khám", field: "examResultNumber", width: "150px" }, // Cột Mã bệnh nhân, độ rộng 150px
        { name: "Họ và tên", field: "patientName", width: "200px" }, // Cột Họ và tên, độ rộng 200px
        { name: "Mã bệnh nhân", field: "patientNumber", width: "150px" }, // Cột Mã bệnh nhân, độ rộng 150px
        {
          name: "Thời gian khám",
          field: "examDate",
          type: "datetime",
          width: "200px",
        }, // Cột Thời gian khám, độ rộng 200px
        { name: "Nội dung khám", field: "examContent", width: "150px" }, // Cột Chỉ số khám, độ rộng 150px
        {
          name: "Trạng thái",
          field: "status",
          type: "examresultstatus",
          width: "150px",
        }, // Cột Trạng thái, độ rộng 150px
      ],
      data: [],
      total: 0,
      payload: {
        currentPage: 1,
        pageSize: 20,
        textSearch: "",
      },
      showPopupConfirmExam: false,
      showPopupPrescription: false,
      titleDetail: "Chi tiết chuẩn đoán bệnh",
      titleDetailPrescription: "Chi tiết thuốc",
      currentItem: {},
      isGrade: false,
      idField: "examResultID",
      medicines: [],
      examinations: [],
      dataMedicine: [],
      dataDosage: [],
      dataExamination: [],
      comfirmExamRequest: {},
      dynamicStyle: {
        width: "100px",
      },
      showLoading: false,
    };
  },
  computed: {
    getTotalFee() {
      return this.medicines.reduce((total, medicine) => {
        const fee = parseFloat(medicine.fee) || 0;
        const quantity = parseFloat(medicine.quantity) || 1; // Mặc định là 1 nếu không có quantity
        return total + fee * quantity;
      }, 0);
    },
  },
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
      let res = await examResultAPI.getListAsync(payload);
      if (res && res.data.length >= 0 && res.total >= 0) {
        res.data.forEach((item) => {
          if (item.status >= 1 && item.status <= 4) {
            item.updateRow = true;
            item.upGradeRow = true;
          } else if (item.status == 5) {
            item.updateRow = true;
            item.upGradeRow = false;
            item.printPDF = true;
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
      me.examinations = [];
      me.showPopupConfirmExam = false;
      me.medicines = [];
      me.showPopupPrescription = false;
      me.loadData();
    },

    /**
     * Thêm hoặc sửa
     * @param {*} data
     * @param {*} isNew
     */
    async addoredit(data = {}, isNew = false, isUpgrade = false) {
      const me = this;
      //Trạng thái chờ khám => đang khám
      if (data.status == 1) {
        data.status += 1; // Đang khám
        let res = await examResultAPI.insertOrUpdateAsync(data);
        if (res) {
          me.$toast.success("Chuyển sang đã khám thành công");
        } else {
          me.$toast.error("Có lỗi xảy ra");
        }
        return;
      }
      //Chuẩn đoán
      if (data.status == 2) {
        me.currentItem = data;
        me.isGrade = isUpgrade;
        if (isUpgrade) {
          if (me.examinations.length === 0) {
            me.examinations.push({ examinationName: "", fee: 0 });
          }
        }
        let resExamination = await examinationApi.getDataComboboxAsync();
        if (resExamination && resExamination.length > 0) {
          me.dataExamination = resExamination;
        }
        me.showPopupConfirmExam = true;
        return;
      }
      //Kê thuốc
      me.currentItem = data;
      me.isGrade = isUpgrade;
      if (isUpgrade) {
        if (me.medicines.length === 0) {
          me.medicines.push({ medicineName: "", feeMedicine: 0 });
        }
      }
      let res = await medicineAPI.getDataComboboxAsync();
      if (res && res.length > 0) {
        me.dataMedicine = res;
      }
      let resDosage = await dosageAPI.getDataComboboxAsync();
      if (resDosage && resDosage.length > 0) {
        me.dataDosage = resDosage;
      }
      me.showPopupPrescription = true;
    },

    async printRow(data) {
      const me = this;
      const pdfData = await examResultAPI.printPDFAsync(data.examResultID);
      if (pdfData) {
        const blob = new Blob([pdfData], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        window.open(url); // Mở tệp PDF trong tab mới
      } else {
        console.error("Không thể tải tệp PDF");
      }
    },

    async printPDFAsync(data) {
      const me = this;
      let endpoint = `${process.env.VUE_APP_API_URL}ExamResult/PrintResultPDF?ExamResultID=${data}`;
      try {
        me.showLoading = true;
        let res = await axios.post(endpoint, {}, { responseType: "blob" });

        me.showLoading = false;
        if (res && res.status === 200) {
          return res.data; // Trả về dữ liệu blob
        }

        return null;
      } catch (error) {
        console.error("Có lỗi xảy ra khi tải tệp PDF:", error);
        return null;
      }
    },

    /**
     * Lưu fỏrm
     * @param {*} isNew
     */
    async saveConfirmExam() {
      const me = this;
      me.examinations.forEach((x) => {
        x.examResultID = me.currentItem.examResultID;
      });
      let param = {
        listExamResultDetail: me.examinations,
        diagnose: me.comfirmExamRequest.diagnose,
        handlingDirection: me.comfirmExamRequest.handlingDirection,
        examResultID: me.currentItem.examResultID,
      };
      let res = await examResultAPI.comfirmExamAsync(param);
      res
        ? me.$toast.success("Đã khám thành công")
        : me.$toast.error("Đã khám thất bại");
      me.examinations = [];
      me.showPopupConfirmExam = false;
      await me.loadData();
    },

    async savePrescription() {
      const me = this;
      let param = me.medicines.map((x) => ({
        examResultID: me.currentItem.examResultID,
        medicineID: x.medicineID,
        feeOne: x.fee,
        quantity: x.quantity,
        totalFee: x.quantity * x.fee,
        unit: x.unit,
        dosage: x.dosage,
      }));

      const notDosage = param.some(
        (x) => !x.dosage || x.dosage == "" || !x.medicineID
      );
      if (notDosage) {
        me.$toast.warning(
          "Đơn thuốc của bạn chưa có tên thuốc hoặc chưa có liều dùng"
        );
        return;
      }

      let res = await examResultAPI.prescriptionAsync(param);
      res
        ? me.$toast.success("Xuất đơn thuốc thành công")
        : me.$toast.error("Xuất đơn thuốc thất bại");
      me.medicines = [];
      me.showPopupPrescription = false;
      await me.loadData();
    },

    /**
     * Xóa
     * @param {*} data
     */
    async deleteRow(data) {
      const me = this;
      let res = await examResultAPI.deleteAsync(
        `${me.idField}=${data[me.idField]}`
      );
      if (res) {
        me.$toast.success("Xóa thành công");
      } else {
        me.$toast.error("Xóa thất bại");
      }
      await me.loadData();
    },
    addNewMedicine() {
      const me = this;
      me.medicines.push({ medicineName: "", feeMedicine: 0 });
    },
    removeMedicine(index) {
      const me = this;
      me.medicines.splice(index, 1);
    },
    addNewExamination() {
      const me = this;
      me.examinations.push({ examinationName: "", feeExamination: 0 });
    },
    removeExamination(index) {
      const me = this;
      me.examinations.splice(index, 1);
    },
    selectedExamination(data, index) {
      const me = this;
      me.examinations[index].fee = data.fee;
      me.examinations[index].examinationName = data.examinationName;
    },
    selectedMedicine(data, index) {
      const me = this;
      me.medicines[index].fee = data.fee;
      me.medicines[index].unit = data.unit;
      me.medicines[index].quantity = 1;
      me.medicines[index].medicineName = data.medicineName;
    },
    selectedDosage(data, index) {
      const me = this;
      me.medicines[index].dosage = data.dosageName;
    },
    formatNumber(value) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value ?? 0);
    },
  },
  async created() {
    const me = this;
    me.loadData();
  },

  /**
   * Theo dõi sự thay đổi
   */
  watch: {
    medicines: {
      handler(newVal, oldVal) {
        const me = this;
        me.medicines = newVal;
      },
      deep: true,
    },
    examinations: {
      handler(newVal, oldVal) {
        const me = this;
        me.examinations = newVal;
      },
      deep: true,
    },
  },
};
</script>

<style>
.field-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.field-item-medicine {
  display: flex;
  flex-direction: column; /* Hiển thị các medicine theo cột */
  align-items: flex-start; /* Căn chỉnh các phần tử theo lề trái */
  margin-bottom: 10px;
  max-height: 200px; /* Chiều cao tối đa trước khi hiển thị thanh cuộn */
  overflow-y: auto; /* Hiển thị thanh cuộn khi vượt quá chiều cao */
}

.medicine {
  display: flex;
  align-items: center; /* Căn chỉnh các phần tử bên trong theo chiều ngang */
  margin-bottom: 10px; /* Khoảng cách giữa các medicine */
}

.medicine-name,
.medicine-value {
  display: flex;
  align-items: center; /* Căn chỉnh các phần tử bên trong theo chiều ngang */
  margin-right: 20px; /* Khoảng cách từng phần tử bên trong */
}

.medicine-button {
  border: 1px solid #bbb;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px; /* Khoảng cách giữa các nút */
}

.medicine-button:hover {
  cursor: pointer;
}
.examination-table {
  max-height: 200px; /* Chiều cao tối đa trước khi hiển thị thanh cuộn */
  min-height: 200px; /* Chiều cao tối đa trước khi hiển thị thanh cuộn */
  overflow-y: auto;
  border: 1px solid #bbb;
  display: block; /* Đảm bảo bảng được hiển thị như một khối để áp dụng chiều cao và thanh cuộn */
  border-collapse: collapse;
  border-radius: 8px;
}
.examination-table {
  border: 1px solid #bbb; /* Viền đường bao quanh bảng */
  display: block; /* Đảm bảo bảng được hiển thị như một khối để áp dụng chiều cao và thanh cuộn */
}
.examination-table thead {
  height: 30px;
}

.examination-table tbody {
  max-height: 200px; /* Chiều cao tối đa của phần nội dung (tbody) */
  min-height: 200px; /* Chiều cao tối đa trước khi hiển thị thanh cuộn */
  overflow-y: auto; /* Hiển thị thanh cuộn chỉ khi nội dung vượt quá chiều cao của tbody */
}
.examination-item {
  padding: 10px 0;
}
.td-item {
  padding: 0 8px;
}
.examination-table th,
.examination-table td {
  border: 1px solid #ddd;
  text-align: left;
}

.examination-button {
  cursor: pointer;
  display: inline-block;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 50%;
  margin: 5px;
  height: 30px;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.examination-button:hover {
  background-color: #e0e0e0;
}
.table-tbody{
  max-height: calc(100vh - 270px);
}
</style>
