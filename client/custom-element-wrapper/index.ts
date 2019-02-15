import './bundle.css';

const frame = document.querySelector('#frame');

const setHeight = (height: number) => {
  frame!.setAttribute('height', height.toString());
};

Object.assign(window, { setHeight });
