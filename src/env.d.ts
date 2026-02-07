declare global {
  interface Window {
    umami: {
      track: (event: string) => void;
    };
  }
}

export {};
