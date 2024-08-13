import baseApi from "../baseApi";

class UserAPI extends baseApi {
  constructor() {
    super(); // Gọi constructor của baseApi để khởi tạo các phương thức từ BaseService
    this.endpoint = "User"; // Định nghĩa endpoint cho đối tượng Brand
  }

  async getAllDoctorAsync(){
    let endpoint = `${this.endpoint}/GetAllDoctor`;
    let res = await this.get(endpoint);
    if (!res || res.status == 500) {
      return null;
    }
    if (res && res.status == 200) {
      return res;
    }
    return res;
  }
}

const userAPI = new UserAPI();

export default userAPI;
