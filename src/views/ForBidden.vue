<template>
  <div>
    <div class="not-found">
      <img src="@/assets/image/403.jpg" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  /**
   * Tên component
   */
  name: "ForBidden",
  methods: {},
  created() {},
  /**
   * Theo dõi sự thay đổi
   */
  watch: {},
};
</script>

<style>
.not-found {
  margin: 140px 100px 0;
}

.not-found img {
  display: flex;
  align-items: center;
  margin: 0 auto;
  width: 700px;
  height: 700px;
}
</style>