const observedElements = ['description']

var isDisabled = false;

function updateDisabled(disabled) {
  isDisabled = disabled;
  if (disabled) {
    $('.disabled_overlay').show();
  }
  else {
    $('.disabled_overlay').hide();
  }
}

function updateValue(value) {
    const container = document.querySelector('#custom-element');
    container.innerHTML = `<h4>${value}<h4>`
    CustomElement.setValue(value);
    updateSize();
}

function setupElement(value) {
    console.log(`Element has been set up. Value: ${value}`)
    updateValue(value);
}

function updateSize() {
  // Update the custom element height in the Kentico UI.
  const height = Math.ceil($("html").height());
  CustomElement.setHeight(height);
}

CustomElement.observeElementChanges(observedElements, (changedElementCodenames) => {
    // React to change in particular element
    if (changedElementCodenames.includes('description')) {
        CustomElement.getElementValue('description', (value) => {
            // Use the returned element value here
            const countOfWords = value.split(" ").length;
            updateValue(countOfWords.toString());
          })
    }
 })

function initCustomElement() {
  try {
    CustomElement.init((element, _context) => {
      // Setup with initial value and disabled state
      updateDisabled(element
        .disabled
      );

      setupElement(element.value);
      updateSize();
    })
    ;
    // React on disabled changed (e.g. when publishing the item)
    CustomElement.onDisabledChanged(updateDisabled);
  }
  catch (err) {
    // Initialization with Kentico Custom element API failed (page displayed outside of the Kentico UI)
    console.error(err);
    setupElement();
    updateDisabled(true);
  }
}

initCustomElement();
