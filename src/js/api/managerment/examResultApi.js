import baseApi from "../baseApi";

class ExamResultAPI extends baseApi {
  constructor() {
    super(); // Gọi constructor của baseApi để khởi tạo các phương thức từ BaseService
    this.endpoint = "ExamResult"; // Định nghĩa endpoint cho đối tượng Brand
  }

  async getExamHistoryAsync(data) {
    let endpoint = `${this.endpoint}/ExamHistory`;
    let res = await this.post(endpoint, data);
    if (!res || res.status == 500) {
      return null;
    }
    if (res && res.status == 200) {
      return res.data;
    }
    return res;
  }

  async comfirmExamAsync(data) {
    let endpoint = `${this.endpoint}/ComfirmExam`;
    let res = await this.patch(endpoint, data);
    if (!res || res.status == 500) {
      return null;
    }
    if (res && res.status == 200) {
      return res.isOk;
    }
    return res;
  }

  async prescriptionAsync(data) {
    let endpoint = `${this.endpoint}/Prescription`;
    let res = await this.patch(endpoint, data);
    if (!res || res.status == 500) {
      return null;
    }
    if (res && res.status == 200) {
      return res.isOk;
    }
    return res;
  }

  async printPDFAsync(data) {
    let endpoint = `${this.endpoint}/PrintResultPDF?ExamResultID=${data}`;
    try {
      let res = await this.post(endpoint, {}, true, { responseType: "blob" });

      return res;
    } catch (error) {
      console.error("Có lỗi xảy ra khi tải tệp PDF:", error);
      return null;
    }
  }

  async receiptPatientAsync(data) {
    let endpoint = `${this.endpoint}/ReceiptPatient?ExamResultID=${data}`;
    let res = await this.post(endpoint);
    if (!res || res.status == 500) {
      return null;
    }
    if (res && res.status == 200) {
      return res.isOk;
    }
    return res;
  }
}

const examResultAPI = new ExamResultAPI();

export default examResultAPI;
