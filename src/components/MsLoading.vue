<template>
  <div class="mloading">
    <img
      class="img-loading"
      src="@/assets/image/loading.svg"
      alt="Loading..."
    />
  </div>
</template>

<script>
export default {
  name: "MsLoading",
};
</script>

<style scoped>
.mloading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(131, 131, 131, 0.5); /* Màu nền trong suốt */
  z-index: 9999; /* Đảm bảo nằm trên các phần tử khác */
}

.img-loading {
  width: 50px; /* Điều chỉnh kích thước của biểu tượng loading */
  height: 50px;
}
</style>
