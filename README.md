# Crypto-pro-provider
The library provides methods for signing xml of requests for SMEV2 and SMEV3

## Usage

- Import module;

``` javascript
import {
  certificates,
  sign,
  paramsForDetachedSignature,
} from 'crypto-pro-provider';
```

- First, you need to select certificate. For it use method `certificates`;

``` javascript
  certificates()
    .then((certificates) => {
      // list of certificates
    })
    .catch((error) => {
      // error
    });
```

Signature for SMEV 2:

- Sign your message;

``` javascript
  // thumbprint - hash of the before selected certificate
  // base64 - message encoded to base64
  sign(thumbprint, base64)
    .then((signature) => {
      // signed message
    })
    .catch((error) => {
      // error
    });
```

Signature for SMEV 3:

Signing message for SMEV 3 is more difficult, than for SMEV 2, so you should have server-side for some operations.

Before signing your message by `crypto-pro-provider`, you should does several actions.

- Sign your message by crypto server;
- From received signature take node `SignedInfo`;
- Canonicalize `SignedInfo` (http://www.w3.org/2001/10/xml-exc-c14n#);

Then canonicalized node send to client-side and sign by `crypto-pro-provider`:

``` javascript
  // thumbprint - hash of the before selected certificate
  // base64 - message encoded to base64
  // signatureTemplateAsBase64 - signature template encoded to base64
  paramsForDetachedSignature(thumbprint, base64, signatureTemplateAsBase64)
    .then((base64) => {
      // Signed XML as base64
    })
    .catch((error) => {
      // error
    });
```

Save signature.

That's all!

## Changelog

Changelog [here](https://github.com/VMashanov/crypto-pro-provider/blob/master/CHANGELOG.md)!
