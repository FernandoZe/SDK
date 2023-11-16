export interface Payment {
  type?: string;

  cvv: string;
  amount: number;
  lastName: string;
  firstName: string;
  validThru: string;
  description: string;
  safeIdentifier: string;

  service3DS?: any;
  response3DS?: Response3DS;

  paymentLinkId?: string;
  hashTransaction?: string;
}

export type Response3DS = {
  isValidated: boolean;
  data: any;
}