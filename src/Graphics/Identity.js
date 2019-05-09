export class Identity {
  static getUniqueID() {
    if (!Identity.currentID) Identity.currentID = 0;
    return (Identity.currentID += 1);
  }
}
