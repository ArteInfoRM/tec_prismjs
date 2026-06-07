/**
 * 2009-2026 Tecnoacquisti.com
 *
 * @author    Tecnoacquisti.com
 * @copyright 2009-2026 Tecnoacquisti.com
 * @license   https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */
(function () {
    'use strict';

    var allowedLanguages = {
        bash: 'bash',
        shell: 'bash',
        markup: 'markup',
        html: 'markup',
        css: 'css',
        javascript: 'javascript',
        js: 'javascript',
        python: 'python',
        java: 'java',
        c: 'c',
        cpp: 'cpp',
        csharp: 'csharp',
        php: 'php',
        ruby: 'ruby',
        go: 'go',
        sql: 'sql',
        json: 'json',
        xml: 'markup',
        yaml: 'yaml',
        markdown: 'markdown',
        perl: 'perl',
        rust: 'rust',
        swift: 'swift',
        typescript: 'typescript',
        kotlin: 'kotlin'
    };

    var languagePattern = Object.keys(allowedLanguages).join('|');
    var shortcodePattern = new RegExp('\\[code=language-(' + languagePattern + ')\\]([\\s\\S]*?)\\[\\/code\\]', 'gi');
    var shortcodeOpenPattern = new RegExp('\\[code=language-(' + languagePattern + ')\\]', 'i');
    var shortcodeClosePattern = /\[\/code\]/i;
    var ignoredParents = {
        SCRIPT: true,
        STYLE: true,
        TEXTAREA: true,
        INPUT: true,
        SELECT: true,
        PRE: true,
        CODE: true
    };

    function hasClass(element, className) {
        if (!element || element.nodeType !== 1) {
            return false;
        }

        if (element.classList) {
            return element.classList.contains(className);
        }

        return (' ' + element.className + ' ').indexOf(' ' + className + ' ') !== -1;
    }

    function getModuleBaseUrl() {
        var scripts = document.getElementsByTagName('script');
        var marker = '/modules/tec_prismjs/views/js/front.js';
        var index;
        var markerIndex;
        var src;

        for (index = scripts.length - 1; index >= 0; index -= 1) {
            src = scripts[index].getAttribute('src') || '';
            markerIndex = src.indexOf(marker);

            if (markerIndex !== -1) {
                return src.slice(0, markerIndex) + '/modules/tec_prismjs/';
            }
        }

        return '';
    }

    function configurePrismAutoloader() {
        var moduleBaseUrl = getModuleBaseUrl();

        if (
            moduleBaseUrl
            && window.Prism
            && window.Prism.plugins
            && window.Prism.plugins.autoloader
        ) {
            window.Prism.plugins.autoloader.languages_path = moduleBaseUrl + 'views/js/vendor/prism/components/';
        }
    }

    function canProcessTextNode(node) {
        var parent = node.parentNode;

        while (parent && parent.nodeType === 1) {
            if (ignoredParents[parent.nodeName] || hasClass(parent, 'tec-prismjs-block')) {
                return false;
            }

            parent = parent.parentNode;
        }

        return shortcodePattern.test(node.nodeValue);
    }

    function isIgnoredElement(element) {
        var parent = element;

        while (parent && parent.nodeType === 1) {
            if (ignoredParents[parent.nodeName] || hasClass(parent, 'tec-prismjs-block')) {
                return true;
            }

            parent = parent.parentNode;
        }

        return false;
    }

    function createCopyButton(codeElement) {
        var button = document.createElement('button');

        button.type = 'button';
        button.className = 'tec-prismjs-copy';
        button.setAttribute('aria-label', 'Copy code');
        button.appendChild(document.createTextNode('Copy code'));
        button.addEventListener('click', function () {
            copyCode(codeElement, button);
        });

        return button;
    }

    function copyCode(codeElement, button) {
        var code = codeElement.textContent || '';

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(code).then(function () {
                showCopyState(button, 'Copied');
            }, function () {
                fallbackCopy(code, button);
            });

            return;
        }

        fallbackCopy(code, button);
    }

    function fallbackCopy(code, button) {
        var textarea = document.createElement('textarea');

        textarea.value = code;
        textarea.setAttribute('readonly', 'readonly');
        textarea.style.position = 'fixed';
        textarea.style.top = '-1000px';
        textarea.style.left = '-1000px';
        document.body.appendChild(textarea);
        textarea.select();

        try {
            document.execCommand('copy');
            showCopyState(button, 'Copied');
        } catch (error) {
            showCopyState(button, 'Copy failed');
        }

        document.body.removeChild(textarea);
    }

    function showCopyState(button, label) {
        var originalLabel = 'Copy code';

        button.textContent = label;

        window.setTimeout(function () {
            button.textContent = originalLabel;
        }, 2000);
    }

    function createCodeBlock(language, code) {
        var prismLanguage = allowedLanguages[language.toLowerCase()];
        var pre = document.createElement('pre');
        var header = document.createElement('div');
        var label = document.createElement('span');
        var codeElement = document.createElement('code');

        pre.className = 'tec-prismjs-block language-' + prismLanguage;
        header.className = 'tec-prismjs-header';
        label.className = 'tec-prismjs-language';
        label.appendChild(document.createTextNode(language));
        codeElement.className = 'tec-prismjs-code language-' + prismLanguage;
        codeElement.textContent = code;

        header.appendChild(label);
        header.appendChild(createCopyButton(codeElement));
        pre.appendChild(header);
        pre.appendChild(codeElement);

        return pre;
    }

    function replaceShortcodesInTextNode(node) {
        var text = node.nodeValue;
        var fragment = document.createDocumentFragment();
        var lastIndex = 0;
        var match;

        shortcodePattern.lastIndex = 0;

        while ((match = shortcodePattern.exec(text)) !== null) {
            if (match.index > lastIndex) {
                fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
            }

            fragment.appendChild(createCodeBlock(match[1], match[2]));
            lastIndex = shortcodePattern.lastIndex;
        }

        if (lastIndex < text.length) {
            fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
        }

        node.parentNode.replaceChild(fragment, node);
    }

    function getShortcodeNodeText(node) {
        if (node.nodeType === 3) {
            return node.nodeValue;
        }

        if (node.nodeType === 1 && !isIgnoredElement(node)) {
            return node.textContent || '';
        }

        return '';
    }

    function shouldAddNodeBreak(previousNode, currentNode) {
        return previousNode
            && previousNode.nodeType === 1
            && currentNode.nodeType === 1
            && currentNode.nodeName !== 'BR';
    }

    function createWrappedShortcodeFragment(data) {
        var fragment = document.createDocumentFragment();

        if (data.before) {
            fragment.appendChild(document.createTextNode(data.before));
        }

        fragment.appendChild(createCodeBlock(data.language, data.code));

        if (data.after) {
            fragment.appendChild(document.createTextNode(data.after));
        }

        return fragment;
    }

    function findWrappedShortcode(startNode) {
        var nodes = [];
        var currentNode = startNode;
        var combinedText = '';
        var previousNode = null;
        var openMatch;
        var closeMatch;
        var searchText;

        while (currentNode) {
            if (currentNode.nodeType === 1 && isIgnoredElement(currentNode)) {
                return null;
            }

            if (currentNode.nodeType === 1 || currentNode.nodeType === 3) {
                if (shouldAddNodeBreak(previousNode, currentNode)) {
                    combinedText += '\n';
                }

                combinedText += getShortcodeNodeText(currentNode);
                nodes.push(currentNode);

                openMatch = shortcodeOpenPattern.exec(combinedText);

                if (openMatch) {
                    searchText = combinedText.slice(openMatch.index + openMatch[0].length);
                    closeMatch = shortcodeClosePattern.exec(searchText);

                    if (closeMatch) {
                        return {
                            after: searchText.slice(closeMatch.index + closeMatch[0].length),
                            before: combinedText.slice(0, openMatch.index),
                            code: searchText.slice(0, closeMatch.index),
                            language: openMatch[1],
                            nodes: nodes
                        };
                    }
                }

                previousNode = currentNode;
            }

            currentNode = currentNode.nextSibling;
        }

        return null;
    }

    function replaceWrappedShortcodesInContainer(container) {
        var node = container.firstChild;
        var nextNode;
        var wrappedShortcode;
        var fragment;
        var index;

        while (node) {
            nextNode = node.nextSibling;

            if (getShortcodeNodeText(node).indexOf('[code=language-') !== -1) {
                wrappedShortcode = findWrappedShortcode(node);

                if (wrappedShortcode && wrappedShortcode.nodes.length > 1) {
                    fragment = createWrappedShortcodeFragment(wrappedShortcode);
                    container.insertBefore(fragment, wrappedShortcode.nodes[0]);
                    nextNode = wrappedShortcode.nodes[wrappedShortcode.nodes.length - 1].nextSibling;

                    for (index = 0; index < wrappedShortcode.nodes.length; index += 1) {
                        container.removeChild(wrappedShortcode.nodes[index]);
                    }
                }
            }

            node = nextNode;
        }
    }

    function replaceWrappedShortcodes(root) {
        var containers = root.querySelectorAll('*');
        var index;

        replaceWrappedShortcodesInContainer(root);

        for (index = 0; index < containers.length; index += 1) {
            if (!isIgnoredElement(containers[index])) {
                replaceWrappedShortcodesInContainer(containers[index]);
            }
        }
    }

    function collectTextNodes(root) {
        var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
        var nodes = [];
        var node;

        while ((node = walker.nextNode())) {
            shortcodePattern.lastIndex = 0;

            if (canProcessTextNode(node)) {
                nodes.push(node);
            }
        }

        return nodes;
    }

    function highlightCodeBlocks() {
        var codeBlocks = document.querySelectorAll('code.tec-prismjs-code');
        var index;

        if (!window.Prism || !window.Prism.highlightElement) {
            return;
        }

        for (index = 0; index < codeBlocks.length; index += 1) {
            window.Prism.highlightElement(codeBlocks[index]);
        }
    }

    function init() {
        var textNodes;
        var index;

        replaceWrappedShortcodes(document.body);
        textNodes = collectTextNodes(document.body);

        for (index = 0; index < textNodes.length; index += 1) {
            replaceShortcodesInTextNode(textNodes[index]);
        }

        configurePrismAutoloader();
        highlightCodeBlocks();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}());
