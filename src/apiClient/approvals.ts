import { toIsoDate } from "lib/fmtDate";
import { request } from "./client";
import { GearTypeWithShorthand } from "./gear";
import { PersonBase } from "./people";

export type Approval = {
  id: number;
  startDate: string;
  endDate: string;
  note: string;
  approvedBy: PersonBase;
  renter: PersonBase;
  items: ApprovalItem[];
};

export type PersonApproval = Omit<Approval, "renter">;

interface GearItem {
  id: string;
  type: GearTypeWithShorthand;
}

export enum ApprovalItemType {
  gearType = "gearType",
  specificItem = "specificItem",
}

type GenericGearTypeApproval<T> = {
  type: ApprovalItemType.gearType;
  item: {
    quantity: number;
    gearType: T;
  };
};

type GenericSpecificItemApproval<T> = {
  type: ApprovalItemType.specificItem;
  item: {
    gearItem: T;
  };
};

export type ApprovalItem =
  | GenericGearTypeApproval<GearTypeWithShorthand>
  | GenericSpecificItemApproval<GearItem>;

export type PartialApprovalItem =
  | GenericGearTypeApproval<number | undefined>
  | GenericSpecificItemApproval<string | undefined>;

export type ApprovalItemToCreate =
  | GenericGearTypeApproval<number>
  | GenericSpecificItemApproval<string>;

export type CreateNewApprovalArgs = {
  startDate: Date;
  endDate: Date;
  note?: string;
  renter: string;
  items: ApprovalItemToCreate[];
};

export async function createNewApproval(approval: CreateNewApprovalArgs) {
  const { renter, startDate, endDate, items, note } = approval;
  const body = {
    note,
    endDate: toIsoDate(endDate),
    startDate: toIsoDate(startDate),
    items: items.map((item) => ({
      type: item.type,
      item:
        item.type === ApprovalItemType.gearType
          ? { ...item.item, gearType: item.item.gearType }
          : { ...item.item, gearItem: item.item.gearItem },
    })),
  };
  return request(`/people/${renter}/approvals/`, "POST", body);
}

export async function deleteApproval(approvalID: number) {
  return request(`/approvals/${approvalID}/`, "DELETE");
}
