export const put = (k,v) => {
  localStorage.setItem(k,v);
}
export const get = (k) => {
  return localStorage.getItem(k);
}
