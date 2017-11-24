/* eslint indent: 0 no-console: 0 */

export class Storage {
  constructor(storage, name) {
    this.storage = storage;
    this.name = name;
  }

  get() {
    return this.storage.getItem(this.name);
  }

  set(value) {
    this.storage.setItem(this.name, value);
  }

  remove() {
    this.storage.removeItem(this.name);
  }
}

export class ObjectStorage extends Storage {

  get() {
    const json = super.get();
    if (json) {
      return JSON.parse(json);
    }
    return undefined;
  }

  set(obj) {
    this.storage.setItem(this.name, JSON.stringify(obj));
  }
}

export class NumberStorage extends Storage {

  get() {
    const str = super.get();
    if (str) {
      return parseInt(str, 10);
    }
    return undefined;
  }
}
