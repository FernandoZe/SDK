import { IEnvironments } from '../interfaces/utils/environments.interface';
import { IProviders } from '../interfaces/utils/providers.interface';

export const ERRORS = {
  REQUIRED: {
    CVV: 'cvv es requerido',
    EMAIL: 'email es requerido',
    AMOUNT: 'amount es requerido',
    LAST_NAME: 'lastName es requerido',
    VALIDTHRU: 'validThru es requerido',
    FIRST_NAME: 'firstName es requerido',
    DESCRIPTION: 'description es requerido',
    BILLING_CITY: 'billingCity es requerido',
    ORDER_NUMBER: 'orderNumber es requerido',
    REFERENCE_ID: 'referenceId es requerido',
    MOBILE_PHONE: 'mobilePhone es requerido',
    BILLING_STATE: 'billingState es requerido',
    CUSTOMER_NAME: 'customerName es requerido',
    SAFE_IDENTIFIER: 'safeIdentifier es requerido',
    BILLING_ADDRESS1: 'billingAddress1 es requerido',
    BILLING_COUNTRY_CODE: 'billingCountryCode es requerido',
    SECRET_KEY_MISSED: 'La secret key no fue proporcionada'
  }
};

export const CARDINAL = {
  ERRORS: {
    CANCELED: 'Cancelado por el usuario',
    CONFIG_ERROR: 'Error de configuración',
    GENERAL_ERROR: 'Error general, vuelva a intentarlo',
    TRANSACTION_FAILED: 'No se pudo realizar la transacción',
    CONFIRM_CONNECTION_ERROR: 'Error de conexión al confirmar',
    CONNECTION_ERROR: 'Error de conexion, vuelva a intentarlo',
    CONTINUE_CONNECTION_ERROR: 'Error de conexión al continuar',
    INVALID_RESPONSE: 'La respuesta no se puede analizar, contacte al administrador',
    INCOMPLETE_AUTHENTICATION: 'Transacción denegada, No se puede completar la autenticación',
    TRANSACTION_VERIFICATION_FAILED: 'Validación rechazada, la tarjeta no ha sido verificada.'
  }
};

export const ENVIRONMENTS: IEnvironments = {
  DEV: 'DEV',
  STAGE: 'STAGE',
  LOCAL: 'LOCAL',
  PRODUCTION: 'PRODUCTION',
  PROD_BRASIL: 'PROD_BRASIL'
};

export const PROVIDERS: IProviders = {
  CARDINAL: 'CARDINAL',
  CYBERSOURCE: 'CYBERSOURCE',
  KOUNT: 'KOUNT'
};

export const ENDPOINTS: IEnvironments = {
  LOCAL: 'http://localhost:1337',
  DEV: 'https://dev.paygatehn.com',
  STAGE: 'https://stage.paygatehn.com',
  PRODUCTION: 'https://api.paygatehn.com',
  PROD_BRASIL: 'https://paygateapi.clinpays.biz'
};
