import { createApp } from "vue";
import App from "./App.vue";
import store from "@/js/store/store";
import MsLoading from "@/components/MsLoading.vue";
import MsInput from "@/components/MsInput.vue";
import MsButton from "@/components/MsButton.vue";
import MsGridViewer from "@/components/MsGridViewer.vue";
import MsSelectBox from "@/components/MsSelectBox.vue";
import MsCombobox from "@/components/MsCombobox.vue";
import AdminGrid from "@/views/admin/AdminGrid.vue";
import DetailPopup from "@/views/admin/DetailPopup.vue";
import router from "@/router/router";
/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";
/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
/* import specific icons */
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-free/css/all.css";
import Toast, { useToast } from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
library.add(faUserSecret);

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import vueClickOutsideElement from "vue-click-outside-element";

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
import timePlugin from '@/js/timeUtils';


const app = createApp(App);
app.use(store);
app.use(router);
// Cấu hình vue-toastification toàn cục
const options = {
  position: "top-right",
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: false,
  pauseOnHover: false,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
};
app.use(Toast, options);
app.config.globalProperties.$toast = useToast();
app.component("font-awesome-icon", FontAwesomeIcon);
app.component("ms-loading", MsLoading);
app.component("ms-input", MsInput);
app.component("ms-button", MsButton);
app.component("ms-grid-viewer", MsGridViewer);
app.component("ms-selectbox", MsSelectBox);
app.component("ms-popup", DetailPopup);
app.component("ms-admin-grid", AdminGrid);
app.component("ms-combobox", MsCombobox);
app.config.globalProperties.$dayjs = dayjs;
app.use(ElementPlus)
app.use(vueClickOutsideElement);
app.use(timePlugin);
app.mount("#app");
