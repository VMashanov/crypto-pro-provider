# Crypto-pro-provider
Provides methods for signing xml of requests for SMEV2 and SMEV3

## Documentation

You can read documentation [here](https://vmashanov.github.io/crypto-pro-provider/index.html)!

## Usage

- Import module;

``` javascript
import CryptoProProvide from 'crypto-pro-provider';
```

- First, you need to select certificate. For it use method `certificates`;

``` javascript
  CryptoProProvide.certificates()
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
  CryptoProProvide.sign(thumbprint, base64)
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
  CryptoProProvide.paramsForDetachedSignature(thumbprint, base64)
    .then((object) => {
      // {
      //   signature_value: <value of signature>,
      //   x509certificate: <value of certificate>
      // }
    })
    .catch((error) => {
      // error
    });
```

Received params substitute `SignatureValue` and `X509Certificate` nodes in signature template from the first step.

Save signature.

That's all!

## Changelog

Changelog [here](https://github.com/VMashanov/crypto-pro-provider/blob/develop/CHANGELOG.md)!
