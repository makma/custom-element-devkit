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

function setupColorPicker(hexColorValue) {
  const container = document.querySelector('#color-picker');
  const picker = new CP(container, false, container);
  picker.self.classList.add('static');
  if (!!hexColorValue) {
    picker.set(hexColorValue);
    container.parentNode.style.backgroundColor = hexColorValue;
  }
  picker.on("change", function (color) {
    container.parentNode.style.backgroundColor = '#' + color;
    if (!isDisabled) {
      // Send updated color to Kentico
      CustomElement.setValue('#' + color);
    }
  });
  picker.enter();
}

function updateSize() {
  // Update the custom element height in the Kentico UI.
  const height = Math.ceil($("html").height());
  CustomElement.setHeight(height);
}

function initCustomElement() {
  try {
    CustomElement.init((element, _context) => {
      // Setup with initial value and disabled state
      updateDisabled(element
        .disabled
      )
      ;
      setupColorPicker(element.value);
      updateSize();
    })
    ;
    // React on disabled changed (e.g. when publishing the item)
    CustomElement.onDisabledChanged(updateDisabled);
  }
  catch (err) {
    // Initialization with Kentico Custom element API failed (page displayed outside of the Kentico UI)
    console.error(err);
    setupColorPicker();
    updateDisabled(true);
  }
}

initCustomElement();
