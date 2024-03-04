import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

import {
  ApprovalItemToCreate,
  ApprovalItemType,
  CreateNewApprovalArgs,
} from "apiClient/approvals";
import { Form } from "components/Inputs/Form";
import { makeLabeledInput } from "components/Inputs/LabeledInput";
import { PersonSelect } from "components/PersonSelect";

import { ApprovalItemsPicker, defaultItem } from "./ApprovalItemsPicker";
import { FormValues } from "./types";
import { nextTuesday } from "lib/fmtDate";

type Props = {
  onSubmit: (args: CreateNewApprovalArgs) => void;
};

const LabeledInput = makeLabeledInput<FormValues>();

export function AddNewApprovalForm({ onSubmit }: Props) {
  const history = useHistory();
  const formObject = useForm<FormValues>({
    defaultValues: getDefaultValues(),
  });

  const handleSubmit = (values: FormValues) => {
    const validatedValues = validateApproval(values);
    onSubmit(validatedValues);
  };
  const startDate = formObject.watch("startDate");
  return (
    <Form onSubmit={handleSubmit} form={formObject}>
      <LabeledInput
        title="Renter:"
        name="renter"
        renderComponent={({ value, onChange, invalid }) => {
          return (
            <PersonSelect
              value={value}
              onChange={(person) => onChange(person?.id)}
              invalid={invalid}
            />
          );
        }}
        options={{
          required: true,
        }}
      />
      <LabeledInput
        title="Start Date:"
        name="startDate"
        renderComponent={({ value, onChange, onBlur, invalid }) => {
          return (
            <DatePicker
              selected={value}
              onChange={(val) => onChange(val ?? undefined)}
              className={`form-control ${invalid ? "is-invalid" : ""}`}
              wrapperClassName={invalid ? "is-invalid" : ""}
              onBlur={onBlur}
            />
          );
        }}
        options={{
          required: true,
        }}
      />
      <LabeledInput
        title="End Date:"
        name="endDate"
        renderComponent={({ value, onChange, onBlur, invalid }) => {
          return (
            <DatePicker
              selected={value}
              onChange={(val) => onChange(val ?? undefined)}
              className={`form-control ${invalid ? "is-invalid" : ""}`}
              wrapperClassName={invalid ? "is-invalid" : ""}
              onBlur={onBlur}
            />
          );
        }}
        options={{
          required: true,
          validate: (value) => {
            if (startDate != null && value != null && value < startDate) {
              return "The approval end date cannot be before the start date.";
            }
          },
        }}
      />
      <ApprovalItemsPicker />

      <LabeledInput title="Note:" as="textarea" name="note" />

      <div className="d-flex justify-content-between mb-3">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={history.goBack}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </div>
    </Form>
  );
}

function validateApproval(approval: FormValues): CreateNewApprovalArgs {
  const { startDate, endDate, renter, items, note } = approval;
  if (
    startDate != null &&
    endDate != null &&
    renter != null &&
    items.every((item) => {
      if (item.type === ApprovalItemType.gearType) {
        return item.item.gearType != null;
      }
      return item.item.gearItem != null;
    })
  ) {
    return {
      startDate,
      endDate,
      renter,
      items: items as ApprovalItemToCreate[],
      note,
    };
  }
  // This case should not happen, the validation should handle it
  throw Error("Missing required fields");
}

function getDefaultValues() {
  const startDate = new Date();
  return {
    items: [defaultItem],
    startDate,
    endDate: nextTuesday(startDate),
  };
}
