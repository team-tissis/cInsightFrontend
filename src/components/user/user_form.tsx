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
import { User } from "entities/user";
import moment, { Moment } from "moment";
import { Form, useForm } from "utils/hooks";

const FormView = (form: Form<User>): JSX.Element => {
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 24 },
  };
  return (
    <AntdForm {...layout}>
      <InputField label="ニックネーム" form={form} attr="nickName" />
      <InputField label="メールアドレス" form={form} attr="email" />
    </AntdForm>
  );
};

export type EditUserFormProps = ModalProps & {
  form: Form<User>;
};

export const EditUserForm = (props: EditUserFormProps) => {
  const { form, ...rest } = props;
  return (
    <Modal title="勉強会の編集" {...rest}>
      {FormView(form)}
    </Modal>
  );
};
