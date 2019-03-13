interface IIdentifier {
  readonly id: string;
  readonly codename: string;
}

interface ICustomElementData {
  readonly value: string | null;
  readonly disabled: boolean;
  readonly config: object | null;
}

interface ICustomElementContext {
  readonly projectId: string;
  readonly item: IIdentifier;
  readonly variant: IIdentifier;
}

interface ICustomElement {
  readonly init: (callback: (element: ICustomElementData, context?: ICustomElementContext) => void) => void;
  readonly setValue: (value: string | null) => void;
  readonly onDisabledChanged: (callback: (disabled: boolean) => void) => void;
  readonly setHeight: (height: number) => void;
}

const log = console.log;

const fakeContext = {
  item: {
    codename: 'no-item',
    id: '00000000-0000-0000-0000-000000000000',
  },
  projectId: '00000000-0000-0000-0000-000000000000',
  variant: {
    id: '00000000-0000-0000-0000-000000000000',
    codename: 'no-variant',
  },
};

class FakeCustomElement implements ICustomElement {

  private changeDisabledCb: (value: boolean) => void | null;

  constructor() {
    (window as any).customElement = Object.assign((window as any).customElement || {}, {
      changeDisabled: (value: boolean) => {
        this.changeDisabledTo(value);
      },
      height: 'default',
    });
    (window.top as any).customElement = (window as any).customElement;
  }

  private changeDisabledTo(value: boolean) {
    if (this.changeDisabledCb) {
      this.changeDisabledCb(value);
    }
    else {
      throw new Error('You have not provided an onDisabledChange callback.');
    }
  }

  public setValue(value: string | null): void {
    log(`The custom element is setting value:`);
    log(value);

    if (typeof value !== 'string' && value !== null) {
      throw Error('The provided value must be a string or null.');
    }

    if (window.top && (window.top as any).storeValue) {
        (window.top as any).storeValue(value);
    }
    (window as any).customElement.value = value;
  }

  public init(cb: (element: ICustomElementData, context: ICustomElementContext) => void): void {
    if (typeof cb !== 'function') {
      throw Error('Specify a callback function.');
    }

    setTimeout(() => {
      const initialValue = (window as any).customElement.initialValue || null;
      if ((window.top as any).storeInitialValue) {
        (window.top as any).storeInitialValue(initialValue);
      }

      cb(
        {
          config: (window as any).customElement.config || {},
          disabled: ((window.top as any).getDisabled && (window.top as any).getDisabled()) || false,
          value: ((window.top as any).getValue && (window.top as any).getValue()) || null,
        },
        fakeContext);
    }, 500);
  }

  public onDisabledChanged(cb: (disabled: boolean) => void): void {
    if (typeof cb !== 'function') {
      throw Error('Specify a callback function.');
    }

    this.changeDisabledCb = cb;
  }

  public setHeight(height: number): void {
    if (!Number.isInteger(height) || height < 0) {
      throw Error('The specified height must be a positive integer.');
    }

    (window as any).customElement.height = height;
    if (window.top && (window.top as any).setHeight) {
      (window.top as any).setHeight(height);
    }
  }
}

(window as any).CustomElement = new FakeCustomElement();
