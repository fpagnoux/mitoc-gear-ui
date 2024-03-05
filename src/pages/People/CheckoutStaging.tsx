import { isEmpty, map, sum } from "lodash";

import { ApprovalItemType, PersonApproval } from "apiClient/approvals";
import type { Person } from "apiClient/people";
import { RemoveButton } from "components/Buttons";
import { GearLink } from "components/GearLink";
import { fmtAmount } from "lib/fmtNumber";

import { usePersonPageContext } from "./PeoplePage/PersonPageContext";
import { GearSummary } from "apiClient/gear";

type Props = { onCheckout: () => void; approvals: PersonApproval[] };

export function CheckoutStaging({ onCheckout, approvals }: Props) {
  const { person, checkoutBasket } = usePersonPageContext();
  const gearToCheckout = checkoutBasket.items;
  const gearWithApprovals: (GearSummary & { approved?: boolean })[] =
    gearToCheckout.map((gear) => {
      if (!gear.restricted) {
        return gear;
      }
      const approved = approvals.some((approval) =>
        approval.items.some((item) => {
          return (
            (item.type === ApprovalItemType.gearType &&
              item.item.gearType.id === gear.type.id) ||
            (item.type === ApprovalItemType.specificItem &&
              item.item.gearItem.id === gear.id)
          );
        }),
      );
      return { ...gear, approved };
    });
  const totalDeposit = sum(map(gearToCheckout, "depositAmount"));

  const unapprovedGear = gearWithApprovals.filter(
    (gear) => gear.restricted && !gear.approved,
  );

  return (
    <div className="border rounded-2 p-2 mb-3 bg-light">
      <h3>Gear to check out</h3>
      <hr />
      {!isEmpty(unapprovedGear) && (
        <RestrictedGearWarning gear={unapprovedGear} />
      )}
      <h5>
        Deposit due:{" "}
        {hasFFCheck(person) ? (
          <>
            <strong style={{ color: "var(--bs-teal)" }}>{fmtAmount(0)}</strong>{" "}
            (Frequent Flyer)
          </>
        ) : (
          <strong className="text-warning">{fmtAmount(totalDeposit)}</strong>
        )}
      </h5>
      {gearWithApprovals && (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Gear</th>
                <th>
                  <span className="d-none d-md-inline">Deposit</span>
                  <span className="d-md-none">Dep.</span>
                </th>
                <th>
                  <span className="d-none d-md-inline">Daily fee</span>
                  <span className="d-md-none">Fee</span>
                </th>
                <th>
                  <span className="d-none d-md-inline">Remove</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {gearWithApprovals.map(
                ({
                  id,
                  type,
                  dailyFee,
                  depositAmount,
                  restricted,
                  approved,
                }) => (
                  <tr key={id}>
                    <td>
                      <GearLink id={id}>{id}</GearLink>
                      <br />
                      {type.typeName}
                      {restricted &&
                        (!approved ? (
                          <>
                            <br />
                            <strong className="text-warning">RESTRICTED</strong>
                          </>
                        ) : (
                          <>
                            <br />
                            <span>✅ Approved</span>
                          </>
                        ))}
                    </td>
                    <td>{fmtAmount(depositAmount)}</td>
                    <td>{fmtAmount(dailyFee)}</td>
                    <td className="text-end align-middle">
                      <RemoveButton onClick={() => checkoutBasket.remove(id)} />
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </>
      )}
      <div className="text-end">
        <button
          className="btn btn-primary btn-lg"
          onClick={() => checkoutBasket.submit().then(onCheckout)}
        >
          Check out
        </button>
      </div>
    </div>
  );
}

function hasFFCheck(person: Person) {
  const today = new Date().toISOString().split("T")[0];
  return (
    person.frequentFlyerCheck != null &&
    today <= person.frequentFlyerCheck.expires
  );
}

export function RestrictedGearWarning({ gear }: { gear: GearSummary[] }) {
  return (
    <div className="alert alert-warning p-2">
      <h4 className="text-center">
        <strong>Unapproved restricted gear</strong>
      </h4>
      Some items are <strong>restricted</strong>, and are not marked as approved
      in the database.
      <br />
      Please make sure renter has received approval (e.g. over email), or is a
      leader running a MITOC trip.
      <br />
      <br />
      Items:
      <ul>
        {gear.map(({ type, id }) => (
          <li key={id}>
            {id} ({type.typeName})
          </li>
        ))}
      </ul>
    </div>
  );
}
