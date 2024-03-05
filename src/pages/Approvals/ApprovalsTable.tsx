import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo } from "react";

import { Approval, ApprovalItem, deleteApproval } from "apiClient/approvals";
import { PersonBase } from "apiClient/people";
import { DataGrid } from "components/DataGrid";
import { GearLink } from "components/GearLink";
import { PersonLink } from "components/PersonLink";
import { formatDate } from "lib/fmtDate";

export function ApprovalsTable({
  approvals,
  onDelete,
}: {
  approvals: Approval[];
  onDelete: () => void;
}) {
  const LocalDeleteCell = useMemo(() => {
    const component = ({ item }: { item: Approval }) => (
      <DeleteCell item={item} onDelete={onDelete} />
    );
    component.displayName = "LocalDeleteCell";
    return component;
  }, [onDelete]);
  const columns = [
    { key: "deskWorker", header: "Renter", renderer: RenterCell, width: 0.8 },
    {
      key: "items",
      header: "Gear approved",
      renderer: ItemsCell,
      width: 1.4,
    },
    {
      key: "startDate",
      header: "Start Date",
      renderer: StartDateCell,
      width: 0.6,
    },
    { key: "endDate", header: "End Date", renderer: EndDateCell, width: 0.6 },
    {
      key: "approvedBy",
      header: "Approved By",
      renderer: ApproverCell,
      width: 0.8,
    },
    { key: "note", header: "Note", width: 1.25 },
    { key: "delete", header: "Delete", width: 0.6, renderer: LocalDeleteCell },
  ];

  return (
    <div className="mb-5">
      <DataGrid columns={columns} data={approvals} />
    </div>
  );
}

function StartDateCell({ item: approval }: { item: Approval }) {
  return <span>{formatDate(approval.startDate)}</span>;
}
function EndDateCell({ item: approval }: { item: Approval }) {
  return <span>{formatDate(approval.endDate)}</span>;
}

function ItemsCell({ item: approval }: { item: Approval }) {
  return <ApprovalsList items={approval.items} />;
}

export function ApprovalsList({ items }: { items: ApprovalItem[] }) {
  return (
    <ul>
      {items.map(({ type, item }) => {
        if (type === "gearType") {
          return (
            <li key={item.gearType.id}>
              {item.gearType.typeName} ({item.gearType.shorthand}) -
              {item.quantity} {item.quantity > 1 ? "items" : "item"}
            </li>
          );
        }
        return (
          <li key={item.gearItem.id}>
            {item.gearItem.type.typeName} -{" "}
            <GearLink id={item.gearItem.id}>{item.gearItem.id}</GearLink>{" "}
          </li>
        );
      })}
    </ul>
  );
}

function RenterCell({ item: approval }: { item: Approval }) {
  return <PersonCell value={approval.renter} />;
}

function ApproverCell({ item: approval }: { item: Approval }) {
  return <PersonCell value={approval.approvedBy} />;
}

function PersonCell({ value }: { value: PersonBase }) {
  return (
    <PersonLink id={String(value.id)}>
      {value.firstName} {value.lastName}
    </PersonLink>
  );
}

function DeleteCell({
  item: approval,
  onDelete,
}: {
  item: Approval;
  onDelete: () => void;
}) {
  return (
    <div className="d-flex justify-content-center w-100">
      <button
        className="btn btn-outline-secondary"
        onClick={() => {
          const isConfirmed = window.confirm(
            "Are you sure you want to delete the approval? This action cannot be undone.",
          );
          if (isConfirmed) {
            deleteApproval(approval.id).then(() => onDelete());
          }
        }}
      >
        <FontAwesomeIcon icon={faClose} />
      </button>
    </div>
  );
}
