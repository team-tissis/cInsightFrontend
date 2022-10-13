import { useState } from "react";
import {
  Accordion,
  Badge,
  Button,
  CloseButton,
  Form as BSForm,
  Offcanvas,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import { Form, useEffectSkipFirst, useForm } from "utils/hooks";
import { Flex } from "./flex";
import {
  BooleanRadioField,
  CheckboxField,
  DateField,
  InputField,
  MultipleSelectField,
  NestedMultipleSelectField,
  NestedSelectItem,
  SelectField,
  SelectItem,
} from "./input";

import { useContext } from "react";
import { ThemeContext } from "contexts/theme_context";

type SearchConditionViewProps<T> = {
  searchForm: Form<T>;
  onClickRemoveButton: (key: keyof T) => void;
  hiddenSearchParams?: string[];
};
export const SearchConditionView = <T extends Record<string, unknown>>(
  props: SearchConditionViewProps<T>
): JSX.Element => {
  const theme = useContext(ThemeContext);
  const isArray = (value: unknown): boolean => {
    if (typeof value === "string") {
      return value.split(",").length > 1;
    }
    return false;
  };

  const filteredSearchForm = () => {
    return Object.keys(props.searchForm.object).filter((key) => {
      if (key === "page" || key === "perPage") {
        return false;
      } else if (props.hiddenSearchParams) {
        return !props.hiddenSearchParams.includes(key);
      } else {
        return true;
      }
    });
  };

  return (
    <>
      {Object.keys(props.searchForm.object).length > 0 && (
        <Flex alignItems="center">
          {filteredSearchForm().map((key: string, index: number) => {
            if (index > 1) {
              return;
            }
            const value = props.searchForm.object[key as keyof T];
            return (
              <Badge
                key={key}
                bg="secondary"
                style={{ marginBottom: 5, color: "#333" }}
              >
                {`${key}: "${
                  isArray(value)
                    ? `${(value as string).split(",").length}個選択中`
                    : value
                }"`}
                <CloseButton
                  style={{ height: 9, marginLeft: 5 }}
                  variant="white"
                  onClick={() => props.onClickRemoveButton(key as keyof T)}
                />
              </Badge>
            );
          })}
          {filteredSearchForm().length > 2 && (
            <OverlayTrigger
              trigger="click"
              placement="bottom"
              rootClose
              overlay={
                <Popover id="popover-filtered-condition">
                  <Popover.Body>
                    <Flex flexWrap="wrap">
                      {filteredSearchForm().map(
                        (key: string, index: number) => {
                          if (index < 2) {
                            return;
                          }
                          const value = props.searchForm.object[key as keyof T];
                          return (
                            <Badge
                              key={key}
                              bg="secondary"
                              style={{ marginBottom: 5, color: "black" }}
                            >
                              {`${key}: "${
                                isArray(value)
                                  ? `${
                                      (value as string).split(",").length
                                    }個選択中`
                                  : value
                              }"`}
                              <CloseButton
                                style={{ height: 9, marginLeft: 5 }}
                                variant="white"
                                onClick={() =>
                                  props.onClickRemoveButton(key as keyof T)
                                }
                              />
                            </Badge>
                          );
                        }
                      )}
                    </Flex>
                  </Popover.Body>
                </Popover>
              }
            >
              <div
                style={{ fontSize: 13, color: theme.blue4, cursor: "pointer" }}
              >
                More...
              </div>
            </OverlayTrigger>
          )}
        </Flex>
      )}
    </>
  );
};

export type ChoiceType = {
  tableName: string;
  column: string;
};

export type SearchType = {
  name: string;
  type:
    | "text"
    | "number"
    | "date"
    | "select"
    | "multiple_select"
    | "boolean"
    | "multiple_text"
    | "nested_multiple_select"
    | "multiple_choice";
  selectItems?: SelectItem[];
  nestedSelectItems?: NestedSelectItem;
  defaultExpand?: boolean;
  choiceInfo?: ChoiceType;
};

export type SearchParams = {
  [key: string]: SearchType[];
};

export const SearchField = <T extends Record<string, unknown>>(
  selectType: SearchType,
  originalForm: Form<T>
): JSX.Element => {
  const searchForm = useForm<T>({ ...originalForm.object });

  useEffectSkipFirst(() => {
    searchForm.set(originalForm.object);
  }, [originalForm.object]);

  const getField = (onPressEnter: () => void) => {
    switch (selectType.type) {
      case "text":
        return (
          <InputField
            key={`${selectType}Text`}
            onPressEnter={onPressEnter}
            label="テキスト（部分一致）"
            attr={selectType.name as keyof T}
            form={searchForm}
          />
        );
      case "multiple_text":
        return (
          <InputField
            onPressEnter={onPressEnter}
            key={`${selectType}Text`}
            label="テキスト（完全一致&Excel貼付可)"
            attr={selectType.name as keyof T}
            form={searchForm}
            autoConvertToCSV
          />
        );
      case "number":
        return (
          <Flex>
            <InputField
              key={`${selectType.name}Min`}
              label="最小値(≦)"
              attr={`${selectType.name}Min` as keyof T}
              form={searchForm}
              type="number"
            />
            <InputField
              key={`${selectType.name}Max`}
              label="最大値(≧)"
              attr={`${selectType.name}Max` as keyof T}
              form={searchForm}
              type="number"
            />
          </Flex>
        );
      case "date":
        return (
          <Flex>
            <DateField
              key={`${selectType.name}After`}
              label="開始日"
              attr={`${selectType.name}After` as keyof T}
              form={searchForm}
            />
            <DateField
              key={`${selectType.name}Before`}
              label="終了日"
              attr={`${selectType.name}Before` as keyof T}
              form={searchForm}
            />
          </Flex>
        );
      case "select":
        if (selectType.selectItems) {
          return (
            <SelectField
              key={`${selectType.name}Select`}
              label="選択肢"
              attr={`${selectType.name}` as keyof T}
              form={searchForm}
              selectItems={selectType.selectItems}
              includeBlank
            />
          );
        } else {
          return <div>エラー</div>;
        }
      case "multiple_select":
        if (selectType.selectItems) {
          return (
            <MultipleSelectField
              key={`${selectType.name}MultipleSelect`}
              csv
              id={`${selectType.name}MultipleSelect`}
              label="複数選択"
              attr={`${selectType.name}` as keyof T}
              form={searchForm}
              selectItems={selectType.selectItems}
            />
          );
        } else {
          return <div>エラー</div>;
        }
      case "nested_multiple_select":
        if (selectType.nestedSelectItems) {
          return (
            <NestedMultipleSelectField
              key={`${selectType.name}MultipleSelect`}
              csv
              id={`${selectType.name}MultipleSelect`}
              label="複数選択"
              attr={`${selectType.name}` as keyof T}
              form={searchForm}
              nestedSelectItems={selectType.nestedSelectItems}
              defaultExpand={selectType.defaultExpand}
            />
          );
        } else {
          return <div>エラー</div>;
        }
      case "boolean":
        return (
          <BooleanRadioField
            positiveLabel={selectType.name}
            negativeLabel={`not ${selectType.name}`}
            label="真偽値"
            attr={selectType.name as keyof T}
            form={searchForm}
          />
        );
    }
  };

  const handleSubmit = () => {
    window.document.getElementById("root")?.click();
    originalForm.set(searchForm.object);
  };

  if (!selectType) {
    return <></>;
  }

  return (
    <>
      <div
        style={{
          marginTop: 10,
          overflowY: selectType.type == "date" ? "visible" : "scroll",
          maxHeight: selectType.type == "date" ? "auto" : 300,
        }}
      >
        {getField(handleSubmit)}
      </div>
      <Flex justifyContent="flex-end" style={{ marginTop: 10 }}>
        <Button onClick={handleSubmit}>検索</Button>
      </Flex>
    </>
  );
};

type Props<T> = {
  searchForm: Form<T>;
  preSearchForm: Form<T>;
  onAddParams: () => void;
  onRemoveParams: (key: keyof T) => void;
  searchParams: SearchParams;
};

export const SearchDrawer = <T extends Record<string, unknown>>(
  props: Props<T>
): JSX.Element => {
  const [show, setShow] = useState(false);
  const [selectAttrs, setSelectAttrs] = useState<{ [key: string]: SearchType }>(
    {}
  );

  return (
    <>
      <Button onClick={() => setShow(true)} style={{ minWidth: 80 }}>
        検索
      </Button>

      <Offcanvas show={show} onHide={() => setShow(false)}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>検索条件の設定</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div style={{ marginBottom: 30 }}>
            <SearchConditionView
              searchForm={props.searchForm}
              onClickRemoveButton={props.onRemoveParams}
            />
          </div>
          {Object.keys(props.searchParams).map(
            (key: string, tableIndex: number) => {
              return (
                <div key={`search-model-${tableIndex}`}>
                  <Accordion>
                    <Accordion.Item eventKey={`${tableIndex}`}>
                      <Accordion.Header>{key}の情報で絞り込み</Accordion.Header>
                      <Accordion.Body>
                        <BSForm.Select
                          defaultValue={selectAttrs[key]?.name}
                          style={{ marginBottom: 30 }}
                          onChange={(
                            e: React.ChangeEvent<HTMLSelectElement>
                          ) => {
                            const item = props.searchParams[key].find(
                              (item) => item.name == e.target.value
                            );
                            if (e.target.value && item) {
                              const tmpAttrs = { ...selectAttrs };
                              tmpAttrs[key] = {
                                name: item.name,
                                type: item.type,
                                selectItems: item?.selectItems,
                              };
                              setSelectAttrs(tmpAttrs);
                            } else {
                              const tmpAttrs = { ...selectAttrs };
                              delete tmpAttrs[key];
                              setSelectAttrs(tmpAttrs);
                            }
                          }}
                        >
                          <option key={key}>
                            対象カラムを選択してください
                          </option>
                          {props.searchParams[key].map((item) => {
                            return (
                              <option
                                key={`${item.name}-${item.type}`}
                                value={`${item.name}`}
                              >
                                {item.name}
                              </option>
                            );
                          })}
                        </BSForm.Select>
                        {selectAttrs[key] &&
                          SearchField(selectAttrs[key], props.preSearchForm)}
                        {selectAttrs[key] && (
                          <Button
                            style={{ marginTop: 10, width: "100%" }}
                            onClick={() => props.onAddParams()}
                          >
                            条件追加
                          </Button>
                        )}
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
              );
            }
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};
