# PAYGATE PAYMENTS 🚀

### Paygate payments para javascript


## Empezando

## Cómo instalarlo

### Con npm

```sh
npm i @clinpays/paygate
```

```js
const { configure_ecommerce } = require('@clinpays/paygate');

await configure_ecommerce(id, token);

// Activar el debugger
debug(true);

//Objeto con los campos requeridos por el método
const payload = {
  'cvv': '',
  'email': '',
  'amount': '',
  'lastName': '',
  'validThru': '',
  'firstName': '',
  'description': '',
  'mobilePhone': '',
  'billingCity': '',
  'customerName': '',
  'billingState': '',
  'safeIdentifier': '',
  'billingAddress1': '',
  'billingCountryCode': '',
};

const result = await payOrder(payload);

```

### Utilidades
```js
//Obtener listado de países y estados/departamentos disponibles
const countriesAndStates = await Paygate.getCountriesAndStates();

```

## Métodos

### Paygate.configure_ecommerce(id, token, endpoint)

Configurar la cuenta con las credenciales correspondientes para poder realizar cobros.

| Parametro | Descripción                  | Tipo | Requerido |
|-----------|------------------------------| ------ |-----------|
| id        | ID del comercio              |string | Sí        |
| token     | Token del comercio           |string | Sí        |
| endpoint  | Url para consultar servicios | string | No        |

### Paygate.debug(true)

Visualizar los registros de log de los procesos de pago.

| Parametro | Descripción | Tipo |
| ------ | ------  | ------ |
| true - false | Visualizar en la consola los registros de log que genera el/los procesos. | boolean

### Paygate.payOrder(payload)
Valida si cuenta con los servicios 3DS y si es así valida la autenticación del tarjetahabiente y procede a realizar el cobo a la tarjeta

payload request (object)

#### Datos personales

| Parametro | Descripción | Tipo |  Requerido |
| ------ | ------  | ------ |  ------ |
| email | Correo electrónico del cliente | string | C |
| mobilePhone | Número telefónico del cliente | string | C |
| customerName | Nombre del cliente | string | C |

#### Datos de la tarjeta
| Parametro | Descripción | Tipo |  Requerido | Formato
| ------ | ------  | ------ |  ------ | ------ |
| cvv | Código de la tarjeta | string | Sí | 999 |
| firstName |  Nombre del tarjetahabiente| string | Sí | Jorge |
| lastName | Apellido del tarjetahabiente| string | Sí | Santos |
| validThru | Fecha de expiración del tarjetahabiente | string | Sí | 12/24 |
| safeIdentifier | El PAM de la tarjeta | string | Sí |  1234567891234567 |

#### Detalle del pago
| Parametro | Descripción | Tipo |  Requerido | Formato
| ------ | ------  | ------ |  ------ |  ------
| amount | Total a cobrar | number | Sí | 20.50
| referenceId | Referencia única del la orden | string | Sí | ABCDFG-1010 |
| description | Descripción de la orden | string | Sí | Pago de ejemplo |
| orderNumber | Número único de orden | string | Sí | 100000000 |

### Facturación
| Parametro | Descripción | Tipo |  Requerido | Especificación | Formato
| ------ | ------  | ------ |  ------ |------ | ------ |
| billingCity | Estado o provincia de facturación | string | C | - | Tegucigalpa
| billingState | Ciudad de factuación | string | C | ISO 3166-2 code | FM
| billingAddress1 | Dirección de facturación | string | C | - | Barrio Los Hermanos
| billingCountryCode | País de factuación | string | C | ISO 3166 - Numeric code | 340



