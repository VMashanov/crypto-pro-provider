# Crypto-pro-provider
Provides methods for signing xml of requests for SMEV2 and SMEV3

## Documentation

You can read documentation [here](https://vmashanov.github.io/crypto-pro-provider/index.html)!

## Usage

- Import module;

``` javascript
import CryptoProProvide from 'crypto-pro-provider';
```

- First, you need select certificate. For it use method `certificates`;

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
