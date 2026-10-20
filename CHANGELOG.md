# Changelog

All notable changes to this project will be documented in this file. See [Conventional Commits](https://www.conventionalcommits.org) for commit guidelines.

## [2.0.0](https://github.com/Nico2433/utils/compare/v1.0.11...v2.0.0) (2026-10-19)

### ⚠ BREAKING CHANGES

* - *Simple variants removed (findOnArraySimple -> findOnArray(array, value), ...)
  - find/search/remove take (array, value, by?) instead of { property, value }
  - addToArray takes (array, item, by?) and reads the value from the item
  - filterArray takes { by?, op, value, exclude? }; truthy filtering removed
  - sortByArray and sortNumberArray replaced by sortArray(array, { by?, order? })
  - searchIndexOnArray no longer takes insertIdx; use insertIndexOnArray
  - add/remove/sort return new arrays instead of mutating the input
* assembleStringWSpaces is now cn and assembleString is now concat.
* responses are parsed by content-type, so non-JSON
  responses resolve with their text instead of rejecting.
* reverse lookup (FETCH_STATUS[5]) is no longer available.
  Values and the FETCH_STATUS type keep working as before.
* time conversions use 365.25-day years (monthsToMs(12) ===
  yearsToMs(1)), FetchError.name is now "FetchError", mapObj returns
  Record<key, U>, and Node.js >= 22 is required.

* replace FETCH_STATUS enum with a const object ([16f14eb](https://github.com/Nico2433/utils/commit/16f14eb98da5996471d34397ae45c10899e405d7))

### Features

* add query, timeout, createFetchData and richer errors to fetchData ([471d026](https://github.com/Nico2433/utils/commit/471d026f57f3badb8c7a1d3c86a43b0a71ee4cbe))
* rename string assemblers to cn and concat ([c1bb401](https://github.com/Nico2433/utils/commit/c1bb40151037df0a336583b477d2c599d4a38d38))
* strict generic typing and modernized tooling ([ff673d4](https://github.com/Nico2433/utils/commit/ff673d4a4dc4d368ba5dede69abcb97cebdbf275))
* unify array helpers for primitives and objects and stop mutating ([3190362](https://github.com/Nico2433/utils/commit/3190362cc3487370fd00f48666d33daea35352c1))

### Bug Fixes

* wrap invalid JSON responses in FetchError and trim camelCaseDivider input ([b0f3f59](https://github.com/Nico2433/utils/commit/b0f3f5961a3eb2c9d5ccbf3cf1cb8e0acfce9c41))

### [1.0.11](https://github.com/Nico2433/utils/compare/v1.0.10...v1.0.11) (2024-06-02)

### [1.0.10](https://github.com/Nico2433/utils/compare/v1.0.9...v1.0.10) (2024-06-02)

### [1.0.9](https://github.com/Nico2433/utils/compare/v1.0.8...v1.0.9) (2024-06-02)

### [1.0.8](https://github.com/Nico2433/utils/compare/v1.0.7...v1.0.8) (2024-06-02)

### [1.0.7](https://github.com/Nico2433/utils/compare/v1.0.6...v1.0.7) (2024-05-07)

### [1.0.6](https://github.com/Nico2433/utils/compare/v1.0.5...v1.0.6) (2024-04-25)

### [1.0.5](https://github.com/Nico2433/utils/compare/v1.0.4...v1.0.5) (2024-04-14)

### [1.0.4](https://github.com/Nico2433/utils/compare/v1.0.3...v1.0.4) (2024-03-27)

### [1.0.3](https://github.com/Nico2433/utils/compare/v1.0.2...v1.0.3) (2024-03-24)

### [1.0.2](https://github.com/Nico2433/utils/compare/v1.0.1...v1.0.2) (2024-03-12)

### 1.0.1 (2024-03-12)


### Bug Fixes

* test ([da3ecec](https://github.com/Nico2433/utils/commit/da3ecec30ca8cdbb699544a113b59d21f3352b4f))
* test ([4becda1](https://github.com/Nico2433/utils/commit/4becda1c7ec6258c314df92de96fef9cf9442ec3))
