import baseApi from "../baseApi";

class PermissionApi extends baseApi {
  constructor() {
    super(); // Gọi constructor của baseApi để khởi tạo các phương thức từ BaseService
    this.endpoint = "Role"; // Định nghĩa endpoint cho đối tượng Brand
  }
}

const permissionApi = new PermissionApi();

export default permissionApi;
