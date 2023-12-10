export function once<T extends Function>(ship: T) {
  const main = function () {
    if (main.invocked) return;
    main.invocked = true;
    return ship(...arguments);
  } as unknown as T & { invocked: boolean };
  main.invocked = false;
  return main;
}

export function isDefined<T>(val: T | undefined): val is T {
  return val !== undefined;
}
