import React, {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  ReactNode,
  SyntheticEvent,
  ElementType,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { Form, useEffectSkipFirst, useForm } from "utils/hooks";
import { ApiError } from "utils/network/api_hooks";
import {
  CloseButton,
  Collapse,
  Form as BSForm,
  FormControl,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
//for locale ja
import ja from "date-fns/locale/ja";
// import moment from 'moment'
import { CSSProperties } from "styled-components";
registerLocale("ja", ja);
import lodash from "lodash";
import { Flex } from "./flex";
import { zenkaku2Hankaku } from "utils/util";
import TimePicker, { TimePickerProps } from "rc-time-picker";
import { FaQuestionCircle } from "react-icons/fa";
import { MdHeight } from "react-icons/md";
import { FormRangeProps } from "react-bootstrap/esm/FormRange";
import moment from "moment";

export type Attribute<T> = keyof T | Array<string | number>;

function setError<T>(
  apiError: ApiError | undefined,
  attr: Attribute<T>,
  setErrorMessage: Dispatch<SetStateAction<string | null>>,
  index?: number
) {
  if (!apiError) {
    return;
  }
  let message: any;
  if (attr instanceof Array) {
    const lastIndex: number = attr.length - 1;
    const lastAttr: string = attr[lastIndex] as string;
    let messageObj;
    if (index) {
      messageObj = apiError[index];
    } else {
      message = apiError[lastAttr];
    }
    if (messageObj) {
      message = messageObj[lastAttr];
      if (message instanceof Array) {
        message = message[0];
      }
    }
  } else {
    message = apiError[attr as string] as string;
  }
  if (!message) {
    setErrorMessage(null);
    return null;
  }

  setErrorMessage(message);
}

export type BaseFieldProps<T> = {
  label?: string;
  attr: Attribute<T>;
  form: Form<T>;
  apiError?: ApiError;
  width?: number;
  onPressEnter?: () => void;
  required?: boolean;
  index?: number;
  style?: CSSProperties;
  disabled?: boolean;
  tabIndex?: number;
  onChange?: (e?: React.ChangeEvent<HTMLInputElement>) => void;
  isValid?: boolean;
  isInvalid?: boolean;
  hint?: string | ReactNode;
};

type InputFieldProps<T> = BaseFieldProps<T> & {
  type?: string;
  placeholder?: string;
  as?: ElementType<any>;
  autoConvertToCSV?: boolean;
  min?: number;
  max?: number;
  step?: number;
  onlyHankaku?: boolean;
};

export const InputField = <T extends unknown>(
  props: InputFieldProps<T>
): JSX.Element => {
  const {
    label,
    attr,
    form,
    apiError,
    onPressEnter,
    autoConvertToCSV,
    required,
    onChange,
    onlyHankaku,
    hint,
    ...rest
  } = props;
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const handleChangeForm = (
    e: React.ChangeEvent<typeof FormControl & HTMLInputElement>
  ) => {
    if (props.type === "file" && e.target.files) {
      const file = e.target.files[0];
      form.updateObject(attr, file);
    } else {
      let value: string | number = e.target.value;
      if (value && autoConvertToCSV) {
        value = value.replaceAll(" ", ",");
      }

      if (props.type === "number") {
        if (value.match(/^-?\d+$/)) {
          value = parseInt(value);
        } else if (value.match(/^-?\d+\.?\d*$/)) {
          value = parseFloat(value);
        }
      }

      if (typeof value === "string" && onlyHankaku) {
        value = zenkaku2Hankaku(value as string);
      }

      form.updateObject(
        attr,
        (typeof value === "string" && value !== "") || typeof value === "number"
          ? value
          : null
      );
    }
  };

  const handlePressEnter = (
    e: React.KeyboardEvent<typeof FormControl & HTMLInputElement>
  ) => {
    if (e.which == 13 && onPressEnter) {
      onPressEnter();
    }
  };

  useEffect(() => {
    setError(apiError, attr, setErrorMessage, props.index);
  }, [apiError]);

  return (
    <BSForm.Group style={{ width: "100%" }}>
      <Flex alignItems="center">
        {label && (
          <BSForm.Label className={required ? "required" : ""}>
            {label}
          </BSForm.Label>
        )}
        {label && hint && (
          <OverlayTrigger
            trigger="hover"
            placement="right"
            rootClose
            overlay={
              <Popover id="popover-hint" style={{ zIndex: 10000 }}>
                <Popover.Body>{hint}</Popover.Body>
              </Popover>
            }
          >
            <div style={{ marginBottom: 8, cursor: "pointer" }}>
              <FaQuestionCircle />
            </div>
          </OverlayTrigger>
        )}
      </Flex>
      <div className="position-relative">
        <BSForm.Control
          isInvalid={!!errorMessage}
          style={{ height: props.as === "textarea" ? 150 : "auto" }}
          {...rest}
          required
          onChange={handleChangeForm}
          onKeyPress={handlePressEnter}
          value={
            typeof form.getValue(attr) === "number" ||
            typeof form.getValue(attr) === "string"
              ? (form.getValue(attr) as string | number)
              : ""
          }
        />
        <BSForm.Control.Feedback
          style={props.as === "textarea" ? { top: "auto", bottom: -20 } : {}}
          type="invalid" /** tooltip */
        >
          {errorMessage}
        </BSForm.Control.Feedback>
      </div>
    </BSForm.Group>
  );
};

export type SelectItem = {
  label: string | ReactNode;
  value: string | number;
};

type SelectFieldProps<T> = Omit<BaseFieldProps<T>, "onPressEnter"> & {
  selectItems: SelectItem[];
  includeBlank?: boolean;
  disabled?: boolean;
  labelRightComponent?: ReactNode;
  blankLabel?: string;
  className?: string;
};

export const SelectField = <T extends unknown>(
  props: SelectFieldProps<T>
): JSX.Element => {
  const { label, attr, form, apiError, required, onChange, hint, ...rest } =
    props;
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const handleChangeForm = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (typeof props.selectItems[0].value === "number") {
      form.updateObject(attr, parseFloat(e.target.value));
    } else {
      form.updateObject(attr, e.target.value || null);
    }
    if (onChange) {
      onChange();
    }
  };

  useEffect(() => {
    setError(apiError, attr, setErrorMessage, props.index);
  }, [apiError]);

  return (
    <BSForm.Group style={{ width: "100%" }}>
      {label && (
        <Flex alignItems="center">
          <BSForm.Label className={required ? "required" : ""}>
            {label}
          </BSForm.Label>
          {label && hint && (
            <OverlayTrigger
              trigger="hover"
              placement="right"
              rootClose
              overlay={
                <Popover id="popover-hint" style={{ zIndex: 10000 }}>
                  <Popover.Body>{hint}</Popover.Body>
                </Popover>
              }
            >
              <div style={{ marginBottom: 8, cursor: "pointer" }}>
                <FaQuestionCircle />
              </div>
            </OverlayTrigger>
          )}
          {props.labelRightComponent}
        </Flex>
      )}
      <div className="position-relative">
        <BSForm.Select
          className="form-control"
          isInvalid={!!errorMessage}
          {...rest}
          required
          onChange={handleChangeForm}
          value={(form.getValue(attr) as string | number) || ""}
        >
          {props.includeBlank && (
            <option value={""}>{props.blankLabel || "未選択"}</option>
          )}
          {props.selectItems?.map((item: SelectItem) => {
            return (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            );
          })}
        </BSForm.Select>
        <BSForm.Control.Feedback type="invalid" /** tooltip */>
          {errorMessage}
        </BSForm.Control.Feedback>
      </div>
    </BSForm.Group>
  );
};

type ChoiceFieldProps<T> = Omit<SelectFieldProps<T>, "selectItems"> & {
  tableName: string;
  parentColumn?: Attribute<T>;
  hideAddChoice?: boolean;
};

type DateFieldProps<T> = BaseFieldProps<T> & {
  placeholder?: string;
  disabled?: boolean;
  showYearDropdown?: boolean;
  maxDate?: Date;
  minDate?: Date;
  defaultDate?: Date;
  hideResetButton?: boolean;
};

export const DateField = <T extends unknown>(
  props: DateFieldProps<T>
): JSX.Element => {
  const {
    label,
    attr,
    form,
    apiError,
    required,
    onChange,
    hideResetButton,
    hint,
    ...rest
  } = props;
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const handleChangeForm = (date: Date | [Date | null, Date | null] | null) => {
    if (date) {
      const d = moment(date.toString());
      form.updateObject(attr, d.format("YYYY-MM-DD"));
    }
  };

  useEffect(() => {
    setError(apiError, attr, setErrorMessage, props.index);
  }, [apiError]);

  useEffect(() => {
    handleChangeForm(props.defaultDate ?? null); // props.defaultDateがundefinedなら、nullを返す
  }, []);

  return (
    <BSForm.Group style={{ width: "100%" }}>
      <Flex alignItems="center">
        {label && (
          <BSForm.Label className={required ? "required" : ""}>
            {label}
          </BSForm.Label>
        )}
        {label && hint && (
          <OverlayTrigger
            trigger="hover"
            placement="right"
            rootClose
            overlay={
              <Popover id="popover-hint" style={{ zIndex: 10000 }}>
                <Popover.Body>{hint}</Popover.Body>
              </Popover>
            }
          >
            <div style={{ marginBottom: 8, cursor: "pointer" }}>
              <FaQuestionCircle />
            </div>
          </OverlayTrigger>
        )}
      </Flex>
      <div className="position-relative">
        <DatePicker
          {...rest}
          className={`form-control ${errorMessage ? "is-invalid" : ""}`}
          value={form.getValue(attr) as string}
          onChange={handleChangeForm}
          disabled={props.disabled}
          showYearDropdown={props.showYearDropdown}
          scrollableYearDropdown={props.showYearDropdown}
          yearDropdownItemNumber={100}
          locale="ja"
          maxDate={props.maxDate}
          minDate={props.minDate}
        />
        {!props.disabled && !props.hideResetButton && form.getValue(attr) && (
          <div
            style={{
              position: "absolute",
              right: errorMessage ? 30 : 10,
              top: 12,
              fontSize: 10,
            }}
          >
            <CloseButton
              onClick={() => {
                if (!props.disabled) {
                  form.updateObject(attr, null);
                }
              }}
            />
          </div>
        )}
        {errorMessage && (
          <div
            style={{
              position: "absolute",
              bottom: "-5px",
              color: "#dc3545",
              fontSize: "0.875rem",
            }}
          >
            {errorMessage}
          </div>
        )}
      </div>
    </BSForm.Group>
  );
};

export type TimePickerFieldProps<T> = TimePickerProps & BaseFieldProps<T>;

type MultipleSelectFieldProps<T> = BaseFieldProps<T> & {
  id: number | string;
  selectItems: SelectItem[];
  csv?: boolean;
  horizontal?: boolean;
  hideSearch?: boolean;
  hideSelectAll?: boolean;
};

export const MultipleSelectField = <T extends unknown>(
  props: MultipleSelectFieldProps<T>
): JSX.Element => {
  const { label, attr, form, apiError, required, onChange, hint, ...rest } =
    props;
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const [searchValue, setSearchValue] = useState("");
  const getArrayValue = () => {
    const array = form.getValue(attr);
    if (array instanceof Array) {
      return array;
    } else if (typeof array === "string") {
      return array.split(",");
    } else {
      return [];
    }
  };
  const [values, setValues] = useState<Array<unknown>>(getArrayValue());

  useEffectSkipFirst(() => {
    if (!props.form.getValue(props.attr)) {
      setValues([]);
    }
  }, [props.form.object]);

  const handleChangeForm = (
    e: React.ChangeEvent<HTMLInputElement>,
    value: string | number
  ) => {
    const tmpValues = [...values];
    if (tmpValues.includes(value)) {
      tmpValues.splice(values.indexOf(value), 1);
    } else {
      tmpValues.push(value);
    }
    if (tmpValues.length == 0) {
      form.update((f) => delete f[attr as keyof T]);
    } else {
      form.updateObject(attr, props.csv ? tmpValues.join(",") : tmpValues);
    }
    setValues(tmpValues);
  };

  const handleClickCheckAll = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const allValues = props.selectItems.map((item) => item.value);
    if (e.target.checked) {
      form.updateObject(attr, props.csv ? allValues.join(",") : allValues);
      setValues(allValues);
    } else {
      form.update((f) => delete f[attr as keyof T]);
      setValues([]);
    }
  };

  const isCheckAll = (): boolean => {
    return values.length == props.selectItems.length;
  };

  useEffect(() => {
    setError(apiError, attr, setErrorMessage, props.index);
  }, [apiError]);

  const isChecked = (item: SelectItem): boolean => {
    return values.includes(item.value);
  };
  return (
    <BSForm.Group>
      <Flex alignItems="center">
        {label && (
          <BSForm.Label className={required ? "required" : ""}>
            {label}
          </BSForm.Label>
        )}
        {label && hint && (
          <OverlayTrigger
            trigger="hover"
            placement="right"
            rootClose
            overlay={
              <Popover id="popover-hint" style={{ zIndex: 10000 }}>
                <Popover.Body>{hint}</Popover.Body>
              </Popover>
            }
          >
            <div style={{ marginBottom: 8, cursor: "pointer" }}>
              <FaQuestionCircle />
            </div>
          </OverlayTrigger>
        )}
      </Flex>
      {!props.hideSearch && (
        <BSForm.Control
          placeholder="検索"
          onChange={(e) => setSearchValue(e.target.value)}
          value={searchValue}
        />
      )}
      {!props.hideSelectAll && (
        <BSForm.Group controlId={`check-all-${String(attr)}`}>
          <BSForm.Check
            style={{ userSelect: "none" }}
            type="checkbox"
            label={isCheckAll() ? "選択を解除" : "すべて選択"}
            onChange={(e) => handleClickCheckAll(e)}
            checked={isCheckAll()}
          />
        </BSForm.Group>
      )}
      <Flex
        flexDirection={props.horizontal ? "row" : "column"}
        className={props.horizontal ? "child-margin-r-10" : ""}
        flexWrap={"wrap"}
      >
        {props.selectItems
          .filter((item) => String(item.label).includes(searchValue))
          .map((item: SelectItem) => {
            return (
              <BSForm.Group
                key={`${props.id}_${item.value}_${String(attr)}`}
                controlId={`checkbox-${String(attr)}-${item.value}`}
                style={{ userSelect: "none" }}
              >
                <BSForm.Check
                  type="checkbox"
                  label={item.label}
                  style={{ userSelect: "none" }}
                  onChange={(e) => handleChangeForm(e, item.value)}
                  checked={isChecked(item)}
                />
              </BSForm.Group>
            );
          })}
      </Flex>
      <BSForm.Control.Feedback type="invalid" /** tooltip */>
        {errorMessage}
      </BSForm.Control.Feedback>
    </BSForm.Group>
  );
};

export type NestedSelectItem = {
  [key: string]: SelectItem[];
};

type NestedMultipleSelectFieldProps<T> = BaseFieldProps<T> & {
  id: number | string;
  nestedSelectItems: NestedSelectItem;
  csv?: boolean;
  defaultExpand?: boolean;
};

export const NestedMultipleSelectField = <T extends unknown>(
  props: NestedMultipleSelectFieldProps<T>
): JSX.Element => {
  const { label, attr, form, apiError, required, onChange, hint, ...rest } =
    props;
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const getArrayValue = () => {
    const array = form.getValue(attr);
    if (array instanceof Array) {
      return array as (number | string)[];
    } else if (typeof array === "string") {
      return array.split(",") as (number | string)[];
    } else {
      return [];
    }
  };
  const [values, setValues] = useState<Array<string | number>>(getArrayValue());

  const handleChangeGroupForm = (
    e: React.ChangeEvent<HTMLInputElement>,
    group: string | number
  ) => {
    const items = props.nestedSelectItems[group].map((i) => i.value);
    let tmpValues = [...values];
    if (e.target.checked) {
      tmpValues = [...tmpValues, ...items];
    } else {
      tmpValues = tmpValues.filter((i) => !items.includes(i));
    }

    if (tmpValues.length == 0) {
      form.update((f) => delete f[attr as keyof T]);
    } else {
      form.updateObject(attr, props.csv ? tmpValues.join(",") : tmpValues);
    }
    setValues(lodash.uniq(tmpValues));
  };

  const handleChangeForm = (
    e: React.ChangeEvent<HTMLInputElement>,
    value: string | number
  ) => {
    const tmpValues = [...values];
    if (tmpValues.includes(value)) {
      tmpValues.splice(values.indexOf(value), 1);
    } else {
      tmpValues.push(value);
    }
    if (tmpValues.length == 0) {
      form.update((f) => delete f[attr as keyof T]);
    } else {
      form.updateObject(attr, props.csv ? tmpValues.join(",") : tmpValues);
    }
    setValues(tmpValues);
  };

  useEffect(() => {
    setError(apiError, attr, setErrorMessage, props.index);
  }, [apiError]);

  const isChecked = (item: SelectItem): boolean => {
    return values.includes(item.value);
  };

  const isGroupChecked = (group: string): boolean => {
    return props.nestedSelectItems[group].every((item) =>
      values.includes(item.value)
    );
  };

  const expand = (group: string): boolean => {
    return props.defaultExpand
      ? true
      : props.nestedSelectItems[group].some((item) =>
          values.includes(item.value)
        );
  };
  return (
    <BSForm.Group>
      <Flex alignItems="center">
        {label && (
          <BSForm.Label className={required ? "required" : ""}>
            {label}
          </BSForm.Label>
        )}
        {label && hint && (
          <OverlayTrigger
            trigger="hover"
            placement="right"
            rootClose
            overlay={
              <Popover id="popover-hint" style={{ zIndex: 10000 }}>
                <Popover.Body>{hint}</Popover.Body>
              </Popover>
            }
          >
            <div style={{ marginBottom: 8, cursor: "pointer" }}>
              <FaQuestionCircle />
            </div>
          </OverlayTrigger>
        )}
      </Flex>
      {/* <DatePicker className="form-control" value={form.getValue(attr) as string} onChange={handleChangeForm} /> */}
      {Object.keys(props.nestedSelectItems).map((group: string) => {
        return (
          <>
            {props.defaultExpand ? (
              <div
                style={{ fontWeight: "bold", marginBottom: 5 }}
              >{`${group}(${props.nestedSelectItems[group].length}件)`}</div>
            ) : (
              <BSForm.Group
                key={`${props.id}_${group}_${String(attr)}`}
                controlId={`checkbox-${String(attr)}-${group}`}
                style={{ userSelect: "none" }}
              >
                <BSForm.Check
                  type="checkbox"
                  label={`${group}(${props.nestedSelectItems[group].length}件)`}
                  style={{ userSelect: "none" }}
                  onChange={(e) => handleChangeGroupForm(e, group)}
                  checked={isGroupChecked(group)}
                />
              </BSForm.Group>
            )}
            <Collapse in={expand(group)}>
              <div style={{ marginLeft: 15 }}>
                {props.nestedSelectItems[group].map((item: SelectItem) => {
                  return (
                    <BSForm.Group
                      key={`${props.id}_${item.value}_${String(attr)}`}
                      controlId={`checkbox-${String(attr)}-${item.value}`}
                      style={{ userSelect: "none" }}
                    >
                      <BSForm.Check
                        type="checkbox"
                        label={item.label}
                        style={{ userSelect: "none" }}
                        onChange={(e) => handleChangeForm(e, item.value)}
                        checked={isChecked(item)}
                      />
                    </BSForm.Group>
                  );
                })}
              </div>
            </Collapse>
          </>
        );
      })}
      <BSForm.Control.Feedback type="invalid" /** tooltip */>
        {errorMessage}
      </BSForm.Control.Feedback>
    </BSForm.Group>
  );
};

type CheckboxFieldProps<T> = BaseFieldProps<T> & {
  checkboxLabel?: string;
  removeFalse?: boolean;
  value?: string | number;
  required?: boolean;
  isNegative?: boolean;
  controlId?: string;
};

export const CheckboxField = <T extends unknown>(
  props: CheckboxFieldProps<T>
): JSX.Element => {
  const { label, attr, form, apiError, required, ...rest } = props;
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.removeFalse && !e.target.checked) {
      form.update((f) => delete f[attr as keyof T]);
      return;
    }
    if (props.value) {
      if (isChecked()) {
        form.updateObject(attr, undefined);
      } else {
        form.updateObject(attr, props.value);
      }
    } else {
      form.updateObject(attr, e.target.checked);
    }
    if (props.onChange) {
      props.onChange(e);
    }
  };

  useEffect(() => {
    setError(apiError, attr, setErrorMessage, props.index);
  }, [apiError]);

  const isChecked = (): boolean => {
    if (props.value) {
      return form.getValue(attr) === props.value;
    }
    if (form.getValue(attr) === undefined) {
      return false;
    }
    if (typeof form.getValue(attr) === "string") {
      const result: boolean = form.getValue(attr) === "true";
      return result;
    } else {
      return !!form.getValue(attr);
    }
  };
  return (
    <BSForm.Group style={props.style}>
      {label && (
        <BSForm.Label className={required ? "required" : ""}>
          {label}
        </BSForm.Label>
      )}
      <BSForm.Group
        controlId={
          `${props.controlId}-${String(attr)}` ?? `checkbox-${String(attr)}`
        }
      >
        <BSForm.Check
          type="checkbox"
          style={{ userSelect: "none" }}
          label={props.checkboxLabel || props.value || attr}
          onChange={(e) => handleChangeForm(e)}
          checked={isChecked()}
          disabled={props.disabled}
        />
      </BSForm.Group>
      <BSForm.Control.Feedback type="invalid" /** tooltip */>
        {errorMessage}
      </BSForm.Control.Feedback>
    </BSForm.Group>
  );
};

type BooleanRadioFieldProps<T> = BaseFieldProps<T> & {
  positiveLabel: string;
  negativeLabel: string;
};

export const BooleanRadioField = <T extends unknown>(
  props: BooleanRadioFieldProps<T>
): JSX.Element => {
  const { label, attr, form, apiError, required, ...rest } = props;
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  useEffect(() => {
    setError(apiError, attr, setErrorMessage, props.index);
  }, [apiError]);

  return (
    <BSForm.Group>
      {label && (
        <BSForm.Label className={required ? "required" : ""}>
          {label}
        </BSForm.Label>
      )}
      <Flex alignItems="center">
        <BSForm.Group controlId={`boolean-radio-positive-${String(attr)}`}>
          <BSForm.Check
            type="radio"
            style={{ userSelect: "none" }}
            label={props.positiveLabel}
            onChange={(e) => {
              form.updateObject(attr, true);
            }}
            checked={form.getValue(attr) === true}
          />
        </BSForm.Group>
        <BSForm.Group controlId={`boolean-radio-negative-${String(attr)}`}>
          <BSForm.Check
            type="radio"
            style={{ userSelect: "none" }}
            label={props.negativeLabel}
            onChange={(e) => {
              form.updateObject(attr, false);
            }}
            checked={form.getValue(attr) === false}
          />
        </BSForm.Group>
      </Flex>
      <BSForm.Control.Feedback type="invalid" /** tooltip */>
        {errorMessage}
      </BSForm.Control.Feedback>
    </BSForm.Group>
  );
};

type FileFieldProps<T> = BaseFieldProps<T>;

export const FileField = <T extends unknown>(
  props: FileFieldProps<T>
): JSX.Element => {
  const { label, attr, form, apiError, required, onChange, hint, ...rest } =
    props;

  const handleChangeForm = (
    e: React.ChangeEvent<typeof FormControl & HTMLInputElement>
  ) => {
    if (e.target.files) {
      const file = e.target.files[0];
      form.updateObject(attr, file);
    }
  };

  return (
    <BSForm.Group style={{ width: "100%" }} className="position-relative">
      <Flex alignItems="center">
        {label && (
          <BSForm.Label className={required ? "required" : ""}>
            {label}
          </BSForm.Label>
        )}
        {label && hint && (
          <OverlayTrigger
            trigger="hover"
            placement="right"
            rootClose
            overlay={
              <Popover id="popover-hint" style={{ zIndex: 10000 }}>
                <Popover.Body>{hint}</Popover.Body>
              </Popover>
            }
          >
            <div style={{ marginBottom: 8, cursor: "pointer" }}>
              <FaQuestionCircle />
            </div>
          </OverlayTrigger>
        )}
      </Flex>
      <BSForm.Control
        {...rest}
        required
        onChange={handleChangeForm}
        type="file"
      />
    </BSForm.Group>
  );
};

export type RangeFieldProps<T> = Omit<FormRangeProps, "form"> &
  BaseFieldProps<T> & {
    showValue?: boolean;
  };

export const RangeField = <T extends unknown>(
  props: RangeFieldProps<T>
): JSX.Element => {
  const {
    label,
    attr,
    form,
    apiError,
    required,
    onChange,
    hint,
    showValue,
    ...rest
  } = props;
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  useEffect(() => {
    setError(apiError, attr, setErrorMessage, props.index);
  }, [apiError]);

  return (
    <BSForm.Group style={{ width: "100%" }}>
      <Flex alignItems="center">
        {label && (
          <BSForm.Label className={required ? "required" : ""}>
            {label}
          </BSForm.Label>
        )}
        {label && hint && (
          <OverlayTrigger
            trigger="hover"
            placement="right"
            rootClose
            overlay={
              <Popover id="popover-hint" style={{ zIndex: 10000 }}>
                <Popover.Body>{hint}</Popover.Body>
              </Popover>
            }
          >
            <div style={{ marginBottom: 8, cursor: "pointer" }}>
              <FaQuestionCircle />
            </div>
          </OverlayTrigger>
        )}
        {label && showValue && <div>{form.getValue(attr)}</div>}
      </Flex>

      <div className="position-relative">
        <BSForm.Range
          {...rest}
          onChange={(e) => {
            if (e.target.value !== undefined && e.target.value !== null) {
              form.updateObject(attr, Number(e.target.value));
            } else {
              form.updateObject(attr, null);
            }
          }}
          value={form.getValue(attr) as number}
        />
        <BSForm.Control.Feedback type="invalid" /** tooltip */>
          {errorMessage}
        </BSForm.Control.Feedback>
      </div>
    </BSForm.Group>
  );
};
