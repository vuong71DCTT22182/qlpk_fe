import baseApi from "../baseApi";

class ExaminationAPI extends baseApi {
  constructor() {
    super(); // Gọi constructor của baseApi để khởi tạo các phương thức từ BaseService
    this.endpoint = "Examination"; // Định nghĩa endpoint cho đối tượng Brand
  }
}

const examinationAPI = new ExaminationAPI();

export default examinationAPI;
