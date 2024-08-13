import baseApi from "../baseApi";

class PositionAPI extends baseApi {
  constructor() {
    super(); // Gọi constructor của baseApi để khởi tạo các phương thức từ BaseService
    this.endpoint = "Position"; // Định nghĩa endpoint cho đối tượng Brand
  }
}

const positionAPI = new PositionAPI();

export default positionAPI;
