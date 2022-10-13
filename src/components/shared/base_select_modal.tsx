import {
  CheckableItem,
  CircleButton,
  MultipleCheckForm,
  useMultipleCheckForm,
} from "components/shared/widget";
import { Button, Dropdown, Modal } from "react-bootstrap";
import { Form, useEffectSkipFirst, usePrevious } from "utils/hooks";
import { ReactNode, useState } from "react";
import { Pagination } from "components/shared/pagination";
import { Flex } from "components/shared/flex";
import { SearchConditionView } from "components/shared/search_drawer";
import lodash from "lodash";
import { PageSet } from "utils/network/api_hooks";
import { PagingResponse } from "entities";
import { CSSProperties } from "styled-components";

type BaseSelectModalProps<T extends CheckableItem, U> = {
  title: string;
  defaultSearchForm?: U;
  searchForm?: Form<U>;
  openButtonText: string;
  executeButtonText: string;
  onClick: (items: T[]) => void;
  onChange?: (items: T[]) => void;
  onOpen: () => void;
  dropdown?: boolean;
  circle?: boolean;
  variant?: string;
  hiddenSearchParams?: string[];
  children: ReactNode;
  pageSet: PageSet;
  pagingResponse: PagingResponse;
  multipleCheckForm: MultipleCheckForm<T>;
  openButtonStyle?: CSSProperties;
  show?: boolean;
  onHide?: () => void;
};

const BaseSelectModal = <
  T extends CheckableItem,
  U extends Record<string, unknown>
>(
  props: BaseSelectModalProps<T, U>
) => {
  const [show, setShow] = useState<boolean>(false);
  const prevDefaultSearchForm = usePrevious(props.defaultSearchForm);

  const handleCloseSelectPatient = () => {
    if (props.onHide) {
      props.onHide();
    } else {
      setShow(false);
    }
  };

  useEffectSkipFirst(() => {
    if (
      !props.defaultSearchForm ||
      !prevDefaultSearchForm ||
      !props.searchForm
    ) {
      return;
    }
    let isDifference = false;
    Object.keys(prevDefaultSearchForm).forEach((key) => {
      if (props.defaultSearchForm![key] !== prevDefaultSearchForm[key]) {
        isDifference = true;
      }
    });
    if (isDifference) {
      props.searchForm?.set({
        ...(props.searchForm.object as Record<string, string>),
        ...(props.defaultSearchForm as Record<string, string>),
      } as U);
    }
  }, [props.defaultSearchForm]);

  useEffectSkipFirst(() => {
    if (props.onChange) {
      props.onChange(props.multipleCheckForm.form.object.items);
    }
  }, [props.multipleCheckForm.form.object.items]);

  const handleClickRemoveFilter = (key: keyof U): void => {
    props.searchForm?.update((f) => {
      delete f[key];
    });
  };

  useEffectSkipFirst(() => {
    const modals = document.getElementsByClassName("modal");
    if (modals && modals.length > 0) {
      new Array(modals.length).fill(0).map((_, index) => {
        modals[index].removeAttribute("tabindex");
      });
    }
  }, [show]);

  const handleClickOpen = () => {
    props.onOpen();
    setShow(true);
  };

  const getButton = () => {
    if (props.show !== undefined) {
      return <></>;
    }
    if (props.dropdown) {
      return (
        <Dropdown.Item onClick={handleClickOpen} style={props.openButtonStyle}>
          {props.openButtonText}
        </Dropdown.Item>
      );
    } else if (props.circle) {
      return (
        <CircleButton
          variant={props.variant}
          onClick={handleClickOpen}
          style={props.openButtonStyle}
        >
          {props.openButtonText}
        </CircleButton>
      );
    } else {
      return (
        <Button
          variant={props.variant}
          onClick={handleClickOpen}
          style={props.openButtonStyle}
        >
          {props.openButtonText}
        </Button>
      );
    }
  };
  return (
    <>
      {getButton()}
      <Modal
        show={props.show ? props.show : show}
        onHide={handleCloseSelectPatient}
        size="xl"
        fullscreen
      >
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
          <div style={{ marginLeft: 20 }}>
            {props.searchForm && (
              <SearchConditionView
                searchForm={props.searchForm}
                onClickRemoveButton={handleClickRemoveFilter}
                hiddenSearchParams={props.hiddenSearchParams}
              />
            )}
          </div>
        </Modal.Header>
        <Modal.Body style={{ padding: 0 }}>{props.children}</Modal.Body>
        <Modal.Footer>
          {/* <div style={{ minWidth: 140, textAlign: 'right' }}>総件数： {api.response.count.toLocaleString()}件</div> */}
          <Flex style={{ width: "100%" }}>
            <Flex style={{ flexGrow: 1 }}>
              <Pagination
                pageSet={props.pageSet}
                response={props.pagingResponse}
              ></Pagination>
              <Button
                variant="secondary"
                onClick={() => {
                  props.multipleCheckForm.form.set({ items: [] });
                }}
              >
                選択をすべて解除
              </Button>
            </Flex>
            <Button
              variant={props.variant}
              // disabled={props.multipleCheckForm.form.object.items.length === 0}
              onClick={() => {
                props.onClick(props.multipleCheckForm.form.object.items);
                setShow(false);
              }}
            >
              {props.executeButtonText}
            </Button>
          </Flex>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BaseSelectModal;
