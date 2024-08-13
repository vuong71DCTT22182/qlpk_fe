<template>
  <div class="popup" @keydown.esc="$emit('close')">
    <div class="popup-content" :style="{ width: computedWidth }">
      <div class="popup-header">
        <slot name="header"></slot>
        <span class="close" @click.stop="$emit('close')">&times;</span>
      </div>
      <div class="popup-body">
        <slot name="body"></slot>
      </div>
      <div class="popup-footer">
        <slot name="footer">
          <div class="footer-button" v-if="showButtonDetail">
            <ms-button
              @click.stop="$emit('save')"
              :placeholder="placeholderSave"
            ></ms-button>
            <ms-button
              type="secound"
              @click.stop="$emit('close')"
              :placeholder="'Đóng'"
            ></ms-button>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DetailPopup",
  computed: {
    computedWidth() {
      return this.width; // Trả về giá trị của prop width để áp dụng vào style
    },
  },
  props: {
    placeholderSave: {
      type: String,
      default: "Lưu",
    },
    showButtonDetail: {
      type: Boolean,
      default: true,
    },
    width: {
      type: String,
      default: "55%", // Giá trị mặc định cho chiều rộng
    },
  },
  watch: {
    showButtonDetail: {
      handler(newVal, oldVal) {},
    },
  },
};
</script>

<style>
.popup {
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  max-width: 1000px;
  border-radius: 6px;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.popup-header,
.popup-body,
.popup-footer {
  margin-bottom: 10px;
}
.footer-button {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  justify-content: flex-end;
}
</style>
