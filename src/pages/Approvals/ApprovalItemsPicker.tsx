import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import styled from "styled-components";

import { ApprovalItemType, PartialApprovalItem } from "apiClient/approvals";
import { GearItemSelect } from "components/GearItemSelect";
import { GearTypeSelect } from "components/GearTypeSelect";
import { makeLabeledInput } from "components/Inputs/LabeledInput";
import { Select } from "components/Select";

import { FormValues } from "./types";

const LabeledInput = makeLabeledInput<FormValues>();

export function ApprovalItemsPicker() {
  const formObject = useFormContext<FormValues>();
  const {
    fields: itemFields,
    append,
    remove,
  } = useFieldArray({
    control: formObject.control,
    name: "items",
  });
  const items = formObject.watch("items");
  return (
    <fieldset>
      Items approved:
      {itemFields.map((field, index) => {
        return (
          <StyledItem key={field.id} className="p-2 mb-3 mt-3">
            <div className="d-flex justify-content-between mb-3">
              <strong>Item #{index + 1}</strong>
              {items.length > 1 && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => remove(index)}
                  style={{
                    borderColor: "#ced4da",
                  }}
                >
                  <FontAwesomeIcon icon={faClose} />
                </button>
              )}
            </div>
            <Controller
              control={formObject.control}
              name={`items.${index}.type`}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => {
                return (
                  <ApprovalTypePicker
                    value={value}
                    onChange={(v) => {
                      formObject.resetField(`items.${index}`);
                      onChange(v);
                    }}
                    onBlur={onBlur}
                  />
                );
              }}
            />
            {items[index].type === ApprovalItemType.gearType ? (
              <>
                <LabeledInput
                  title="Type:"
                  name={`items.${index}.item.gearType` as const}
                  renderComponent={({ value, onChange, invalid }) => {
                    return (
                      <GearTypeSelect
                        filterOptions={({ restricted }) => !!restricted}
                        value={value ?? null}
                        onChange={(val) => onChange(val?.id)}
                        invalid={invalid}
                      />
                    );
                  }}
                  options={{
                    required: true,
                  }}
                />
                <LabeledInput
                  title="Quantity approved"
                  type="number"
                  name={`items.${index}.item.quantity`}
                  step={1}
                  options={{
                    valueAsNumber: true,
                  }}
                />
              </>
            ) : (
              <LabeledInput
                title="Item:"
                name={`items.${index}.item.gearItem` as const}
                renderComponent={({ value, onChange, invalid }) => {
                  return (
                    <GearItemSelect
                      value={value ?? null}
                      onChange={(val) => onChange(val?.id)}
                      invalid={invalid}
                    />
                  );
                }}
                options={{
                  required: true,
                }}
              />
            )}
          </StyledItem>
        );
      })}
      <div className="mt-2 d-flex justify-content-end">
        <button
          className="btn btn-outline-primary"
          onClick={() => append(defaultItem)}
          type="button"
        >
          Approve another item
        </button>
      </div>
    </fieldset>
  );
}

export const defaultItem: PartialApprovalItem = {
  type: ApprovalItemType.gearType,
  item: {
    quantity: 1,
    gearType: undefined,
  },
};

const approvalTypeOptions = [
  {
    value: ApprovalItemType.gearType,
    label: "Approve gear by type",
  },
  {
    value: ApprovalItemType.specificItem,
    label: "Approve a specific item",
  },
];

function ApprovalTypePicker({
  onChange,
  value,
  onBlur,
}: {
  onChange: (value: ApprovalItemType | undefined) => void;
  onBlur?: () => void;
  value: ApprovalItemType;
}) {
  const selectedOption = approvalTypeOptions.find((o) => o.value === value);
  return (
    <Select
      onChange={(newType) => onChange(newType?.value)}
      value={selectedOption}
      options={approvalTypeOptions}
      onBlur={onBlur}
    />
  );
}

const StyledItem = styled.div`
  margin-left: 30px;
  border: solid 1px #ced4da;
  border-radius: 0.375rem;
  background-color: #f8f8f8;
`;
