import store from "../../store/store";
import { setModalContent } from "../../store/actions";
import { ModalTypes } from "../../../Constants";

export const displayError = (error) => {
    console.error(error);
    store.dispatch(setModalContent({ visible: true, content: error, type: ModalTypes.ERROR }))
}
export const displayWarning = (warning) => {
    console.warn(warning);
    store.dispatch(setModalContent({ visible: true, content: warning, type: ModalTypes.WARNING }))
}