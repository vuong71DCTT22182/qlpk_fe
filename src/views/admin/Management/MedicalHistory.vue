<template>
  <div>
    <ms-admin-grid
      :showFilterDate="true"
      :showButtonAdd="false"
      :showAction="false"
      :title="title"
      :columns="columns"
      :data="data"
      :total="total"
      :idField="idField"
      @loadData="loadData"
      ref="examHistory"
    ></ms-admin-grid>
  </div>
</template>

<script>
import examResultApi from "@/js/api/managerment/examResultApi";
export default {
  /**
   * Tên component
   */
  name: "MedicalHistoryManagement",
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
      title: "Danh sách lịch sử khám bệnh",
      columns: [
        { name: "Họ và tên", field: "fullname", width: "200px" }, // Cột Họ và tên, độ rộng 200px
        { name: "Mã bệnh nhân", field: "patientNumber", width: "150px" }, // Cột Mã bệnh nhân, độ rộng 150px
        {
          name: "Thời gian khám",
          field: "examDate",
          width: "200px",
          type: "datetime",
        }, // Cột Thời gian khám, độ rộng 200px
        { name: "Chỉ số khám", field: "receptionistID", width: "150px" }, // Cột Chỉ số khám, độ rộng 150px
        { name: "Kết luận khám", field: "diagnose", width: "250px" }, // Cột Kết luận khám, độ rộng 250px
        {
          name: "Trạng thái",
          field: "status",
          width: "150px",
          type: "examresultstatus",
        }, // Cột Trạng thái, độ rộng 150px
      ],
      data: [],
      total: 0,
      payload: {
        currentPage: 1,
        pageSize: 20,
        textSearch: "",
      },
      showPopup: false,
      titleDetail: "Chi tiết lịch sử khám bệnh",
      currentItem: {},
      isAdd: false,
      idField: "examResultID",
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
      let res = await examResultApi.getExamHistoryAsync(payload);
      if (res && res.data.length >= 0 && res.total >= 0) {
        me.data = res.data;
        me.total = res.total;
      }
    },
  },
  async mounted() {
    const me = this;
    me.$nextTick(() => {
      let p = me.$refs.examHistory;
      let filter = {
        fromDate: this.$convertToLocalTime(p.filterDate[0]),
        toDate: this.$convertToLocalTime(p.filterDate[1]),
      };
      me.loadData(filter);
    });
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
