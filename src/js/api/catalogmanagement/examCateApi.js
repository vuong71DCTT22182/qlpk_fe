import baseApi from "../baseApi";

class ExamCateAPI extends baseApi {
  constructor() {
    super(); // Gọi constructor của baseApi để khởi tạo các phương thức từ BaseService
    this.endpoint = "ExamCate"; // Định nghĩa endpoint cho đối tượng Brand
  }
}

const examCateAPI = new ExamCateAPI();

export default examCateAPI;
