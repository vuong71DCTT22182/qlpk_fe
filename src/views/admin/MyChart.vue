<template>
  <div
    style="
      padding-left: 20px;
      width: 100%;
      height: calc(100vh - 200px) !important;
    "
  >
    <h2>Thống kê doanh số</h2>
    <div
      style="
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        margin-top: 10px;
      "
    >
      <ms-combobox
        :useApi="false"
        :dataProps="dataReportType"
        v-model="reportType"
        propValue="value"
        propName="text"
        @selected="selectedReportType"
        style="width: 300px; margin-right: 20px;"
      ></ms-combobox>
      <ms-combobox
        :useApi="false"
        :dataProps="dataType"
        v-model="type"
        propValue="value"
        propName="text"
        @selected="selectedType"
        style="width: 300px; margin-right: 20px;"
      ></ms-combobox>
      <div>
        <el-date-picker
          v-model="filterDate"
          type="datetimerange"
          range-separator="Đến"
          start-placeholder="Ngày bắt đầu"
          end-placeholder="Ngày kết thúc"
        />
      </div>
    </div>
    <div v-if="isDataLoaded" style="width: 90%; height: 75%;">
      <Bar ref="lineChart" :data="chartData" :options="options"></Bar>
    </div>
  </div>
</template>

<script>
import statisticAPI from "@/js/api/statisticApi";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  components: { Bar },
  props: {},
  data() {
    // Lấy ngày hiện tại
    const today = new Date();
    // Đặt ngày của ngày hiện tại thành 1 (ngày đầu tiên của tháng)
    today.setDate(1);

    // Đặt giờ phút giây của ngày hiện tại thành 00:00:00
    today.setHours(0, 0, 0, 0);

    // Tạo ngày kết thúc là ngày hiện tại với giờ phút giây là 23:59:59
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    return {
      filterDate: [today, endOfDay],
      dataType: [
        { text: "Ngày", value: 1 },
        { text: "Tháng", value: 2 },
        { text: "Năm", value: 3 },
      ],
      type: 1,
      dataReportType: [
        { text: "Thống kê doanh thu", value: 1 },
        { text: "Thống kê theo lượt khám", value: 2 },
      ],
      reportType: 1,
      chartData: {
        labels: [],
        datasets: [
          {
            label: "Doanh số",
            backgroundColor: "#f87979",
            data: [],
            barPercentage: 0.2, // Điều chỉnh kích thước cột
            categoryPercentage: 0.2, // Điều chỉnh kích thước cột
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        // Các tùy chọn khác cho biểu đồ
      },
      isDataLoaded: false,
    };
  },
  mounted() {
    // this.renderChart();
    this.getDataChart();
  },
  methods: {
    selectedType(data) {
      const me = this;
      me.type = data.value;
      this.isDataLoaded = false;
      me.getDataChart();
    },
    selectedReportType(data) {
      const me = this;
      me.reportType = data.value;
      this.isDataLoaded = false;
      me.getDataChart();
    },
    async getDataChart() {
      const me = this;
      let param = {
        reportType: me.reportType,
        type: me.type,
        fromDate: this.$convertToLocalTime(new Date(this.filterDate[0])),
        toDate: this.$convertToLocalTime(new Date(this.filterDate[1])),
      };
      let res = await statisticAPI.getStatisticOverviewAsync(param);
      if (res && res.data) {
        me.chartData.labels = res.data.labels;
        me.chartData.datasets[0].data = res.data.value;
        me.isDataLoaded = true;
      }
    },
  },

  watch: {
    filterDate: {
      handler(newVal, oldVal) {
        const me = this;
        me.isDataLoaded = false;
        me.getDataChart();
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
/* Any styles specific to your component */
</style>
