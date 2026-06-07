# Istruzioni AI per usare Tec PrismJS negli articoli

Questo documento contiene le regole da passare a un assistente AI quando genera
articoli, guide o contenuti CMS che devono includere comandi o codice usando il
modulo `tec_prismjs`.

## Quando usare il modulo

Usa il blocco `tec_prismjs` solo per:

- comandi da terminale composti da piu righe;
- esempi di codice composti da piu righe;
- configurazioni, query SQL, JSON, YAML o markup che richiedono formattazione
  leggibile;
- blocchi che il lettore deve poter copiare facilmente.

Non usare il blocco `tec_prismjs` per:

- nomi di funzioni, classi, hook, file o variabili citati inline;
- comandi di una sola riga dentro una frase;
- parole tecniche brevi come `actionClearCache`, `Product`, `composer install`;
- testo normale che non e codice.

Per elementi inline usa il normale tag HTML:

```html
<code>actionClearCache</code>
```

## Sintassi corretta

Il modulo si attiva solo con questa sintassi:

```text
[code=language-php]
contenuto del codice
[/code]
```

Il valore dopo `language-` deve essere uno dei linguaggi supportati.

## Regola importante per gli editor HTML

Quando il contenuto viene generato per un editor HTML, usa un tag `<p>` per ogni
riga del blocco. Questo evita che l'editor CMS perda gli a capo o trasformi il
codice in un paragrafo unico.

Esempio corretto:

```html
<p>[code=language-php]&lt;?php</p>
<p>echo "hello";</p>
<p>?&gt;[/code]</p>
```

Il modulo unira questi paragrafi in un solo blocco codice e manterra le righe.

## Esempi consigliati

### PHP

```html
<p>[code=language-php]&lt;?php</p>
<p>$message = 'Hello';</p>
<p>echo $message;</p>
<p>?&gt;[/code]</p>
```

### Bash

```html
<p>[code=language-bash]cd modules/tec_prismjs</p>
<p>php -l tec_prismjs.php</p>
<p>git status[/code]</p>
```

### JSON

```html
<p>[code=language-json]{</p>
<p>  "module": "tec_prismjs",</p>
<p>  "enabled": true</p>
<p>}[/code]</p>
```

## Linguaggi supportati

Usa solo questi identificatori:

| Linguaggio | Identificatori |
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

## Regole di sicurezza e qualita

- Non inserire credenziali, token, password, chiavi API o dati personali nei
  blocchi codice.
- Nei blocchi HTML o PHP, scrivi i caratteri `<` e `>` come entita HTML se il
  contenuto viene inserito in un editor visuale: `&lt;` e `&gt;`.
- Mantieni l'indentazione del codice.
- Non usare linguaggi non presenti nella tabella.
- Non annidare blocchi `[code=language-*]` dentro altri blocchi codice.
- Non aggiungere markup HTML decorativo dentro il contenuto del blocco codice.

## Prompt breve da passare all'AI

```text
Quando generi articoli o contenuti CMS, usa il modulo tec_prismjs solo per
comandi o codice composti da piu righe. Non usarlo per frammenti inline: in quel
caso usa <code>...</code>. Per i blocchi multi-riga usa sempre la sintassi
[code=language-...] ... [/code] e, se il contenuto e HTML, metti ogni riga in un
tag <p> separato. Usa solo i linguaggi supportati dal modulo. Non inserire
segreti, token, credenziali o dati personali nei blocchi codice.
```
