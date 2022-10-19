const DEFAULT_WAIT_FOR_INTERVAL = 1000;

/**
 * @description asynchronously waits for fulfillment of given condition. Throws error if condition wasn't fulfilled in time
 *
 * @param condition asynchronous funtion which resolves to boolean
 * @param opts.timeout time to wait until `condition` is met, in seconds
 * @param opts.interval interval between `condition` checking attempts, in seconds
 * @returns
 */
export const waitFor = async (
  condition: () => Promise<boolean>,
  opts: { timeout: number; interval?: number }
) => {
  const { timeout, interval = DEFAULT_WAIT_FOR_INTERVAL } = opts;
  return new Promise<void>((resolve, reject) => {
    let elapsedTime = 0;
    const scheduleNextCheck = () =>
      setTimeout(async () => {
        elapsedTime += interval;
        try {
          if (await condition()) {
            resolve();
          } else {
            if (elapsedTime > timeout) {
              reject();
            }
            scheduleNextCheck();
          }
        } catch (_) {
          scheduleNextCheck();
        }
      }, interval);

    scheduleNextCheck();
  });
};
