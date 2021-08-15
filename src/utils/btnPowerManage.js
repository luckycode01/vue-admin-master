import store from "@/store";

export function buttonPower(btnStr) {
  let buttons = store.getters.buttons;
  return buttons.indexOf(btnStr) !== -1;
}
