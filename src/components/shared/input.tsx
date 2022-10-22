import {
  Checkbox,
  Col,
  DatePicker,
  DatePickerProps,
  Form,
  FormItemProps,
  Input,
  InputNumber,
  InputProps,
  InputRef,
  Radio,
  RadioChangeEvent,
  Row,
  Select,
  Skeleton,
  Switch,
} from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { RangePickerProps } from "antd/lib/date-picker";
import { RangeValue } from "rc-picker/lib/interface";
import { Rule } from "antd/lib/form";
import { Option } from "antd/lib/mentions";
import { OptionProps } from "antd/lib/select";
import { LiteralUnion } from "antd/lib/_util/type";
import moment, { Moment } from "moment";
import React, { ReactNode, useRef } from "react";
import useMedia from "use-media";
import { Form as MyForm, FormAttrType, useEffectSkipFirst } from "utils/hooks";
import TextArea, { TextAreaProps } from "antd/lib/input/TextArea";

// import { Form as MyForm, FormAttrType, useEffectSkipFirst } from "../../utils";

export type ValidationResult = {
  message: string;
  status: "error" | "warning";
};

export type InputFieldProps<T> = {
  form: MyForm<T>;
  attr: FormAttrType<T>;
  label?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  placeholder?: string;
  onChange?: (e: any) => void;
  itemProps?: FormItemProps<any>;
  fieldProps?: InputProps & React.RefAttributes<InputRef>;
  required?: boolean;
  type?: LiteralUnion<
    | "button"
    | "checkbox"
    | "color"
    | "date"
    | "datetime-local"
    | "email"
    | "file"
    | "hidden"
    | "image"
    | "month"
    | "number"
    | "password"
    | "radio"
    | "range"
    | "reset"
    | "search"
    | "submit"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week",
    string
  >;
  min?: number;
  max?: number;
  addonBefore?: React.ReactNode;
  addonAfter?: React.ReactNode;
  validationResultForm?: MyForm<any>;
  onlyHankaku?: boolean;
  validation?: (e: React.ChangeEvent<HTMLInputElement>) => boolean;
  children?: ReactNode;
};

export const InputField = <T extends any>(props: InputFieldProps<T>) => {
  const value = props.form.getValue(props.attr);
  const ref = useRef<InputRef>(null);

  useEffectSkipFirst(() => {
    const element = ref.current;
    if (!element || !element.input) {
      return;
    }
    const formValue = props.form.getValue(props.attr);
    if (element.input.value !== formValue) {
      element.input.value = (formValue ?? "") as string;
    }
  }, [props.form.getValue(props.attr)]);

  const rules = [] as Rule[];
  if (props.required !== undefined)
    rules.push({
      required: props.required,
      message: `${props.label}は必須項目です。`,
    });
  return (
    <>
      <Form.Item
        label={
          props.label && (
            <div style={{ display: "flex" }}>
              <div>{props.required && <RequiredSign />}</div>
              <div>{props.label}</div>
            </div>
          )
        }
        rules={rules}
        validateStatus={
          (props.validationResultForm?.getValue(props.attr) as ValidationResult)
            ?.status
        }
        help={
          (props.validationResultForm?.getValue(props.attr) as ValidationResult)
            ?.message
        }
        {...props.itemProps}
      >
        {(() => {
          return (
            <Input
              style={props.style}
              ref={ref}
              disabled={!!props.disabled}
              value={
                (value ?? "") as
                  | string
                  | ReadonlyArray<string>
                  | number
                  | undefined
              }
              defaultValue={
                props.form.getValue(props.attr) as
                  | string
                  | ReadonlyArray<string>
                  | number
                  | undefined
              }
              placeholder={props.placeholder}
              onChange={(e) => {
                if (typeof e.target.value === "string" && props.onlyHankaku) {
                  if (!e.target.value.match(/^[a-zA-Z0-9!-/:-@¥[-`{-~]*$/))
                    return;
                }
                let value: number | string = e.target.value;
                if (props.type === "number") {
                  if (String(e.target.value).match(/^-?\d+$/)) {
                    value = parseInt(e.target.value);
                  } else if (String(e.target.value).match(/^-?\d+\.?\d*$/)) {
                    value = parseFloat(e.target.value);
                  }
                  if (props.min !== undefined && props.min > value) {
                    return;
                  }
                  if (props.max !== undefined && props.max < value) {
                    return;
                  }
                }
                if (props.validation && !props.validation(e)) {
                  return;
                }
                props.form.updateObject(props.attr, value);

                if (props.onChange) {
                  props.onChange(e);
                }
              }}
              type={props.type}
              addonAfter={props.addonAfter}
              addonBefore={props.addonBefore}
              {...props.fieldProps}
            />
          );
        })()}
        {props.children}
      </Form.Item>
    </>
  );
};

export type TextAreaFieldProps<T> = {
  form: MyForm<T>;
  attr: FormAttrType<T>;
  label?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  onChange?: (e: any) => void;
  itemProps?: FormItemProps<any>;
  fieldProps?: TextAreaProps;
  required?: boolean;
  validationResultForm?: MyForm<any>;
  validation?: (e: React.ChangeEvent<HTMLInputElement>) => boolean;
  children?: ReactNode;
};

export const TextAreaField = <T extends any>(props: TextAreaFieldProps<T>) => {
  const value = props.form.getValue(props.attr);
  const ref = useRef<InputRef>(null);

  useEffectSkipFirst(() => {
    const element = ref.current;
    if (!element || !element.input) {
      return;
    }
    const formValue = props.form.getValue(props.attr);
    if (element.input.value !== formValue) {
      element.input.value = (formValue ?? "") as string;
    }
  }, [props.form.getValue(props.attr)]);

  const rules = [] as Rule[];
  if (props.required !== undefined)
    rules.push({
      required: props.required,
      message: `${props.label}は必須項目です。`,
    });
  return (
    <>
      <Form.Item
        label={
          props.label && (
            <div style={{ display: "flex" }}>
              <div>{props.required && <RequiredSign />}</div>
              <div>{props.label}</div>
            </div>
          )
        }
        rules={rules}
        validateStatus={
          (props.validationResultForm?.getValue(props.attr) as ValidationResult)
            ?.status
        }
        help={
          (props.validationResultForm?.getValue(props.attr) as ValidationResult)
            ?.message
        }
        {...props.itemProps}
      >
        {(() => {
          return (
            <TextArea
              style={props.style}
              ref={ref}
              disabled={!!props.disabled}
              value={
                (value ?? "") as
                  | string
                  | ReadonlyArray<string>
                  | number
                  | undefined
              }
              defaultValue={
                props.form.getValue(props.attr) as
                  | string
                  | ReadonlyArray<string>
                  | number
                  | undefined
              }
              onChange={(e) => {
                props.form.updateObject(props.attr, e.target.value);
                if (props.onChange) {
                  props.onChange(e);
                }
              }}
              {...props.fieldProps}
            />
          );
        })()}
        {props.children}
      </Form.Item>
    </>
  );
};

export type SelectItem = {
  label: string;
  value: any;
};

type SelectFieldProps<T> = {
  selectItems: SelectItem[];
  form: MyForm<T>;
  attr: FormAttrType<T>;
  mode?: "multiple" | "tags" | "multipleSelect";
  label?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (e: any) => void;
  itemProps?: FormItemProps<any>;
  fieldProps?: OptionProps;
  required?: boolean;
  validationResultForm?: MyForm<any>;
  includeBlank?: boolean;
};

export const SelectField = <T extends any>(props: SelectFieldProps<T>) => {
  return (
    <>
      <Form.Item
        style={{ width: "100%" }}
        label={
          props.label && (
            <div style={{ display: "flex", overflow: "wrap" }}>
              {props.required && <RequiredSign />}
              {props.label}
            </div>
          )
        }
        validateStatus={
          (props.validationResultForm?.getValue(props.attr) as ValidationResult)
            ?.status
        }
        help={
          (props.validationResultForm?.getValue(props.attr) as ValidationResult)
            ?.message
        }
        {...props.itemProps}
      >
        <Select
          {...props.fieldProps}
          style={props.style}
          placeholder={props.placeholder}
          disabled={props.disabled}
          onChange={(e) => {
            if (props.onChange) {
              props.onChange(e);
            } else {
              // 一般的な処理
              props.form.updateObject(props.attr, e);
            }
          }}
          mode={props.mode === "multipleSelect" ? "multiple" : props.mode}
          value={
            props.mode === "multipleSelect"
              ? props.selectItems.find(
                  (item) => item.value === props.form.getValue(props.attr)
                )?.label ??
                (props.includeBlank && ("未選択" as string))
              : props.form.getValue(props.attr)
          }
          virtual={false}
        >
          {props.includeBlank && (
            <Option key={`select-field-blank-option`} value={undefined}>
              未選択
            </Option>
          )}
          {props.selectItems.map((item, i) => (
            <Option key={`${i}`} value={item.value}>
              {item.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );
};

type DateFieldProps<T> = {
  form: MyForm<T>;
  attr: FormAttrType<T>;
  mode?: "multiple" | "tags";
  label?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (e: any) => void;
  itemProps?: FormItemProps<any>;
  fieldProps?: DatePickerProps;
  required?: boolean;
  validationResultForm?: MyForm<any>;
  includeBlank?: boolean;
};

export const DateField = <T extends any>(props: DateFieldProps<T>) => {
  return (
    <Form.Item
      label={
        props.label && (
          <div style={{ display: "flex", overflow: "wrap" }}>
            {props.required && <RequiredSign />}
            {props.label}
          </div>
        )
      }
      validateStatus={
        (props.validationResultForm?.getValue(props.attr) as ValidationResult)
          ?.status
      }
      help={
        (props.validationResultForm?.getValue(props.attr) as ValidationResult)
          ?.message
      }
      {...props.itemProps}
    >
      {/* @ts-ignore */}
      <DatePicker
        style={{ width: "100%" }}
        onChange={(value: Moment | null, dataStirng: string) => {
          if (props.onChange) {
            props.onChange(dataStirng);
          } else {
            // 一般的な処理
            props.form.updateObject(props.attr, dataStirng);
          }
        }}
        {...props.fieldProps}
      />
    </Form.Item>
  );
};

type RangeFieldProps<T> = {
  form: MyForm<T>;
  attr: FormAttrType<T>;
  mode?: "multiple" | "tags";
  label?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (e: any) => void;
  itemProps?: FormItemProps<any>;
  fieldProps?: RangePickerProps;
  required?: boolean;
  validationResultForm?: MyForm<any>;
  includeBlank?: boolean;
};

const { RangePicker } = DatePicker;
export const RangeField = <T extends any>(props: RangeFieldProps<T>) => {
  return (
    <Form.Item
      label={
        props.label && (
          <div style={{ display: "flex", overflow: "wrap" }}>
            {props.required && <RequiredSign />}
            {props.label}
          </div>
        )
      }
      validateStatus={
        (props.validationResultForm?.getValue(props.attr) as ValidationResult)
          ?.status
      }
      help={
        (props.validationResultForm?.getValue(props.attr) as ValidationResult)
          ?.message
      }
      {...props.itemProps}
    >
      {/* @ts-ignore */}
      <RangePicker
        ranges={{
          Today: [moment(), moment()],
          "This Month": [moment().startOf("month"), moment().endOf("month")],
        }}
        style={{ width: "100%" }}
        onChange={(
          values: RangeValue<Moment> | null,
          formatStirng: [string, string]
        ) => {
          if (props.onChange) {
            props.onChange(formatStirng);
          } else {
            // 一般的な処理
            console.log(formatStirng);
            props.form.updateObject(props.attr, formatStirng);
          }
        }}
        {...props.fieldProps}
      />
    </Form.Item>
  );
};

type CheckboxFieldProps<T> = {
  form: MyForm<T>;
  attr: FormAttrType<T>;
  label?: ReactNode;
  style?: React.CSSProperties;
  disabled?: boolean;
  onChange?: (e: CheckboxChangeEvent) => void;
  itemProps?: FormItemProps<any>;
  fieldProps?: OptionProps;
  required?: boolean;
  validationResultForm?: MyForm<any>;
  colSpan?: number;
  children?: ReactNode;
};

export const CheckboxField = <T extends any>(props: CheckboxFieldProps<T>) => {
  const isMobile = useMedia({ maxWidth: "575px" });
  return (
    <>
      <Form.Item
        label={
          props.label && (
            <div style={{ display: "flex" }}>
              <div>{props.required && <RequiredSign />}</div>
              <div>{props.label}</div>
            </div>
          )
        }
        validateStatus={
          (props.validationResultForm?.getValue(props.attr) as ValidationResult)
            ?.status
        }
        help={
          (props.validationResultForm?.getValue(props.attr) as ValidationResult)
            ?.message
        }
        style={{ marginBottom: 0 }}
        {...props.itemProps}
      >
        <Checkbox
          {...props.fieldProps}
          style={props.style}
          disabled={props.disabled}
          checked={props.form.getValue(props.attr) as boolean}
          onChange={(e: CheckboxChangeEvent) => {
            if (props.onChange) {
              props.onChange(e);
            } else {
              // 一般的な処理
              props.form.updateObject(props.attr, e.target.checked);
            }
          }}
        >
          {props.children}
        </Checkbox>
      </Form.Item>
    </>
  );
};

type CheckboxGroupFieldProps<T> = {
  selectItems?: SelectItem[];
  form: MyForm<T>;
  attr: FormAttrType<T>;
  label?: ReactNode;
  style?: React.CSSProperties;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (e: CheckboxValueType[]) => void;
  itemProps?: FormItemProps<any>;
  fieldProps?: OptionProps;
  required?: boolean;
  validationResultForm?: MyForm<any>;
  colSpan?: number;
  children?: ReactNode;
};

export const CheckboxGroupField = <T extends any>(
  props: CheckboxGroupFieldProps<T>
) => {
  const isMobile = useMedia({ maxWidth: "575px" });
  return (
    <>
      <Form.Item
        label={
          props.label && (
            <div style={{ display: "flex" }}>
              <div>{props.required && <RequiredSign />}</div>
              <div>{props.label}</div>
            </div>
          )
        }
        validateStatus={
          (props.validationResultForm?.getValue(props.attr) as ValidationResult)
            ?.status
        }
        help={
          (props.validationResultForm?.getValue(props.attr) as ValidationResult)
            ?.message
        }
        style={{ marginBottom: 0 }}
        {...props.itemProps}
      >
        <Checkbox.Group
          {...props.fieldProps}
          style={props.style}
          disabled={props.disabled}
          onChange={(e: CheckboxValueType[]) => {
            if (props.onChange) {
              props.onChange(e);
            } else {
              props.form.updateObject(props.attr, e);
            }
          }}
          value={props.form.getValue(props.attr) as string[]}
        >
          <Row>
            {props.selectItems?.map((item, i) => (
              <Col
                key="col"
                span={props.colSpan ? props.colSpan : isMobile ? 24 : 12}
              >
                <Checkbox
                  style={{ lineHeight: "32px" }}
                  key={`${item.value}-${i}`}
                  value={item.value}
                >
                  <div>{item.label}</div>
                </Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
        {props.children && props.children}
      </Form.Item>
    </>
  );
};

type SelectRadioFieldProps<T> = {
  selectItems: SelectItem[];
  form: MyForm<T>;
  attr: FormAttrType<T>;
  label?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (e: RadioChangeEvent) => void;
  itemProps?: FormItemProps<any>;
  fieldProps?: OptionProps;
  required?: boolean;
  validationResultForm?: MyForm<any>;
  children?: ReactNode;
};

export const SelectRadioField = <T extends any>(
  props: SelectRadioFieldProps<T>
) => {
  return (
    <>
      <Form.Item
        style={{ marginBottom: 0 }}
        label={
          props.label && (
            <div style={{ display: "flex" }}>
              {props.required && <RequiredSign />}
              {props.label}
            </div>
          )
        }
        validateStatus={
          (props.validationResultForm?.getValue(props.attr) as ValidationResult)
            ?.status
        }
        help={
          (props.validationResultForm?.getValue(props.attr) as ValidationResult)
            ?.message
        }
        {...props.itemProps}
      >
        <Radio.Group
          {...props.fieldProps}
          style={props.style}
          disabled={props.disabled}
          onChange={(e: RadioChangeEvent) => {
            if (props.onChange) {
              props.onChange(e);
            } else {
              // 一般的な処理
              props.form.updateObject(props.attr, e.target.value);
            }
          }}
          value={props.form.getValue(props.attr)}
        >
          {props.selectItems.map((item, i) => (
            <Radio key={`${i}`} value={item.value}>
              {item.label}
            </Radio>
          ))}
        </Radio.Group>
        {props.children}
      </Form.Item>
    </>
  );
};

type BooleanSwitchFieldProps<T> = {
  form: MyForm<T>;
  attr: FormAttrType<T>;
  label?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (e: boolean) => void;
  itemProps?: FormItemProps<any>;
  fieldProps?: OptionProps;
  checkedLable?: string;
  unCheckedLable?: string;
  required?: boolean;
  validationResultForm?: MyForm<any>;
};

export const BooleanSwitchField = <T extends any>(
  props: BooleanSwitchFieldProps<T>
) => {
  return (
    <Form.Item
      name="form.object.isMenstruation"
      style={{ marginBottom: 0 }}
      label={
        props.label && (
          <div style={{ display: "flex" }}>
            {props.required && <RequiredSign />}
            {props.label}
          </div>
        )
      }
      validateStatus={
        (props.validationResultForm?.getValue(props.attr) as ValidationResult)
          ?.status
      }
      help={
        (props.validationResultForm?.getValue(props.attr) as ValidationResult)
          ?.message
      }
      {...props.itemProps}
    >
      <Switch
        style={props.style}
        checkedChildren={props.checkedLable}
        unCheckedChildren={props.unCheckedLable}
        checked={props.form.getValue(props.attr) as boolean}
        onChange={(e) => {
          if (props.onChange) {
            props.onChange(e);
          } else {
            // 一般的な処理
            props.form.updateObject(props.attr, e);
          }
        }}
        {...props.fieldProps}
      />
    </Form.Item>
  );
};

const RequiredSign = () => {
  return (
    <div
      style={{
        display: "inline-block",
        marginRight: "4px",
        marginTop: "4px",
        color: "#ff4d4f",
        fontSize: "14px",
        lineHeight: 1,
        fontFamily: "SimSun, sans-serif",
      }}
    >
      *
    </div>
  );
};
