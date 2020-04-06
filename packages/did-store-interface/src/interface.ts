
export interface IDidStore {
  /**
   * stores data in decentralized store. This method
   *  should garantee immutability of the saved claim
   *
   * @param claim {string} stringified claim
   */
  store(claim: string): Promise<string>;

  /**
   *
   * @param uri {string}
   */
  get(uri: string): Promise<string>;
}
