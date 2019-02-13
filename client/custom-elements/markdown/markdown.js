import './markdown.css';

var isDisabled = false;
var editorInstance = null;

function updateDisabled(disabled) {
  if (editorInstance && editorInstance.codemirror) {
    const $toolbar = $('.editor-toolbar');
    editorInstance.codemirror.options.readOnly = disabled;
    if (disabled) {
      $toolbar.hide();
    }
    else {
      $toolbar.show();
    }
    updateSize();
  }
  isDisabled = disabled;
}

function initializeEditor(initialValue, isDisabled) {
  // Setup SimpleMDE
  editorInstance = new SimpleMDE({
    initialValue: initialValue || '',
    element: document.getElementById('editor'),
    hideIcons: ["fullscreen", "guide", "side-by-side"],
    spellChecker: false,
    status: ["lines", "words"],
  });

  // Update initial disabled state
  updateDisabled(isDisabled);

  // React on window resize to adjust the height
  window.addEventListener('resize', updateSize);

  // React on window editor value changes to update the value in Kentico.
  editorInstance.codemirror.on(
    'changes',
    () => {
      setValue(editorInstance.value());
      updateSize();
    });
}

function updateSize() {
  // Update the custom element height in the Kentico UI.
  const height = Math.ceil($("html").height());
  CustomElement.setHeight(height);
}

function setValue(value) {
  // Send updated value to Kentico (send null in case of the empty string => element will not meet required condition).
  if (!isDisabled) {
    CustomElement.setValue(value || null);
  }
}

function initCustomElement() {
  try {
    CustomElement.init((element, _context) => {
      // Setup with initial value and disabled state
      initializeEditor(element.value, element.disabled);
      updateSize();
    });

    // React on disabled changed (e.g. when publishing the item)
    CustomElement.onDisabledChanged(updateDisabled);
  }
  catch (err) {
    // Initialization with Kentico Custom element API failed (page displayed outside of the Kentico UI)
    console.error(err);
    initializeEditor(err.toString());
  }
}

initCustomElement();
