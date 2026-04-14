(function () {
  const TOKEN_REGEX = /(^|[^\p{L}\p{N}_])AI(?=[^\p{L}\p{N}_]|$)/gu;
  const SKIP_TAGS = new Set([
    "INPUT",
    "NOSCRIPT",
    "OPTION",
    "SCRIPT",
    "SELECT",
    "STYLE",
    "TEXTAREA"
  ]);

  function shouldSkipElement(element) {
    if (!element) {
      return true;
    }

    if (SKIP_TAGS.has(element.tagName) || element.isContentEditable) {
      return true;
    }

    if (element.closest("[contenteditable='true']")) {
      return true;
    }

    for (let current = element; current; current = current.parentElement) {
      if (SKIP_TAGS.has(current.tagName) || current.hidden) {
        return true;
      }

      const style = window.getComputedStyle(current);
      if (style.display === "none" || style.visibility === "hidden") {
        return true;
      }
    }

    return false;
  }

  function replaceStandaloneAi(text) {
    return text.replace(TOKEN_REGEX, "$1HITLER");
  }

  function processTextNode(node) {
    if (!node || !node.textContent) {
      return;
    }

    const parent = node.parentElement;
    if (shouldSkipElement(parent)) {
      return;
    }

    const updatedText = replaceStandaloneAi(node.textContent);
    if (updatedText !== node.textContent) {
      node.textContent = updatedText;
    }
  }

  function processSubtree(root) {
    if (!root) {
      return;
    }

    if (root.nodeType === Node.TEXT_NODE) {
      processTextNode(root);
      return;
    }

    const baseElement =
      root.nodeType === Node.ELEMENT_NODE ? root : root.parentElement;
    if (!baseElement || shouldSkipElement(baseElement)) {
      return;
    }

    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          return shouldSkipElement(node.parentElement)
            ? NodeFilter.FILTER_REJECT
            : NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let currentNode = walker.nextNode();
    while (currentNode) {
      processTextNode(currentNode);
      currentNode = walker.nextNode();
    }
  }

  function start() {
    processSubtree(document.body);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          processTextNode(mutation.target);
          continue;
        }

        for (const node of mutation.addedNodes) {
          processSubtree(node);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }

  if (document.body) {
    start();
  } else {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  }
})();
