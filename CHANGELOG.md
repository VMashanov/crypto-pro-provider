# Changelog

## [1.3.0] - 2017-12-11
### Added
 - Method `digestValue`, which return checksum of data

## [1.2.0] - 2017-10-25
### Added
 - Search certificates in all accessible storages (#2);
 - Attribute of time of signing into the simple signature (#3);

### Fixed
 - Attribute of content encoding in the simple signature;

## [1.1.1] - 2017-10-11
### Fixed
  - Error `certificate is not defined`;
  - Readme;

## [1.1.0] - 2017-09-27
### Added
 - Changelog;
 - Method `_hexToBase64`;

### Changed
 - Readme;
 - `Valid_from_date` => `valid_from_date`: parameters of certificates list in async version;
 - `Valid_to_date` => `valid_to_date`: parameters of certificates list in async version;
 - Documentation;

### Deleted
 - Methods `_reverse` and `_hexToString`;

## [1.0.4] - 2017-09-26
### Fixed
 - Error of encoding `signature_value` to base64;

## [1.0.3] - 2017-09-20
### Changed
 - Readme;

## [1.0.2] - 2017-09-13
### Fixed
 - Bugs of detached signature;

### Changed
 - `Valid_from_date` => `valid_from_date`: parameters of certificates list;
 - `Valid_to_date` => `valid_to_date`: parameters of certificates list;

## [1.0.1] - 2017-09-07
### Added
 - Documentation;

[1.3.0]: https://github.com/VMashanov/crypto-pro-provider/compare/1.2.0...1.3.0
[1.2.0]: https://github.com/VMashanov/crypto-pro-provider/compare/1.1.1...1.2.0
[1.1.1]: https://github.com/VMashanov/crypto-pro-provider/compare/1.1.0...1.1.1
[1.1.0]: https://github.com/VMashanov/crypto-pro-provider/compare/1.0.4...1.1.0
[1.0.4]: https://github.com/VMashanov/crypto-pro-provider/compare/1.0.3...1.0.4
[1.0.3]: https://github.com/VMashanov/crypto-pro-provider/compare/1.0.2...1.0.3
[1.0.2]: https://github.com/VMashanov/crypto-pro-provider/compare/1.0.1...1.0.2
[1.0.1]: https://github.com/VMashanov/crypto-pro-provider/compare/1.0.0...1.0.1
