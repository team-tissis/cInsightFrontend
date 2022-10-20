import {
  DatePickerProps,
  Form as AntdForm,
  Modal,
  ModalProps,
  Space,
} from "antd";
import { RangePickerProps } from "antd/lib/date-picker";
import TextArea from "antd/lib/input/TextArea";
import {
  DateField,
  InputField,
  RangeField,
  SelectField,
  TextAreaField,
} from "components/shared/input";
import { Lecture } from "entities/lecture";
import moment, { Moment } from "moment";
import { Form, useForm } from "utils/hooks";

const FormView = (form: Form<Lecture>): JSX.Element => {
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 24 },
  };
  console.log(form.object);
  return (
    <AntdForm {...layout}>
      <InputField label="勉強会の名前" form={form} attr="name" />
      <DateField
        label="作成日時"
        form={form}
        attr="createdAt"
        fieldProps={{
          disabled: true,
          value: moment(),
          showTime: true,
        }}
      />
      <RangeField
        label="日付"
        form={form}
        attr="date"
        fieldProps={
          {
            showTime: {
              minuteStep: 15,
              secondStep: 60,
              format: "HH時mm分",
            },
            format: "YYYY/MM/DD HH:mm",
            disabledDate: (current) => {
              const customDate = moment().format("YYYY-MM-DD");
              return current && current < moment(customDate, "YYYY-MM-DD");
            },
          } as RangePickerProps
        }
      />
      <SelectField
        label="タグ"
        form={form}
        attr="tags"
        selectItems={[]}
        mode="tags"
        onChange={(e) => form.updateObject("tags", e)}
        includeBlank={false}
      />
      <TextAreaField label="説明" form={form} attr="description" />
      <InputField form={form} label="資料URL" attr="materialUrl" />
      <InputField form={form} label="録画URL" attr="movieUrl" />
    </AntdForm>
  );
};

export type NewLectureFormProps = ModalProps & {
  form: Form<Lecture>;
};

export const NewLectureForm = (props: NewLectureFormProps) => {
  const { form, ...rest } = props;
  return (
    <Modal title="勉強会の新規作成" {...rest}>
      {FormView(form)}
    </Modal>
  );
};
