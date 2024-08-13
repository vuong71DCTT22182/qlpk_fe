<template>
  <div class="ms-grid-viewer">
    <div class="table-wrapper">
      <table class="full-width-table">
        <thead class="table-thead">
          <tr v-if="serial" class="serial">
            STT
          </tr>
          <tr
            v-for="(item, index) in columns"
            :key="index"
            class="th-item"
            :style="{ width: item.width }"
          >
            {{
              item.name
            }}
          </tr>
        </thead>
        <tbody class="table-tbody" v-if="data.length > 0">
          <tr
            v-for="(item, index) in data"
            :key="index"
            @click="trClick(item)"
            @dblclick="rowOnDblClick(item)"
            class="table-row"
            :class="trSelected == item ? 'trClick' : ''"
          >
            <td v-if="serial" class="serial">{{ index + 1 }}</td>
            <!-- STT -->
            <td
              class="tr-item"
              v-for="(column, colIndex) in columns"
              :key="colIndex"
              :style="{ width: column.width }"
            >
              {{ formatColumnData(item[column.field], column.type) }}
            </td>
            <td
              v-if="showAction"
              class="tr-action icon-delete"
              @click.stop="deleteRow(item)"
            >
              <i class="fa-regular fa-trash-can"></i>
            </td>
            <td
              v-if="showAction && !item.updateRow"
              class="tr-action icon-edit"
              :style="{
                marginRight: showAction && !item.updateRow ? '50px' : '',
              }"
              @click.stop="editRow(item)"
            >
              <i class="fa-solid fa-pen"></i>
            </td>
            <td
              v-if="item.upGradeRow"
              class="tr-action icon-edit"
              :style="{
                right:
                  showAction && !item.updateRow && item.upGradeRow
                    ? '110px'
                    : '60px',
              }"
              @click.stop="upgradeRow(item)"
            >
              <i class="fa-solid fa-arrow-right-long"></i>
            </td>
            <td
              v-if="item.printPDF"
              class="tr-action icon-edit"
              :style="{
                right: '60px',
              }"
              @click.stop="printRow(item)"
            >
              <i class="fa-solid fa-print"></i>
            </td>
          </tr>
        </tbody>
        <tbody class="none-data" v-else>
          Không có dữ liệu
        </tbody>
      </table>
    </div>
    <div class="table__paging" v-if="true">
      <div class="paging__left">
        Tổng số bản ghi: <b>{{ totalRecord }}</b>
      </div>
      <div class="paging__right">
        <div class="m-pagding-right-left">
          <div>
            <ms-selectbox
              :data="dataSelectBox"
              v-model="pageSize"
            ></ms-selectbox>
          </div>
        </div>
        <div class="m-pagding-right-right">
          <div class="m-page-number-group">
            <span v-show="pageChoice > 1" @click="prePage" class="text-next-pre"
              >Pre</span
            >
            <button
              class="m-page-number"
              v-for="(item, index) in pageNumber"
              :key="index"
              :class="{ 'page-number-select': pageChoice == item }"
              @click="choosePageChoice(item)"
            >
              {{ item }}
            </button>
            <span
              v-show="pageChoice <= totalRecord / pageSize"
              @click="nextPage"
              class="text-next-pre"
              >Next</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import enumResouce from "@/js/resource/resource";
export default {
  name: "MsGridViewer",
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
    totalRecord: {
      type: Number,
      default: 0,
    },
    serial: {
      type: Boolean,
      default: true,
    },
    showAction: {
      type: Boolean,
      default: true,
    },
  },
  components: {},
  computed: {
    dataSelectBox() {
      return [
        { feildShow: "10 bản ghi trên trang", feildValue: 10 },
        { feildShow: "20 bản ghi trên trang", feildValue: 20 },
        { feildShow: "50 bản ghi trên trang", feildValue: 50 },
        { feildShow: "70 bản ghi trên trang", feildValue: 70 },
        { feildShow: "100 bản ghi trên trang", feildValue: 100 },
      ];
    },
    totalPages() {
      return Math.ceil(this.totalRecord / this.pageSize);
    },
    pageNumber() {
      let pagination = [];
      let totalPages = this.totalPages;
      let currentPage = this.pageChoice;

      if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) {
          pagination.push(i);
        }
      } else {
        if (currentPage <= 2) {
          pagination = [1, 2, 3, "...", totalPages];
        } else if (currentPage >= totalPages - 1) {
          pagination = [1, "...", totalPages - 2, totalPages - 1, totalPages];
        } else {
          pagination = [
            1,
            "...",
            currentPage - 1,
            currentPage,
            currentPage + 1,
            "...",
            totalPages,
          ];
        }
      }
      return pagination;
    },
  },
  data() {
    return {
      pageSize: 20,
      pageChoice: 1,
      trSelected: {},
    };
  },
  created() {},
  methods: {
    formatColumnData(value, type) {
      if (type === "datetime" && value) {
        const date = new Date(value);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
      }
      if (type === "time" && value) {
        const date = new Date(value);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }
      if (type === "combobox" && value >= 0) {
        switch (value) {
          case enumResouce.gender.Male:
            return "Name";
          case enumResouce.gender.Female:
            return "Nữ";
          case enumResouce.gender.Other:
            return "Khác";
          default:
            return value;
        }
      }
      if (type == "examresultstatus" && value >= 0) {
        switch (value) {
          case 1:
            return "Chờ khám";
          case 2:
            return "Đang khám";
          case 3:
            return "Chờ kết quả";
          case 4:
            return "Đã có kết quả";
          case 5:
            return "Hoàn thành";
          case 6:
            return "Đã hủy";
          default:
            return value;
        }
      }
      return value;
    },
    trClick(row) {
      this.trSelected = row;
    },
    rowOnDblClick(row) {
      this.$emit("editRow", row);
    },
    deleteRow(row) {
      this.$emit("deleteRow", row);
    },
    editRow(row) {
      this.$emit("editRow", row);
    },
    upgradeRow(row) {
      this.$emit("upgradeRow", row);
    },
    printRow(row) {
      this.$emit("printRow", row);
    },
    prePage() {
      this.pageChoice -= 1;
      this.createPageNumber();
      this.$emit("loadData", {
        pageChoice: this.pageChoice,
        pageSize: this.pageSize,
      });
    },

    nextPage() {
      this.pageChoice += 1;
      this.createPageNumber();
      this.$emit("loadData", {
        pageChoice: this.pageChoice,
        pageSize: this.pageSize,
      });
    },
    choosePageChoice(value) {
      if (!isNaN(value)) {
        this.pageChoice = value;
        this.createPageNumber();
        this.$emit("loadData", {
          pageChoice: this.pageChoice,
          pageSize: this.pageSize,
        });
      }
    },
    createPageNumber() {
      let totalPages =
        this.totalRecord / this.pageSize != 0
          ? this.totalRecord / this.pageSize + 1
          : this.totalRecord / this.pageSize;
      let currentPage = this.pageChoice;
      let pagination = [];

      if (totalPages <= 5) {
        // Less than or equal to 5 pages
        for (let i = 1; i <= totalPages; i++) {
          pagination.push(i);
        }
      } else {
        // More than 5 pages
        if (currentPage <= 2) {
          pagination = [1, 2, 3, "...", totalPages];
        } else if (currentPage >= totalPages - 1) {
          pagination = [1, "...", totalPages - 2, totalPages - 1, totalPages];
        } else {
          pagination = [
            1,
            "...",
            currentPage - 1,
            currentPage,
            currentPage + 1,
            "...",
            totalPages,
          ];
        }
      }
      this.pageNumber = pagination;
    },
  },
  async mounted() {
    this.$nextTick(async () => {
      await this.createPageNumber();
    });
  },
  watch: {
    pageSize: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.pageChoice = 1;
          this.createPageNumber();
          this.$emit("loadData", {
            pageChoice: 1,
            pageSize: newVal,
          });
        }
      },
    },
  },
};
</script>

<style scoped>
@import url(../assets/css/components/gridviewer.css);
</style>
