import baseApi from "../baseApi";

class MedicineAPI extends baseApi {
  constructor() {
    super(); // Gọi constructor của baseApi để khởi tạo các phương thức từ BaseService
    this.endpoint = "Medicine"; // Định nghĩa endpoint cho đối tượng Brand
  }
}

const medicineAPI = new MedicineAPI();

export default medicineAPI;
