import baseApi from "../baseApi";

class ExamScheduleAPI extends baseApi {
  constructor() {
    super(); // Gọi constructor của baseApi để khởi tạo các phương thức từ BaseService
    this.endpoint = "ExamSchedule"; // Định nghĩa endpoint cho đối tượng Brand
  }

  async updateStatusAsync(param) {
    let endpoint = `${this.endpoint}/UpdateStatus?ExamScheduleID=${param.examScheduleID}&Status=${param.status}`;
    let res = await this.patch(endpoint);
    if (!res || res.status == 500) {
      return null;
    }
    if (res && res.status == 200) {
      return res;
    }
    return res;
  }
}

const examScheduleAPI = new ExamScheduleAPI();

export default examScheduleAPI;
