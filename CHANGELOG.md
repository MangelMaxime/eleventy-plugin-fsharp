# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## 1.3.0 - 2023-12-20

### Fixed

* Support permalink

## 1.2.0 - 2023-12-20

### Fixed

* Declare the `compile` function inside of the `configFunction` otherwise, when consuming the package as a dependency some of the updated variable were not updated. ¯\_(ツ)_/¯

## 1.1.0 - 2023-12-20

### Changed

* Don't instantiate our owm `NunjucksEngine` but instead use the instance from Eleventy.

## 1.0.1 - 2023-12-20

### Fixed

* Fix entry point of the package.

## 1.0.0 - 2023-12-18 [YANKED]

### Changed

* Remove `remark` internal usage in favor of using the `markdown` engine set in the user configuration.

## 0.1.0 - 2022-11-22

### Added

* Initial release
