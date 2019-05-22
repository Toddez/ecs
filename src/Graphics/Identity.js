export class Identity {
  static getReferenceFromUniqueID(id) {
    console.log(Identity.references);
    
    if (Identity.references)
      return Identity.references[1 + id];
    else
      return;
  }

  static getUniqueID(reference) {
    if (!Identity.references) Identity.references = [];
    if (!Identity.currentID) Identity.currentID = 0;
    if (reference) Identity.references.push(reference);
    
    return (Identity.currentID += 1);
  }
}
