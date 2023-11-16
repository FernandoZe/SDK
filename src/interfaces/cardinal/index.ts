export interface Order {
  cvv: string;
  email: string;
  amount: number;
  lastName: string;
  firstName: string;
  validThru: string;
  mobilePhone: string;
  billingCity: string;
  orderNumber: string;
  referenceId: string;
  description: string;
  customerName: string;
  billingState: string;
  safeIdentifier: string;
  billingAddress1: string;
  billingCountryCode: string;
  shippingMethodIndicator: string;
  hashTransaction?: string;
  paymentLinkId?: string;
  type?: 'REDIRECT' | 'PAYMENT_LINK' | 'PAYMENT';
  externalFullName?: string;
  channelCode?: string;
  currency: string;
  payWithHSM: boolean;
  billingPostCode: string;
  b2cc?: string;
}
