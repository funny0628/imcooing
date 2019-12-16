import JSBI from "jsbi";
DataView.prototype.setUint64 = function setUint64(
  byteOffset,
  value,
  littleEndian
) {
  if (typeof value === "bigint" && typeof this.setBigUint64 !== "undefined") {
    // the original native implementation for bigint
    this.setBigUint64(byteOffset, value, littleEndian);
  } else if (
    value.constructor === JSBI &&
    typeof value.sign === "bigint" &&
    typeof this.setBigUint64 !== "undefined"
  ) {
    // JSBI wrapping a native bigint
    this.setBigUint64(byteOffset, value.sign, littleEndian);
  } else if (value.constructor === JSBI) {
    // JSBI polyfill implementation
    const lowWord = value[0];
    let highWord = 0;
    if (value.length >= 2) {
      highWord = value[1];
    }
    this.setUint32(byteOffset + (littleEndian ? 0 : 4), lowWord, littleEndian);
    this.setUint32(byteOffset + (littleEndian ? 4 : 0), highWord, littleEndian);
  } else {
    throw TypeError("Value needs to be BigInt ot JSBI");
  }
};

DataView.prototype.getUint64 = function(byteOffset, littleEndian) {
  const left = this.getUint32(byteOffset, littleEndian);
  const right = this.getUint32(byteOffset + 4, littleEndian);
  const combined = littleEndian
    ? left + 2 ** 32 * right
    : 2 ** 32 * left + right;
  return combined;
};
const DataViewService = {
  create(len) {
    const buf = new ArrayBuffer(len);
    const view = new DataView(buf);
    return view;
  },
  get(buf) {
    const view = new DataView(buf);
    return view;
  }
};

export default DataViewService;
