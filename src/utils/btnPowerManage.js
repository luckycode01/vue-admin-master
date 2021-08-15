import store from "@/store";

export const btnPowerManage = btnStr => {
  let buttons = store.getters.buttons;
  return buttons.indexOf(btnStr) !== -1;
};
