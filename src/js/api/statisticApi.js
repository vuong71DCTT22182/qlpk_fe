import baseApi from "./baseApi";

class StatisticAPI extends baseApi {
  constructor() {
    super(); // Gọi constructor của baseApi để khởi tạo các phương thức từ BaseService
    this.endpoint = "Statistic"; // Định nghĩa endpoint cho đối tượng Brand
  }

  async getStatisticOverviewAsync(data) {
    let endpoint = `${this.endpoint}/StatisticOverview`;
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

const statisticAPI = new StatisticAPI();

export default statisticAPI;
