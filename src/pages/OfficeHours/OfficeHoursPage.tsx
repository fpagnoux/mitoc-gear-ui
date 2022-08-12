import styled from "styled-components";
import dayjs from "dayjs";
import weekOfYears from "dayjs/plugin/weekOfYear";

import { signUp } from "apiClient/officeHours";
import { PersonLink } from "components/PersonLink";
import { useSetPageTitle } from "hooks";
import { groupBy, isEmpty, map } from "lodash";
import { useGetOfficeHoursQuery } from "redux/api";
import { useCurrentUser } from "redux/auth";

dayjs.extend(weekOfYears);

export function OfficeHoursPage() {
  useSetPageTitle("Office Hours");
  const { data: officeHours, refetch } = useGetOfficeHoursQuery();
  const { user } = useCurrentUser();

  const now = dayjs();
  const officeHoursByWeek = groupBy(officeHours, ({ startTime }) =>
    dayjs(startTime).week()
  );

  return (
    <div className="row">
      <div className="col-lg-8">
        <h1>Upcoming office hours</h1>

        {map(officeHoursByWeek, (officeHours, weekStr) => {
          const week = Number(weekStr);
          const weekTitle =
            week === now.week()
              ? "This Week"
              : week === now.add(1, "week").week() // Cannot just use now.week() + 1, since week number resets every year
              ? "Next week"
              : week === now.add(2, "week").week()
              ? "Future Weeks"
              : null;

          return (
            <div>
              {weekTitle && <h3>{weekTitle}</h3>}
              <WeekBlock>
                {officeHours.map(({ startTime, signups, googleId }) => {
                  const weekDelta = dayjs(startTime).diff(now, "week");
                  const alertClass =
                    Number(weekDelta) >= 1
                      ? "secondary"
                      : signups.length === 0
                      ? "danger"
                      : signups.length === 1
                      ? "warning"
                      : "success";
                  const buttonClass = ["danger", "warning"].includes(alertClass)
                    ? "primary"
                    : "outline-primary";
                  const isUserSignedUp = signups.some(
                    ({ deskWorker }) => deskWorker.id === user!.id
                  );
                  return (
                    <div className={`alert alert-${alertClass}`}>
                      <div>
                        <strong>{formatDateTime(startTime)}</strong>
                      </div>
                      {!isEmpty(signups) ? (
                        <div>
                          Signed up:{" "}
                          {signups.map((signup, i) => (
                            <>
                              {i > 0 && ", "}
                              <PersonLink id={signup.deskWorker.id}>
                                {signup.deskWorker.firstName}
                              </PersonLink>
                            </>
                          ))}
                          <br />
                          {!isUserSignedUp && signups.length === 1 && (
                            <em>We could use more help!</em>
                          )}
                          {isUserSignedUp && (
                            <em>You're signed up, thank you!</em>
                          )}
                        </div>
                      ) : (
                        <div>
                          <em>No one signed up yet!</em>
                        </div>
                      )}
                      {!isUserSignedUp && (
                        <div className="btn-container">
                          <button
                            className={`btn btn-${buttonClass} btn-m`}
                            type="button"
                            onClick={() => signUp(googleId).then(refetch)}
                          >
                            Signup
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </WeekBlock>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatDateTime(date: string) {
  return dayjs(date).format("dddd MMM DD YYYY, hh:mma");
}

const WeekBlock = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-width: 767px) {
    flex-direction: column;
  }

  .btn-container {
    display: flex;
    justify-content: right;
  }
`;
