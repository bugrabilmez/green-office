const _getItem = key => {
  return JSON.parse(localStorage.getItem(key));
};

const _setItem = (key, obj) => {
  localStorage.setItem(key, JSON.stringify(obj));
};

module.exports = {
  getItem: _getItem,
  setItem: _setItem
};
