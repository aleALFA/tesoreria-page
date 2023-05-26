import { useCallback, createElement } from "react";
import { Result } from "antd";

import useTimeoutModal,
  { TimeoutModalFuncProps, TimeoutModalShowReturn } from "../../../common/ui/components/useTimeoutModal";

export type SavedMovementModalFuncProps = TimeoutModalFuncProps & {
  counterText?: string;
  message?: string;
};

export default function useBrotherSavedModal() {
  const { show: timeoutShow, modalContextHolder } = useTimeoutModal();

  const show = useCallback((props?: SavedMovementModalFuncProps): TimeoutModalShowReturn => {
    const counterText = props?.counterText ?? texts.bodyCounter;
    const message = props?.message ?? texts.bodyMessage;

    const content: any = props?.content ?? ((millisecondsLeft: number): React.ReactNode => {
      return createElement(Result, {
        subTitle: counterText.replace('{sec}', `${millisecondsLeft / 1000}`),
        status: 'success',
        title: message,
      });
    });

    return timeoutShow({
      ...props,
      cancelText: props?.cancelText ?? texts.buttonListLabel,
      okText: props?.okText ?? texts.buttonReceiptLabel,
      title: props?.title ?? texts.title,
      bodyStyle: { margin: 0 },
      style: { margin: 0 },
      content,
    });
  }, [timeoutShow]);

  return {
    show,
    modalContextHolder,
  };
}

const texts = {
  title: '¡Éxito!',
  bodyMessage: 'Movimientos guardados',
  bodyCounter: 'Este aviso se cerrará en {sec} segundos',
  buttonReceiptLabel: 'Descargar recibo',
  buttonListLabel: 'Regresar al listado',
};
