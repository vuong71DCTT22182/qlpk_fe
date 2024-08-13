import baseApi from "../baseApi";

class DosageAPI extends baseApi {
  constructor() {
    super(); // Gọi constructor của baseApi để khởi tạo các phương thức từ BaseService
    this.endpoint = "Dosage"; // Định nghĩa endpoint cho đối tượng Brand
  }
}

const dosageAPI = new DosageAPI();

export default dosageAPI;
