import baseApi from "./baseApi";

class AuthenticationAPI extends baseApi {
  constructor() {
    super(); // Gọi constructor của baseApi để khởi tạo các phương thức từ BaseService
    this.endpoint = "Authentication"; // Định nghĩa endpoint cho đối tượng Brand
  }

  async LoginAsync(data) {
    let endpoint = `${this.endpoint}/SignIn`;
    let res = await this.post(endpoint, data);
    if (!res || res.status == 500) {
      return null;
    }
    if (res && res.status == 200) {
      return res;
    }
    return res;
  }
}

const authenticationAPI = new AuthenticationAPI();

export default authenticationAPI;
