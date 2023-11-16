import * as yup from 'yup';
import { ERRORS } from '../../utils/constants';

const { REQUIRED } = ERRORS;

export const payOrderSchema = yup.object().shape({
  cvv: yup.string().required(REQUIRED.CVV),
  service3DS: yup.object().shape({
    isActive: yup.boolean()
  }),
  lastName: yup.string().required(REQUIRED.LAST_NAME),
  validThru: yup.string().required(REQUIRED.VALIDTHRU),
  firstName: yup.string().required(REQUIRED.FIRST_NAME),
  orderNumber: yup.string().required(REQUIRED.ORDER_NUMBER),
  // referenceId: yup.string().required(REQUIRED.REFERENCE_ID),
  description: yup.string().required(REQUIRED.DESCRIPTION),
  safeIdentifier: yup.string().when('payWithHSM', (payWithHSM, schema) => {
    if( !payWithHSM ) {
      return schema
        .required(REQUIRED.SAFE_IDENTIFIER);
    }
  }),
  amount: yup.number().positive().required(REQUIRED.AMOUNT),
  billingAddress1: yup.string().when('service3DS', {
    is: true,
    then: yup.string().required(REQUIRED.BILLING_ADDRESS1)
  }),
  billingCity: yup.string().when('service3DS', {
    is: true,
    then: yup.string().required( REQUIRED.BILLING_CITY)
  }),
  billingCountryCode: yup.string().when('service3DS', {
    is: true,
    then: yup.string().required(REQUIRED.BILLING_COUNTRY_CODE)
  }),
  billingState: yup.string().when('service3DS', {
    is: true,
    then: yup.string().required(REQUIRED.BILLING_STATE)
  }),
  email: yup.string().when('service3DS', {
    is: true,
    then: yup.string().required(REQUIRED.EMAIL)
  }),
  customerName: yup.string().when('service3DS', {
    is: true,
    then: yup.string().required(REQUIRED.CUSTOMER_NAME)
  }),
  mobilePhone: yup.string().when('service3DS', {
    is: true,
    then: yup.string().required(REQUIRED.MOBILE_PHONE)
  }),
  shippingMethodIndicator: yup.string(),
  payWithHSM: yup.boolean(),
});
