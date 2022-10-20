import { Modal, ModalProps } from "antd";
import styled from "styled-components";

const Backdrop = styled("div")`
  position: fixed;
  z-index: 1070;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #000;
  opacity: 0.3;
`;
export type NestedModalProps = ModalProps;

export const NestedModal = (props: NestedModalProps) => {
  return (
    <>
      {props.open && <Backdrop />}
      <Modal {...props} style={{ margin: 0, zIndex: 1080, ...props.style }}>
        {props.children}
      </Modal>
    </>
  );
};
