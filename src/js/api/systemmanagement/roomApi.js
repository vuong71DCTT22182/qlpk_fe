import baseApi from "../baseApi";

class RoomAPI extends baseApi {
  constructor() {
    super(); // Gọi constructor của baseApi để khởi tạo các phương thức từ BaseService
    this.endpoint = "Clinic"; // Định nghĩa endpoint cho đối tượng Brand
  }
}

const roomAPI = new RoomAPI();

export default roomAPI;
