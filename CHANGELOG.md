# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows semantic versioning.

## [Unreleased]

### Fixed

- Fixed PrestaShop validator reports for license headers and coding standard rules.
- Added support for shortcodes split across sibling HTML elements, such as CMS content where each code line is wrapped in a separate `<p>` tag.

## [1.1.0] - 2026-06-07

### Added

- Added local Prism.js assets, themes, autoloader, and supported language components.
- Added front-office parser for `[code=language-*]` shortcodes.
- Added support for Bash/Shell, HTML, CSS, JavaScript, Python, Java, C, C++, C#, PHP, Ruby, Go, SQL, JSON, XML, YAML, Markdown, Perl, Rust, Swift, TypeScript, and Kotlin.
- Added copy button with Clipboard API support and legacy fallback.
- Added GitHub-style README documentation.
- Added release packaging helpers through `.gitattributes` and `.gitignore`.

### Changed

- Updated module compatibility to PrestaShop `1.7.8.0` through `9.1`.
- Replaced inline Smarty JavaScript with a dedicated `views/js/front.js` file.
- Replaced CDN-based Prism loading with local module assets.
- Scoped front-office CSS to `tec-prismjs-*` classes to avoid styling unrelated code blocks.
- Improved module configuration validation for the Okaidia theme option.
- Updated module metadata to version `1.1.0`.

### Removed

- Removed the `displayFooterBefore` front-office rendering path.
- Removed obsolete hook templates that injected inline scripts and CDN links.
- Removed creation of the unused `tec_prismjs` database table.

### Security

- Code snippets are now rendered through DOM text nodes instead of `document.body.innerHTML`.
- Unsupported shortcode languages are ignored instead of converted into HTML.

## [1.0.0] - 2024-01-01

### Added

- Initial module release with Prism.js integration and Okaidia theme option.
