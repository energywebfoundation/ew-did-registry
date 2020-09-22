export interface IDidStore {
  /**
   * stores data in decentralized store
   *
   * @param claim {string} stringified claim
   */
  save(claim: string): Promise<string>;

  /**
   *
   * @param uri {string}
   */
  get(uri: string): Promise<string>;

  /**
   * Attempts to delete claim
   *
   * @param uri {string}
   */
  delete(uri: string): Promise<boolean>;
}
