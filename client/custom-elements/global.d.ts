type CustomElement = {
  value: string | null; // Initial value of a Custom element
  disabled: boolean; // Indicates whether an element is disabled for editing
  config: object | null; // Element configuration object specified in the UI in a content type or a content type snippet
};

type Context = {
  projectId: string; // Unique identifier of the Kentico Cloud project
  item: {
    id: string; // ID of an item containing a Custom element
    codename: string; // Codename of an item containing a Custom element
  };
  variant: {
    id: string; // An identifier of a language variant
    codename: string; // Codename of a language variant. For example, “en-us“
  };
};

declare const CustomElement: {
  readonly init: (callback: (element: CustomElement, context: Context) => void) => void;
  readonly setValue: (value: string) => void;
  readonly setHeight: (value: number) => void;
  readonly onDisabledChanged: (callback: (disabled: boolean) => void) => void;
};
