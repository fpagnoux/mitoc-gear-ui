import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";

import { formatDate } from "lib/fmtDate";
import { GearRental, getGearRentalHistory } from "apiClient/gear";
import { TablePagination } from "components/TablePagination";
import { PersonLink } from "components/PersonLink";

type Props = {
  gearId: string;
};

export function GearRentalsHistory({ gearId }: Props) {
  const [rentals, setRentals] = useState<GearRental[] | null>(null);
  const [nbPages, setNbPages] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    getGearRentalHistory(gearId, page).then((rentalsList) => {
      setRentals(rentalsList.results);
      setNbPages(Math.ceil(rentalsList.count / 50));
    });
  }, [gearId, page]);

  return (
    <div className="border rounded-2 p-2 bg-light">
      <div className="d-flex justify-content-between">
        <h3>Rental History</h3>
        {nbPages > 1 && (
          <TablePagination setPage={setPage} page={page} nbPage={nbPages} />
        )}
      </div>

      {rentals && (
        <Table>
          <thead>
            <tr>
              <th>Renter</th>
              <th>Checked out</th>
              <th>Returned</th>
              <th>Weeks out</th>
            </tr>
          </thead>
          <tbody>
            {rentals.map(({ person, checkedout, returned, weeksOut }) => (
              <tr key={person.id + checkedout}>
                <td>
                  <PersonLink id={person.id}>
                    {person.firstName} {person.lastName}
                  </PersonLink>
                </td>
                <td>{formatDate(checkedout)}</td>
                <td>{returned && formatDate(returned)}</td>
                <td>{weeksOut}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
