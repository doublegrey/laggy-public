export function percentage(partialValue: number, totalValue: number) {
  if (totalValue === 0) {
    return 0;
  }
  return Math.round((100 * partialValue) / totalValue);
}

export function titleCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function bytesToSize(bytes: number) {
  var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Bytes";
  var i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
}

export function numberWithCommas(x: number, precision: number) {
  return x.toFixed(precision).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
