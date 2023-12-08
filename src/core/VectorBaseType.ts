class VectorBaseType {
  static mark = Symbol();
  static get marks() {
    return [this.mark];
  }

  isInstanceOf(maybe: typeof VectorType) {
    return (
      (this.constructor as typeof VectorType).marks.indexOf(maybe.mark) !== -1
    );
  }
}

export class VectorType extends VectorBaseType {
  static get marks() {
    return [this.mark, ...super.marks];
  }
}
