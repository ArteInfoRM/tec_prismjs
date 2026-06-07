# Code and Prism.js integration

PrestaShop module by Tecnoacquisti.com® that highlights code snippets in CMS pages, blog content, and other front-office text rendered by the shop.

The module converts supported shortcodes into Prism.js code blocks, adds syntax highlighting, and provides a copy button without requiring external CDN assets.

## Features

- Syntax highlighting powered by locally bundled Prism.js assets.
- Shortcode parser active only on supported `[code=language-*]` blocks.
- Safe DOM-based rendering that keeps code content as text.
- Copy button with Clipboard API and legacy fallback.
- Okaidia dark theme option in the module configuration.
- Front-office assets registered with PrestaShop 1.7 legacy fallbacks.

## Compatibility

- PrestaShop 1.7.8.x
- PrestaShop 8.x
- PrestaShop 9.x, target compatibility up to 9.1

## Installation

1. Copy the `tec_prismjs` directory into the PrestaShop `modules/` directory.
2. Go to **Back Office > Modules > Module Manager**.
3. Search for **Code and Prism.js integration**.
4. Install and enable the module.
5. Open the module configuration page to choose the default Prism theme.

## Usage

Use this shortcode format in CMS pages, blog content, or text rendered in the front office:

```text
[code=language-php] //your code here [/code]
```

The module only activates when the shortcode uses the `language-` prefix and one of the supported languages below.

## Supported Languages

| Language | Shortcodes |
| --- | --- |
| Bash/Shell | `language-bash`, `language-shell` |
| HTML | `language-markup`, `language-html` |
| CSS | `language-css` |
| JavaScript | `language-javascript`, `language-js` |
| Python | `language-python` |
| Java | `language-java` |
| C | `language-c` |
| C++ | `language-cpp` |
| C# | `language-csharp` |
| PHP | `language-php` |
| Ruby | `language-ruby` |
| Go | `language-go` |
| SQL | `language-sql` |
| JSON | `language-json` |
| XML | `language-xml` |
| YAML | `language-yaml` |
| Markdown | `language-markdown` |
| Perl | `language-perl` |
| Rust | `language-rust` |
| Swift | `language-swift` |
| TypeScript | `language-typescript` |
| Kotlin | `language-kotlin` |

## Security Notes

Code between `[code=language-*]` and `[/code]` is inserted as text content, not as HTML. This prevents snippets from being interpreted as page markup or JavaScript.

Unsupported language identifiers are ignored and left unchanged.

## Assets

Prism.js core, autoloader, themes, and supported language components are bundled under:

- `views/js/vendor/prism/`
- `views/css/vendor/prism/`

This keeps the module independent from external CDNs and easier to use on shops with strict Content Security Policy or restricted outbound access.

## Support

For support, contact Tecnoacquisti.com® through the official help desk:

- Website: <https://www.tecnoacquisti.com>
- Support: <https://help.tecnoacquisti.com>
