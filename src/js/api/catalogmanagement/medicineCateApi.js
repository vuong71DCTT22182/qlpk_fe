import baseApi from "../baseApi";

class MedicineCateAPI extends baseApi {
  constructor() {
    super(); // Gọi constructor của baseApi để khởi tạo các phương thức từ BaseService
    this.endpoint = "MedicineCate"; // Định nghĩa endpoint cho đối tượng Brand
  }
}

const medicineCateAPI = new MedicineCateAPI();

export default medicineCateAPI;
