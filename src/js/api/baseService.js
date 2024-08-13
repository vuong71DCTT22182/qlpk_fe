import axios from "axios";
import router from "@/router/router";
import { createApp, h } from "vue";
import MsLoading from "@/components/MsLoading.vue";
import Toast, { useToast } from "vue-toastification";
const loadingApp = createApp({
  render() {
    return h(MsLoading);
  },
});
const loadingInstance = loadingApp.mount(document.createElement("div"));
document.body.appendChild(loadingInstance.$el);

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

class BaseService {
  constructor() {
    this.loadingElement = loadingInstance.$el;
    this.loadingElement.style.display = "none";
    this.$toast = useToast();
    instance.interceptors.request.use(
      (config) => {
        if (config.showLoading) {
          this.showLoading();
        } else {
          this.hideLoading();
        }

        const token = localStorage.getItem("jwtToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        if (error.config.showLoading) {
          this.hideLoading();
        }
        return Promise.reject(error);
      }
    );

    instance.interceptors.response.use(
      (response) => {
        if (response.config && response.config.showLoading) {
          this.hideLoading();
        }
        return response;
      },
      (error) => {
        if (error.config && error.config.showLoading) {
          this.hideLoading();
        }
        if (error.response) {
          if (error.response.status === 401) {
            console.log("Unauthorized: Bạn cần đăng nhập.");
            router.push({ name: "forbidden" }).catch(() => {});
          } else if (error.response.status === 403) {
            console.log("Forbidden: Bạn không có quyền truy cập.");
            router.push({ name: "forbidden" }).catch(() => {});
          }
        } else {
          console.log("Lỗi mạng hoặc lỗi không xác định:", error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  showLoading() {
    this.loadingElement.style.display = "flex"; // Hiển thị loading
    this.loadingElement.style.alignItems = "center";
    this.loadingElement.style.justifyContent = "center";
  }

  hideLoading() {
    this.loadingElement.style.display = "none"; // Ẩn loading
  }

  async get(endpoint, showLoading = true) {
    try {
      const response = await instance.get(endpoint, {
        showLoading,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async post(endpoint, data, showLoading = true, config = {}) {
    try {
      const response = await instance.post(endpoint, data, {
        ...config,
        showLoading,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async put(endpoint, data, showLoading = true) {
    try {
      const response = await instance.put(endpoint, data, {
        showLoading,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async patch(endpoint, data, showLoading = true) {
    try {
      const response = await instance.patch(endpoint, data, {
        showLoading,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(endpoint, showLoading = true) {
    try {
      const response = await instance.delete(endpoint, {
        showLoading,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error) {
    console.log("Lỗi:", error.message);
    this.$toast.error("Có lỗi xảy ra , vui lòng thử lại sau!");
  }
}

export default BaseService;
