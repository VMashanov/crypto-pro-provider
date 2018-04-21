/**
   * @function
   * @name certificates
   * @description Provides access to loaded certificates for browser
   * @return {array} list of certificates
   */
  const certificates = () => {
    return new Promise((resolve, reject) => {
      const certificates_array = new Array();

      try {
        const store = cadesplugin.CreateObject("CAPICOM.Store");
        store.Open(CADESCOM_CURRENT_USER_STORE);

        const certificates = store.Certificates;
        const count = certificates.Count;

        for (let i = 1; i <= count; i++) {
          try {
            const certificate = certificates.Item(i);
            const is_valid = certificate.IsValid();

            certificates_array.push({
              issuer_name: _convertStringToObj(certificate.IssuerName),
              serial_number: certificate.SerialNumber,
              subject_name: _convertStringToObj(certificate.SubjectName),
              thumbprint: certificate.Thumbprint,
              valid_from_date: certificate.ValidFromDate,
              valid_to_date: certificate.ValidToDate,
              is_valid: is_valid.Result,
              version: certificate.Version
            });
          } catch(err) {
            console.error(err);
          }
        }

        store.Close();

        resolve(certificates_array);
      } catch (err) {
        reject(cadesplugin.getLastError(err));
      }
    });
  }

  /**
   * @function
   * @name certificatesAsync
   * @description Provides access to loaded certificates for browser (Async)
   * @return {array} list of certificates
   */
  const certificatesAsync = () => {
    return new Promise((resolve, reject) => {
      cadesplugin.async_spawn(function *(args) {
        const certificates_array = new Array();

        try {
          const store = yield cadesplugin.CreateObjectAsync("CAPICOM.Store");
          yield store.Open(CADESCOM_CURRENT_USER_STORE);

          const certificates = yield store.Certificates;
          const count = yield certificates.Count;

          for (let i = 1; i <= count; i++) {
            try {
              const certificate = yield certificates.Item(i);
              const is_valid = yield certificate.IsValid();

              certificates_array.push({
                issuer_name: _convertStringToObj(yield certificate.IssuerName),
                serial_number: yield certificate.SerialNumber,
                subject_name: _convertStringToObj(yield certificate.SubjectName),
                thumbprint: yield certificate.Thumbprint,
                private_key: yield certificate.PrivateKey,
                valid_from_date: yield certificate.ValidFromDate,
                valid_to_date: yield certificate.ValidToDate,
                is_valid: yield is_valid.Result,
                version: yield certificate.Version
              });
            } catch(err) {
              console.error(err);
            }
          }

          yield store.Close();

          args[0](certificates_array);
        } catch (err) {
          args[1](cadesplugin.getLastError(err));
        }
      }, resolve, reject);
    });
  }
