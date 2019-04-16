import './bundle.css';

const frame = document.querySelector('#frame');

const setHeight = (height: number) => {
  frame!.setAttribute('height', height.toString());
};

const storeValue = (value: string | null) => {
  if (value !== null) {
      localStorage.setItem('custom-element', value);
  }
  else {
      localStorage.removeItem('custom-element');
  }
};

let initialValueStored;

const storeInitialValue = (value: string | null) => {
  if (!initialValueStored) {
    storeValue(value);
    initialValueStored = true;
  }
};

const getValue = (): string | null => {
    const value = localStorage.getItem('custom-element');
    return value;
};

const storeDisabled = (disabled: boolean) => {
    if (disabled) {
        localStorage.setItem('disabled', 'true');
    }
    else {
        localStorage.removeItem('disabled');
    }
};

const getDisabled = (): boolean => {
    const disabled = localStorage.getItem('disabled') === 'true';
    return disabled;
};

const enabledInput = document.querySelector('#enabled');
enabledInput!.addEventListener('change', (event) => {
    const newDisabled = !(event as any).target.checked;
    storeDisabled(newDisabled);
    (window as any).customElement.changeDisabled(newDisabled);
});
if (getDisabled()) {
    enabledInput!.removeAttribute('checked');
}

const refresh = () => {
  (frame as any).contentWindow.location.replace((frame as any).contentWindow.location);
};

const clearBtn = document.querySelector('#clear');
clearBtn!.addEventListener('click', (event) => {
    storeValue(null);
    if (event && event.target) { (event.target as HTMLElement).blur(); }
    refresh();
});

const refreshBtn = document.querySelector('#refresh');
refreshBtn!.addEventListener('click', (event) => {
    if (event && event.target) { (event.target as HTMLElement).blur(); }
    refresh();
});

const DevKit = {
  setHeight,
  storeInitialValue,
  storeValue,
  getValue,
  getDisabled,
};

Object.assign(window, { DevKit });
