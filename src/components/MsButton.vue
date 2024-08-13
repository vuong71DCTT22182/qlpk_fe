<template>
  <div>
    <button
      @click="actionButton"
      class="button"
      :class="type == 'secound' ? 'close-button' : ''"
    >
      {{ placeholder }}
    </button>
  </div>
</template>
    
  <script>
export default {
  /**
   * Tên component
   */
  name: "MsButton",
  /**
   * Hứng nhận
   */
  props: {
    placeholder: {
      type: String,
      default: "",
    },
    styleButton: {
      type: Object,
      default: () => ({}),
    },
    type: {
      type: String,
      default: "",
    },
  },

  /**
   * Component được sử dụng
   */
  components: {},
  directives: {},
  /**
   * Data
   */
  data() {
    return {};
  },
  /**
   * Phương thức
   */
  methods: {
    actionButton() {
      this.$emit("actionButtonClick");
    },
  },
  created() {},
  /**
   * Theo dõi sự thay đổi
   */
  watch: {},
};
</script>
    
<style>
@import url(../assets/css/components/button.css);
</style>