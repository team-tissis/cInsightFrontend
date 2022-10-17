import { ThemeContext } from "contexts/theme_context";
import {
  CSSProperties,
  Dispatch,
  LegacyRef,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Button,
  ButtonProps,
  Form as BSForm,
  OverlayTrigger,
  Popover,
  Table,
  TableProps,
  ProgressBar,
  ModalProps,
  Modal,
  ButtonGroup,
  ToggleButton,
} from "react-bootstrap";
import ScaleLoader from "react-spinners/ScaleLoader";
import { Form, useEffectSkipFirst, useForm } from "utils/hooks";
import styled from "styled-components";
import lodash from "lodash";
import { Link } from "react-router-dom";
import { Flex } from "./flex";
import { GlobalStateContext } from "contexts/global_state_context";
import { copyToClipboard, truncate } from "utils/util";
import { Attribute, InputField, SelectField, SelectItem } from "./input";
import {
  BiEditAlt,
  BiTrashAlt,
  BiBarcodeReader,
  BiFilter,
} from "react-icons/bi";
import { SearchField, SearchType } from "./search_drawer";
import { useBarcode } from "react-barcodes";
import hotkeys from "hotkeys-js";
import { FaExchangeAlt, FaEye } from "react-icons/fa";
import { BsEye } from "react-icons/bs";
import { MdOutlineTabUnselected } from "react-icons/md";
import DoubleScrollbar from "./double_scrollbar";

type ExTableProps = TableProps &
  React.RefAttributes<HTMLTableElement> & {
    children: ReactNode;
  };

export const ExTable = (props: ExTableProps): JSX.Element => {
  const theme = useContext(ThemeContext);
  return (
    <Table
      id="ex-table"
      style={{ borderColor: theme.tableBorder, borderTopWidth: 5 }}
      {...props}
    >
      {props.children}
    </Table>
  );
};

type TableHeadProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLTableSectionElement>,
  HTMLTableSectionElement
>;

export const TableHead = (props: TableHeadProps): JSX.Element => {
  const theme = useContext(ThemeContext);
  return (
    <thead style={{ backgroundColor: theme.tableHeader }}>
      {props.children}
    </thead>
  );
};

type TableBodyProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLTableSectionElement>,
  HTMLTableSectionElement
> & {
  loading?: boolean;
  columnLength?: number;
};

export const TableBody = (props: TableBodyProps): JSX.Element => {
  const theme = useContext(ThemeContext);
  return (
    <tbody
      style={{
        fontSize: 14,
        backgroundColor: theme.white,
        color: theme.tableText,
      }}
    >
      {props.loading ? (
        !props.columnLength ? (
          <tr>
            <td colSpan={100}>
              <div style={{ textAlign: "center", padding: 10 }}>
                <ScaleLoader color={theme.brand} />
              </div>
            </td>
          </tr>
        ) : (
          new Array(20).fill(0).map((_, i) => {
            return (
              <tr key={"placeholder-row-" + i}>
                {new Array(props.columnLength).fill(0).map((_, j) => {
                  return (
                    <TableCell key={"placeholder" + j}>
                      <div className="placeholder-item">
                        <div className="animated-background"></div>
                      </div>
                    </TableCell>
                  );
                })}
              </tr>
            );
          })
        )
      ) : (props.children instanceof Array && props.children.length > 0) ||
        (!(props.children instanceof Array) && props.children) ? (
        props.children
      ) : (
        <tr>
          <td colSpan={100}>
            <div style={{ textAlign: "center", padding: 100 }}>
              結果がありません
            </div>
          </td>
        </tr>
      )}
    </tbody>
  );
};

export type TableCellProps = React.DetailedHTMLProps<
  React.TdHTMLAttributes<HTMLTableDataCellElement>,
  HTMLTableDataCellElement
> & {
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  th?: boolean;
  sub?: boolean;
  align?: "center" | "right";
  showBorderRight?: boolean;
  highlight?: boolean;
  order?: "asc" | "desc";
  blankText?: string;
  isFiltered?: boolean;
  unit?: string;
};

const HighlightTableCell = styled.th`
  cursor: pointer;
  &:hover {
    background: #fff3;
  }
`;
export const TableCell = (props: TableCellProps): JSX.Element => {
  const theme = useContext(ThemeContext);
  const {
    width,
    minWidth,
    maxWidth,
    th,
    sub,
    align,
    showBorderRight,
    highlight,
    order,
    style,
    ...rest
  } = props;

  const getStyle = (): CSSProperties => {
    const baseStyle: CSSProperties = {
      fontSize: 13,
      color: props.th
        ? theme.white
        : props.sub
        ? theme.tableSubText
        : theme.tableText,
      verticalAlign: "text-top",
      padding: "13px .5rem",
    };

    if (props.th) {
      baseStyle.fontWeight = "bold";
      baseStyle.borderTop = `solid 4px ${theme.tableBorder}`;
      baseStyle.backgroundColor = theme.tableHeader;
      if (props.showBorderRight) {
        baseStyle.borderRight = `solid 4px ${theme.tableBorder}`;
      }
    }

    if (props.width) {
      baseStyle.width = props.width;
      baseStyle.minWidth = props.width;
      baseStyle.maxWidth = props.width;
    }

    if (props.minWidth) {
      baseStyle.minWidth = props.minWidth;
    }

    if (props.maxWidth) {
      baseStyle.maxWidth = props.maxWidth;
    }

    if (props.align) {
      baseStyle.textAlign = props.align;
    }
    return { ...baseStyle, ...style };
  };

  if (highlight) {
    return (
      <HighlightTableCell style={{ ...getStyle() }} onClick={rest.onClick}>
        <div style={{ position: "relative" }}>
          {props.children}
          <div style={{ position: "absolute", bottom: 0, right: -10 }}>
            <div style={{ textAlign: "center" }}>
              {order === "asc" && "▲"}
              {order === "desc" && "▼"}
            </div>
            <div>
              {props.isFiltered && <BiFilter color={theme.white} size={16} />}
            </div>
          </div>
        </div>
      </HighlightTableCell>
    );
  } else {
    if (props.th) {
      return (
        <th style={getStyle()} {...rest}>
          {props.children
            ? props.children
            : props.blankText != undefined
            ? props.blankText
            : ""}
        </th>
      );
    } else {
      return (
        <td style={getStyle()} {...rest}>
          {props.children !== undefined && props.children !== null ? (
            props.unit ? (
              <div>
                {props.children}
                {props.unit && (
                  <span style={{ marginLeft: 2 }}>
                    {props.unit ? props.unit : ""}
                  </span>
                )}
              </div>
            ) : (
              props.children
            )
          ) : props.blankText != undefined ? (
            props.blankText
          ) : (
            "--"
          )}
        </td>
      );
    }
  }
};

export type OrderTableCellProps = TableCellProps & {
  orderAttr?: string;
  form?: Form<Record<string, unknown>>;
  searchType?: SearchType;
};

const HighlightItem = styled.div`
  cursor: pointer;
  padding: 10px;
  &:hover {
    background: #eee;
  }
  border-bottom: 1px solid #eee;
`;

export const OrderTableCell = (props: OrderTableCellProps): JSX.Element => {
  const { orderAttr: order, form, children, ...rest } = props;
  const theme = useContext(ThemeContext);

  const handleClick = () => {
    // if (!form || !order) {
    //     return
    // }
    // if (getOrder() === 'asc') {
    //     form.updateObject('ordering', `-${order}`)
    // } else if (getOrder() === 'desc') {
    //     form.update((f) => delete f.ordering)
    // } else {
    //     form.updateObject('ordering', order)
    // }
  };

  const getOrder = (): "asc" | "desc" | undefined => {
    const orderName: undefined | string = form?.getValue("ordering") as
      | undefined
      | string;
    if (!orderName) {
      return undefined;
    }
    if (order === orderName) {
      return "asc";
    } else if (order === orderName.replace("-", "")) {
      return "desc";
    }
  };

  const isFiltered = (): boolean => {
    if (!props.searchType) {
      return false;
    }
    if (props.searchType.type == "number") {
      return (
        !!props.form?.object[`${props.searchType.name}Max`] ||
        !!props.form?.object[`${props.searchType.name}Min`]
      );
    } else if (props.searchType.type == "date") {
      return (
        !!props.form?.object[`${props.searchType.name}After`] ||
        !!props.form?.object[`${props.searchType.name}Before`]
      );
    } else {
      return !!props.form?.object[`${props.searchType.name}`];
    }
  };

  return (
    <TableCell
      {...rest}
      order={getOrder()}
      onClick={handleClick}
      highlight
      isFiltered={isFiltered()}
    >
      <OverlayTrigger
        rootClose
        trigger="click"
        placement="bottom-start"
        overlay={
          <Popover id={`popover-basic-${props.searchType?.name}`}>
            <Popover.Body>
              <div style={{ width: 300 }}>
                {props.orderAttr && (
                  <>
                    <HighlightItem
                      onClick={() => {
                        props.form?.updateObject("ordering", props.orderAttr);
                      }}
                    >
                      昇順
                    </HighlightItem>
                    <HighlightItem
                      onClick={() => {
                        props.form?.updateObject(
                          "ordering",
                          `-${props.orderAttr}`
                        );
                      }}
                    >
                      降順
                    </HighlightItem>
                  </>
                )}
                <div>
                  {props.searchType &&
                    props.form &&
                    SearchField(props.searchType, props.form)}
                </div>
              </div>
            </Popover.Body>
          </Popover>
        }
      >
        <div>{children}</div>
      </OverlayTrigger>
    </TableCell>
  );
};

export type CheckIdForm<T extends CheckableItem> = {
  items: T[];
};

export type MultipleCheckForm<T extends CheckableItem> = {
  form: Form<CheckIdForm<T>>;
  add: (item: T) => void;
  remove: (item: T) => void;
  includes: (item: T) => boolean;
  ids: () => Array<string | number>;
  reset: () => void;
};

export type CheckableItem = {
  id?: number | string;
};

export const useMultipleCheckForm = <T extends CheckableItem>(
  initialSelectItems?: T[]
): MultipleCheckForm<T> => {
  const form = useForm<CheckIdForm<T>>({
    items: initialSelectItems ? initialSelectItems : [],
  });

  const add = (item: T) => {
    const items: Array<T> = [...(form.getValue("items") as Array<T>)];
    items.push(item);
    form.updateObject("items", items);
  };

  const remove = (item: T) => {
    const items: Array<T> = [...(form.getValue("items") as Array<T>)];
    items.splice(items.map((i) => i.id).indexOf(item.id), 1);
    form.updateObject("items", items);
  };

  const includes = (item: T): boolean => {
    if (typeof item.id === "number") {
      return (form.object.items.map((i) => i.id) as number[]).includes(
        item.id as number
      );
    } else {
      return (form.object.items.map((i) => i.id) as string[]).includes(
        item.id as string
      );
    }
  };

  const ids = (): Array<number | string> => {
    return form.object.items.map((i) => i.id!);
  };

  const reset = () => {
    form.updateObject("items", initialSelectItems || []);
  };

  return { form, add, remove, includes, ids, reset };
};

const Row = styled.tr<{ color: string }>`
  ${({ color }) => (color ? "cursor: pointer;" : "")};
  &:hover {
    background: ${({ color }) => color};
  }
`;

export type TableRowProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLTableRowElement>,
  HTMLTableRowElement
> & {
  highlight?: boolean;
};

export const TableRow = (props: TableRowProps): JSX.Element => {
  const theme = useContext(ThemeContext);
  return (
    <Row
      color={props.highlight ? theme.blue1 : "none"}
      onClick={props.onClick}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      style={props.style}
    >
      {props.children}
    </Row>
  );
};

export type CheckboxTableRowProps<T extends CheckableItem> =
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLTableRowElement>,
    HTMLTableRowElement
  > & {
    allItems?: T[];
    item?: T;
    allCheck?: boolean;
    multipleCheckForm: MultipleCheckForm<T>;
    head?: boolean;
    onClickEdit?: () => void;
    showEdit?: boolean;
    disableList?: Array<string | number>;
    maxItemCount?: number;
  };

export const CheckboxTableRow = <T extends CheckableItem>(
  props: CheckboxTableRowProps<T>
): JSX.Element => {
  const theme = useContext(ThemeContext);
  const globalState = useContext(GlobalStateContext);
  const {
    allItems,
    item,
    allCheck,
    multipleCheckForm,
    head,
    onClickEdit,
    showEdit,
    disableList,
    maxItemCount,
    ref,
    ...rest
  } = props;

  const getAllItems = () => {
    if (!props.allItems) {
      return [];
    }
    const filtered = props.allItems.filter((item) => {
      if (props.disableList) {
        return !props.disableList.includes(item.id!);
      } else {
        return true;
      }
    });
    return filtered;
  };

  const handleChangeForm = (e?: React.ChangeEvent<HTMLInputElement>) => {
    const items: Array<T> = [
      ...(props.multipleCheckForm.form.getValue("items") as Array<T>),
    ];
    if (!items) {
      return;
    }

    if (props.allCheck && props.allItems) {
      const allItems = getAllItems();
      if (e && e.target.checked) {
        if (props.maxItemCount) {
          return;
        }
        props.multipleCheckForm.form.updateObject(
          "items",
          lodash.unionBy(items, allItems, "id")
        );
      } else {
        props.multipleCheckForm.form.updateObject(
          "items",
          lodash.differenceBy(items, allItems, "id")
        );
      }
    } else {
      if (!props.item) {
        return;
      }
      if (!isChecked()) {
        if (props.maxItemCount && items.length == props.maxItemCount) {
          globalState.setNotificationMessage({
            body: props.maxItemCount + "以上選択できません",
            colorType: "danger",
          });
          return;
        }
        props.multipleCheckForm.add(props.item);
      } else {
        props.multipleCheckForm.remove(props.item);
      }
    }
  };

  const isChecked = (): boolean => {
    const items: T[] = props.multipleCheckForm.form.getValue("items") as T[];
    if (items instanceof Array) {
      if (props.allCheck && props.allItems) {
        const allLength = items.length;
        const allItems = getAllItems();
        const originalLength = lodash.differenceBy(
          items,
          allItems,
          "id"
        ).length;
        const diffLength = allLength - originalLength;
        return diffLength == allItems.length;
      } else if (props.item) {
        return items.map((i) => i.id).includes(props.item.id);
      } else {
        // あってはならない
        return false;
      }
    } else {
      return false;
    }
  };

  const checkedIndex = (): number => {
    const items: T[] = props.multipleCheckForm.form.getValue("items") as T[];
    return items.findIndex((i) => i.id === props.item?.id);
  };

  const isDisabled = () => {
    return (
      props.item?.id &&
      props.disableList &&
      props.disableList.includes(props.item!.id!)
    );
  };

  const getBackgroundColor = () => {
    if (isDisabled()) {
      return theme.gray2;
    } else if (isChecked() && !props.allCheck) {
      return theme.blue1;
    } else {
      return "";
    }
  };

  return (
    <Row
      className={props.className}
      color={props.allCheck ? "" : theme.blue1}
      onClick={() => {
        if (props.allCheck) {
          return;
        }
        if (isDisabled()) {
          return;
        }
        handleChangeForm();
      }}
      style={{ backgroundColor: getBackgroundColor() }}
      {...rest}
    >
      <TableCell width={50} align="center" th={props.head}>
        <div style={{ position: "relative" }}>
          {checkedIndex() >= 0 && (
            <Flex
              alignItems="center"
              justifyContent="center"
              style={{
                top: -15,
                left: -5,
                position: "absolute",
                borderRadius: 30,
                color: "white",
                width: 20,
                height: 20,
                backgroundColor: theme.red,
                fontSize: 11,
              }}
            >
              {checkedIndex() + 1}
            </Flex>
          )}
          <BSForm.Check
            type="checkbox"
            onChange={(e) => handleChangeForm(e)}
            checked={isChecked()}
          />
        </div>
      </TableCell>
      {props.children}
    </Row>
  );
};

export type ActionTableCellProps = TableCellProps & {
  onClick?: () => void;
  action?: "edit" | "delete" | "barcode" | "other";
  disabled?: boolean;
};

export const ActionTableCell = (props: ActionTableCellProps) => {
  const { onClick, action, ...rest } = props;
  return (
    <TableCell width={50} align="center" {...rest}>
      {!props.th && (
        <div>
          {action && (
            <Button
              size="sm"
              onClick={(e) => {
                if (props.onClick) {
                  props.onClick();
                }
                e.preventDefault();
                e.stopPropagation();
              }}
              style={{ textAlign: "center" }}
              variant={action === "delete" ? "danger" : "primary"}
              disabled={props.disabled}
            >
              {(() => {
                if (action === "edit") {
                  return <BiEditAlt size={14} />;
                } else if (action === "delete") {
                  return <BiTrashAlt size={14} />;
                } else if (action === "barcode") {
                  return <BiBarcodeReader size={14} />;
                }
              })()}
              {props.children}
            </Button>
          )}
        </div>
      )}
    </TableCell>
  );
};
export type RadioButtonTableRowProps<T> = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLTableRowElement>,
  HTMLTableRowElement
> & {
  itemId?: number | string;
  form: Form<T>;
  attr: Attribute<T>;
};

export const RadioButtonTableRow = <T extends unknown>(
  props: RadioButtonTableRowProps<T>
): JSX.Element => {
  const theme = useContext(ThemeContext);

  const handleChangeForm = (e?: React.ChangeEvent<HTMLInputElement>) => {
    props.form.updateObject(props.attr, props.itemId);
  };

  const isChecked = (): boolean => {
    const id = props.form.getValue(props.attr);
    return id === props.itemId;
  };

  return (
    <Row
      color={theme.blue1}
      onClick={() => {
        handleChangeForm();
      }}
      style={isChecked() ? { backgroundColor: theme.blue1 } : {}}
    >
      <TableCell width={60} align="center">
        <BSForm.Check
          type="radio"
          onChange={(e) => handleChangeForm(e)}
          checked={isChecked()}
        />
      </TableCell>
      {props.children}
    </Row>
  );
};

type LinkedTableCellProps = {
  count?: number;
  link: string;
  unit?: string;
};

export const LinkedTableCell = (props: LinkedTableCellProps) => {
  return (
    <TableCell align="center">
      {props.count ? (
        <Link to={props.link}>{`${props.count} ${props.unit}`}</Link>
      ) : (
        "-"
      )}
    </TableCell>
  );
};

type FixedFooterProps = {
  children: ReactNode;
  open: boolean;
};

export const FixedFooter = (props: FixedFooterProps) => {
  return (
    <div
      style={{
        width: "100%",
        position: "fixed",
        left: 0,
      }}
    >
      <div
        style={{
          padding: "20px",
          height: "80px",
          width: "100%",
          display: `${props.open ? "block" : "none"}`,
        }}
      />
      <div
        className="shadow-dark"
        style={{
          width: "100%",
          backgroundColor: "white",
          borderTop: "1px solid #E7E7E7",
          padding: "20px",
          position: "fixed",
          left: "240px",
          bottom: props.open ? 0 : -90,
          height: "80px",
          transition: "all 0.3s ease 0s",
          zIndex: 1000,
        }}
      >
        <Flex alignItems="center">{props.children}</Flex>
      </div>
    </div>
  );
};

type SelectionFixedFooterProps<T> = {
  ids: Array<string | number>;
  tableName?: string;
  searchForm?: Form<T>;
  searchAttr?: keyof T;
  children?: ReactNode;
  hideFilterButton?: boolean;
  onClickReset?: () => void;
};

export const SelectionFixedFooter = <T extends Record<string, unknown>>(
  props: SelectionFixedFooterProps<T>
): JSX.Element => {
  const theme = useContext(ThemeContext);
  const handleClickSearchSelectIds = () => {
    if (!props.searchForm || !props.searchAttr) {
      return;
    }
    props.searchForm.updateObject(props.searchAttr, props.ids.join(","));
  };

  return (
    <FixedFooter open={props.ids.length > 0}>
      {props.children && (
        <>
          {props.children}
          <div
            style={{
              width: 1,
              height: 40,
              margin: "0 15px",
              backgroundColor: theme.gray5,
            }}
          ></div>
        </>
      )}
      {!props.hideFilterButton && (
        <>
          <Button variant="secondary" onClick={handleClickSearchSelectIds}>
            選択中のみ表示
          </Button>
          <div
            style={{
              width: 1,
              height: 40,
              margin: "0 15px",
              backgroundColor: theme.gray5,
            }}
          ></div>
        </>
      )}
      <div>
        <span style={{ fontSize: 20 }}>{props.ids.length}</span>件 選択中
      </div>
      <Button variant="outline-secondary" onClick={props.onClickReset}>
        選択を解除
      </Button>
    </FixedFooter>
  );
};

export const CopyTableButton = (): JSX.Element => {
  const globalState = useContext(GlobalStateContext);
  return (
    <Button
      variant="secondary"
      onClick={() => {
        copyToClipboard("ex-table");
        globalState.setNotificationMessage({
          colorType: "success",
          body: "クリップボードに表をコピーしました",
        });
      }}
    >
      表をコピー
    </Button>
  );
};

type StepperProps = {
  titles: string[];
  currentPosition: number;
  style?: CSSProperties;
  titleStyle?: CSSProperties;
  circleSize?: number;
  color?: string;
  titleColor?: string;
};

export const Stepper = (props: StepperProps): JSX.Element => {
  const theme = useContext(ThemeContext);
  return (
    <Flex
      justifyContent="space-around"
      alignItems="center"
      style={{ marginBottom: "25px", ...props.style }}
    >
      {props.titles.map((title, index) => {
        const isActive = props.currentPosition >= index;
        const isBorderActive = props.currentPosition > index;
        return (
          <>
            <Flex
              flexDirection="column"
              alignItems="center"
              style={{
                margin: "0 20px",
                position: "relative",
                overflow: "visible",
              }}
            >
              <Flex
                alignItems="center"
                justifyContent="center"
                style={{
                  width: props.circleSize || 30,
                  height: props.circleSize || 30,
                  borderRadius: props.circleSize || 30,
                  backgroundColor: isActive
                    ? props.color || theme.blue4
                    : theme.gray1,
                  color: isActive ? "white" : "black",
                  fontSize: 13,
                  marginBottom: 0,
                }}
              >
                {index + 1}
              </Flex>
              <div
                style={{
                  position: "absolute",
                  width: 200,
                  textAlign: "center",
                  bottom: -25,
                  fontSize: 13,
                  color: props.titleColor || theme.gray3,
                  ...props.titleStyle,
                }}
              >
                {title}
              </div>
            </Flex>
            {index !== props.titles.length - 1 && (
              <div
                style={{
                  height: 2,
                  width: "100%",
                  backgroundColor: isBorderActive
                    ? props.color || theme.blue4
                    : theme.gray1,
                }}
              ></div>
            )}
          </>
        );
      })}
    </Flex>
  );
};

type TableWrapperProps = {
  children: ReactNode;
  showFooter?: boolean;
  contentHeaderCount?: number;
};
export const TableWrapper = (props: TableWrapperProps) => {
  const HEADER_HEIGHT = 0;
  const CONTENT_MARGIN_TOP = 31;
  const CONTENT_HEADER_HEIGHT = 40;
  const CONTENT_BODY_MARGIN = 40;
  const FOOTER_HEIGHT = 80;

  const calcRequiredHeight = () => {
    const headerHeight =
      CONTENT_HEADER_HEIGHT *
      (props.contentHeaderCount ? props.contentHeaderCount : 1);
    return (
      HEADER_HEIGHT +
      CONTENT_MARGIN_TOP +
      headerHeight +
      CONTENT_BODY_MARGIN +
      (props.showFooter ? FOOTER_HEIGHT : 0)
    );
  };
  return (
    <div style={{ height: `calc(100vh - ${calcRequiredHeight()}px)` }}>
      {props.children}
    </div>
  );
};

type PropertyViewProps = {
  label: string;
  value: any;
};

export const PropertyView = (props: PropertyViewProps) => {
  return (
    <Flex style={{ padding: 5, width: "auto" }}>
      <div style={{ width: 160, fontWeight: "bold" }}>{props.label}</div>
      <div>: </div>
      <div style={{ minWidth: 80 }}>{props.value || "--"}</div>
    </Flex>
  );
};

export const PropertyTextView = (props: PropertyViewProps) => {
  return (
    <div style={{ padding: 5, width: "auto", height: "100%" }}>
      <div style={{ fontWeight: "bold" }}>{props.label}:</div>
      <div style={{}}>{props.value || "--"}</div>
    </div>
  );
};

export type CircleButtonProps = ButtonProps & {
  children: ReactNode;
};

export const CircleButton = (props: CircleButtonProps) => {
  return (
    <Button
      {...props}
      style={{
        borderRadius: 30,
        width: 25,
        height: 25,
        lineHeight: 0,
        padding: 0,
      }}
    >
      {props.children}
    </Button>
  );
};

export type ProgressProps = {
  total: number;
  amount: number;
  unit?: string;
};

export const Progress = (props: ProgressProps) => {
  return (
    <Flex alignItems="center">
      <ProgressBar
        striped
        variant="success"
        now={Math.round(props.amount / props.total)}
      />
      <div style={{ fontSize: 14 }}>
        <span style={{ fontSize: 18 }}>{props.amount}</span>
        {props.unit} / <span style={{ fontSize: 18 }}>{props.total}</span>
        {props.unit}
      </div>
    </Flex>
  );
};

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
      {props.show && <Backdrop />}
      <Modal {...props} style={{ margin: 0, zIndex: 1080, ...props.style }}>
        {props.children}
      </Modal>
    </>
  );
};

type BarcodeProps = {
  value: string;
  width?: number;
  height?: number;
  fontSize?: number;
};

export const Barcode = (props: BarcodeProps) => {
  const { inputRef } = useBarcode({
    value: props.value,
    options: {
      background: "#ffffff",
      width: props.width,
      height: props.height,
      fontSize: props.fontSize,
    },
  });
  return <svg ref={inputRef} />;
};

const MatrixCellItem = styled.td`
  &:hover {
    background-color: #2292;
  }
`;
