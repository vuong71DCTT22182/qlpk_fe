import baseApi from "../baseApi";

class SpecialistAPI extends baseApi {
  constructor() {
    super(); // Gọi constructor của baseApi để khởi tạo các phương thức từ BaseService
    this.endpoint = "Specialist"; // Định nghĩa endpoint cho đối tượng Brand
  }
}

const specialistAPI = new SpecialistAPI();

export default specialistAPI;
