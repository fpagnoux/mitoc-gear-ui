import { request } from "./client";
import { PersonBase, PersonSummary } from "./people";
import { ListWrapper, Note } from "./types";

export interface GearSummary {
  id: string;
  available: boolean;
  broken: string;
  // TODO: This is weird, we shouldn't have the rentals in there
  checkedOutTo: PersonSummary | null;
  dailyFee: number;
  depositAmount: number;
  description?: string;
  missing: string;
  restricted: boolean;
  retired: string;
  size?: string;
  specification?: string;
  type: GearTypeWithFee;
  picture?: string;
  location: {
    id: number;
    shorthand: string;
  };
}

export interface GearItem extends GearSummary {
  notes: Note[];
}

export interface GearRental {
  person: PersonBase;
  checkedout: string;
  returned: string;
  weeksOut: number;
}

export interface PurchasableItem {
  id: string;
  price: number;
  name: string;
}

/** The minimal representation of a gear type*/
export interface GearTypeBase {
  id: number;
  typeName: string;
}

export interface GearTypeWithShorthand extends GearTypeBase {
  shorthand: string;
}

export interface GearTypeWithFee extends GearTypeBase {
  rentalAmount: number;
}

/** The representation of a gear type in the list endpoint*/
export interface GearType extends GearTypeWithShorthand {
  defaultDeposit: number;
  shouldInventory: boolean;
  restricted?: boolean;
}

export interface GearLocation {
  id: number;
  shorthand: string;
}

async function getGearRentalHistory(
  id: string,
  page?: number,
): Promise<ListWrapper<GearRental>> {
  return request(`/gear/${id}/rentals/`, "GET", { ...(page && { page }) });
}

async function addNote(id: string, note: string) {
  return request(`/gear/${id}/note/`, "POST", {
    note,
  });
}

async function markRetired(id: string, note?: string) {
  return request(`/gear/${id}/retired/`, "POST", {
    note,
  });
}
async function markBroken(id: string, note: string) {
  return request(`/gear/${id}/broken/`, "POST", {
    note,
  });
}
async function markMissing(id: string, note?: string) {
  return request(`/gear/${id}/missing/`, "POST", {
    note,
  });
}
async function markUnretired(id: string, note?: string) {
  return request(`/gear/${id}/retired/`, "DELETE", {
    note,
  });
}
async function markFixed(id: string, note?: string) {
  return request(`/gear/${id}/broken/`, "DELETE", {
    note,
  });
}
async function markFound(id: string, note?: string) {
  return request(`/gear/${id}/missing/`, "DELETE", {
    note,
  });
}

export type CreateGearArgs = {
  type: string;
  id?: string;
  quantity: number;
  size?: string;
  specification?: string;
  depositAmount?: number;
  description?: string;
  location?: string;
};

async function createGear(
  args: CreateGearArgs,
): Promise<{ items: GearSummary[] }> {
  return request(`/gear/`, "POST", args);
}

async function editGearItem(
  id: string,
  item: {
    specification?: string;
    description?: string;
    size?: string;
    depositAmount?: number;
    location?: number;
    picture?: string | null;
  },
) {
  return request(`/gear/${id}/`, "PATCH", item);
}

async function editGearType(
  id: number,
  gearType: Partial<Omit<GearType, "id" | "shorthand">>,
) {
  return request(`/gear-types/${id}/`, "PATCH", gearType);
}

export {
  addNote,
  createGear,
  editGearItem,
  editGearType,
  getGearRentalHistory,
  markBroken,
  markFixed,
  markFound,
  markMissing,
  markRetired,
  markUnretired,
};
