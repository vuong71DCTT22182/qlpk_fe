import baseService from "./baseService";

class BaseApi extends baseService {
  constructor() {
    super(); // Gọi constructor của BaseService
    // Không cần khai báo endpoint ở đây, vì sẽ được định nghĩa trong lớp con
  }

  async getListAsync(data, showLoading = true) {
    let endpoint = `${this.endpoint}/GetList`;
    let res = await this.post(endpoint, data, showLoading);
    if (!res || res.status == 500) {
      return null;
    }
    if (res && res.status == 200) {
      return res.data;
    }
    return res;
  }

  async insertOrUpdateAsync(data, showLoading = true) {
    let endpoint = `${this.endpoint}/InsertOrUpdate`;
    let res = await this.post(endpoint, data, showLoading);
    if (!res || res.status == 500) {
      return null;
    }
    if (res && res.status == 200) {
      return res.isOk;
    }
    return res;
  }

  async deleteAsync(payload, showLoading = true) {
    let endpoint = `${this.endpoint}/Delete?${payload}`;
    let res = await this.delete(endpoint, showLoading);
    if (!res || res.status == 500) {
      return null;
    }
    if (res && res.status == 200) {
      return res.isOk;
    }
    return res;
  }

  async getDataComboboxAsync(showLoading = true) {
    let endpoint = `${this.endpoint}/GetAllForCombobox`;
    let res = await this.get(endpoint, showLoading);
    if (!res || res.status == 500) {
      return null;
    }
    if (res && res.status == 200) {
      return res.data;
    }
    return res;
  }
}

export default BaseApi;
