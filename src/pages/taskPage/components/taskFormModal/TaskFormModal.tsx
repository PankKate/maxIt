import { Button, Form, Input, Modal, Select } from "antd";
import FormItem from "antd/es/form/FormItem";
import CheckableTagGroup from "antd/es/tag/CheckableTagGroup";
import { PRIORITY, TAGS } from "../../../../api/const";
import type { NewTaskValues } from "../../../../api/interfaces";
import { startTransition } from "react";

interface ITaskForm {
  isLoad: boolean;
  onOk: (payload: NewTaskValues) => void;
  onCancel: () => void;
}

export const TaskFormModal = ({ isLoad, onOk, onCancel }: ITaskForm) => {
  const priorityOptions = PRIORITY.map((el) => ({ value: el, label: el }));
  const [form] = Form.useForm<NewTaskValues>();

  return (
    <Modal
      open={true}
      title="Создание новой задачи"
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        onFinish={(values) => startTransition(() => onOk(values))}
      >
        <FormItem name={"title"}>
          <Input required placeholder="Типо название задачи" />
        </FormItem>
        <FormItem name={"priority"} label={"Уровень горящей жопы"}>
          <Select options={priorityOptions} />
        </FormItem>
        <FormItem name={"tags"}>
          <CheckableTagGroup options={TAGS} multiple />
        </FormItem>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit" disabled={isLoad}>
            Добавить
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
