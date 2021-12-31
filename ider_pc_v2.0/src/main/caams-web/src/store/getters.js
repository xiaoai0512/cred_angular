const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  multiTab: state => state.app.multiTab,
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  menuList: state => state.user.menuList,
  addRouters: state => state.permission.addRouters,
  lang: state => state.i18n.lang,
  extendData: state => state.page.extendData
};
export default getters
