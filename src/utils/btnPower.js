import store from "@/store";

export function hasBtnPower(btnStr) {
  const buttons = store.getters.buttons;
  return buttons.indexOf(btnStr) !== -1;
}
