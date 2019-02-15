import './bundle.css';

const frame = document.querySelector('#frame');

const setHeight = (height: number) => {
  frame!.setAttribute('height', height.toString());
};

const enabledInput = document.querySelector('#enabled');
enabledInput!.addEventListener('change', (event) => {
  (window as any).customElement.changeDisabled(!(event as any).target.checked);
});

Object.assign(window, { setHeight });
