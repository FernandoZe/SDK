import { Response as IResponse } from './../interfaces/index';

export default class Response {
  public status: number | null;
  public message: string | null;

  constructor(data: IResponse | Error) {
    this.status = null;
    this.message = null;

    data && this.map(data);
  }

  private map(response: IResponse | any): void {
    if (response && response.status) {
      this.status = Number(response.status);
    }

    if (response instanceof Error) {
      this.message = String(response);
    }
  }
}
