interface Listener<K extends keyof HTMLElementEventMap> extends EventListener {
  (event: HTMLElementEventMap[K]): void;
}

export const on = <
  T extends EventTarget,
  U extends keyof HTMLElementEventMap,
  V extends AddEventListenerOptions
>(
  target: T,
  event: U,
  listener: Listener<U>,
  options?: V | boolean
): void => target.addEventListener(event, listener, options);

export const off = <
  T extends EventTarget,
  U extends keyof HTMLElementEventMap,
  V extends EventListenerOptions
>(
  target: T,
  event: U,
  listener: Listener<U>,
  options?: V | boolean
): void => target.removeEventListener(event, listener, options);
