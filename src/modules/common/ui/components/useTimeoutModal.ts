import { useCallback, isValidElement } from "react";
import { Modal, ModalFuncProps } from "antd";

export interface TimeoutModalShowReturn { destroy: () => void };
export type TimeoutContentFn = (millisecondsLeft: number) => React.ReactNode;
export type TimeoutModalFuncProps = Exclude<ModalFuncProps, ['content']> & {
  content?: TimeoutContentFn | React.ReactNode;
  timeoutStep?: number;
  timeout?: number;
};

export default function useTimeoutModal() {
  const [modal, modalContextHolder] = Modal.useModal();

  const show = useCallback((props?: TimeoutModalFuncProps): TimeoutModalShowReturn => {
    const notEmptyContent = props?.content ?? (() => undefined);
    const content = isValidElement(notEmptyContent)
      ? (() => notEmptyContent)
      : (notEmptyContent as TimeoutContentFn);
    let { timeout = 2000, timeoutStep = 1000 } = props ?? {};

    const instance = modal.success({
      ...props,
      content: content(timeout),
    });

    const timer = setInterval(() => {
      timeout -= timeoutStep;
      instance.update({
        content: content(timeout),
      });
    }, timeoutStep);

    setTimeout(() => {
      clearInterval(timer);
      instance.destroy();
    }, timeout);
    return instance;
  }, [modal]);

  return {
    show,
    modalContextHolder,
  };
}
