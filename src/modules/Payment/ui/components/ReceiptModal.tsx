import { Button, Col, Image, Modal, Row, Skeleton } from "antd";
import { useMemo } from "react";

export type ReceiptModalContentType = 'jpeg';

export interface ReceiptModalProps {
  contentType?: ReceiptModalContentType;
  receiptContent: string;
  isLoading: boolean;
  sequence: string;
  isOpen: boolean;
  handleClose: () => void;
}

export default function ReceiptModal(props:ReceiptModalProps) {
  const imageType = useMemo(() => props.contentType ?? 'jpeg', [props.contentType]);
  const title = useMemo(() => texts.title.replace(':sequence:', props.sequence), [props.sequence]);
  const imageSrc = useMemo(
    () => `data:image/${imageType};base64,${props.receiptContent}`,
    [imageType,props.receiptContent]
  );

  const footer = useMemo(() => [
    <Button
      key="link"
      href={imageSrc}
      download={`${title}.${imageType}`}
      type="primary">
      {texts.downloadLabel}
    </Button>,
  ], [texts, title, imageSrc]);

  return (
    <Modal
      title={title}
      footer={footer}
      onCancel={props.handleClose}
      open={props.isOpen}>
      <Row justify="center">
        <Col>
          { props.isLoading
            ? <Skeleton.Image active={true} />
            : <Image
              src={imageSrc}
              placeholder={props.isLoading}
            />
          }
        </Col>
      </Row>
    </Modal>
  );
}

const texts = {
  title: 'Recibo :sequence:',
  downloadLabel: 'Descargar Recibo',
};
