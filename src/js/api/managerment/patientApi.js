import baseApi from "../baseApi";

class PatientAPI extends baseApi {
  constructor() {
    super(); // Gọi constructor của baseApi để khởi tạo các phương thức từ BaseService
    this.endpoint = "Patient"; // Định nghĩa endpoint cho đối tượng Brand
  }
}

const patientAPI = new PatientAPI();

export default patientAPI;
