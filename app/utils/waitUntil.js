export const waitUntil = (conditionFunction, timeout = 400) => {

  const poll = resolve => {
    if(conditionFunction()) resolve();
    else setTimeout(_ => poll(resolve), timeout);
  }

  return new Promise(poll);
}
