<template>
  <div :class="{}">
    <input class="m-input" :type="type" :placeholder="placeholder" :style="styleInput" v-model="value" @input="onInput"
      @keyup.enter="onEnter" :class="{ 'error-input': showError, 'inp-popup-detail': inpPopupDetail }" :min="minValue"
      :max="maxValue" :disabled="disabled" />
    <div class="under_input" v-show="showError">
      <label style="font-size: 14px;">{{ messError }}</label>
    </div>
  </div>
</template>

<script>
export default {
  name: "MsInput",
  props: {
    placeholder: {
      type: String,
      default: "",
    },
    styleInput: {
      type: Object,
      default: () => ({}),
    },
    type: {
      type: String,
      default: "text",
    },
    modelValue: {
      type: [String, Number],
      default: "",
    },
    required: {
      type: Boolean,
      default: false,
    },
    inpPopupDetail: {
      type: Boolean,
      default: false,
    },
    minValue: {
      type: Number,
      default: null,
    },
    maxValue: {
      type: Number,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      value: "",
      showError: false,
      messError: "",
    };
  },
  methods: {
    validate() {
      if (!this.value || this.value === "") {
        this.showError = true;
        this.messError = "Không được bỏ trống";
      } else if (
        this.minValue !== null &&
        this.minValue !== undefined &&
        this.value < this.minValue
      ) {
        this.showError = true;
        this.messError = `Giá trị phải lớn hơn hoặc bằng ${this.minValue}`;
      } else if (
        this.maxValue !== null &&
        this.maxValue !== undefined &&
        this.value > this.maxValue
      ) {
        this.showError = true;
        this.messError = `Giá trị phải nhỏ hơn hoặc bằng ${this.maxValue}`;
      } else {
        this.showError = false;
        this.messError = "";
      }
    },
    validateInput() {
      this.validate();
      return this.showError;
    },
    onEnter() {
      if (this.required) {
        this.validate();
      }
      if (!this.showError) {
        this.$emit("enterInput", this.value);
      }
    },
  },
  created() {
    this.value = this.modelValue;
  },
  watch: {
    value(newVal) {
      if (
        this.minValue !== null &&
        this.minValue !== undefined &&
        newVal >= 0 &&
        newVal < this.minValue
      ) {
        this.value = this.minValue;
        return;
      }
      this.$emit("update:modelValue", newVal);
      if (this.required) {
        this.validate();
      }
    },
    modelValue(newVal) {
      this.value = newVal;
    },
  },
};
</script>

<style scoped>
@import url(../assets/css/components/input.css);

.inp-popup-detail {
  width: 500px;
}

.error-input {
  border-color: red;
}
</style>
