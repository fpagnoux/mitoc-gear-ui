import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { createNewApproval, CreateNewApprovalArgs } from "apiClient/approvals";
import { APIError as APIErrorClass } from "apiClient/client";
import { APIErrorType } from "apiClient/types";
import { useSetPageTitle } from "hooks";
import { gearDbApi } from "redux/api";

import { AddNewApprovalForm } from "./AddNewApprovalForm";

export function AddNewApproval() {
  useSetPageTitle("Approve restricted gear rental");
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<APIErrorType | undefined>();
  const refetchApprovals = gearDbApi.useLazyGetApprovalsQuery()[0];
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const personId = params.get("personId") ?? undefined;
  const onSubmit = (args: CreateNewApprovalArgs) => {
    createNewApproval(args)
      .then(() => {
        setError(undefined);
        setSuccess(true);
        // TODO: We should use RTK's mutations instead of refetching everything
        refetchApprovals({ past: false });
        refetchApprovals({ past: undefined });
      })
      .catch((err) => {
        if (err instanceof APIErrorClass) {
          setSuccess(false);
          setError(err.error);
        }
        throw err;
      });
  };

  return (
    <div className="row">
      <div className="col-lg-8">
        <h3>Approve restricted gear rental</h3>
        {error && (
          <div className="alert alert-danger">Approval failed: {error.msg}</div>
        )}
        {!success && (
          <AddNewApprovalForm onSubmit={onSubmit} personId={personId} />
        )}
        {success && (
          <>
            <p className="mb-2 alert alert-success">
              Success! The approval was granted:
            </p>

            <div className="d-flex justify-content-between">
              <Link to="/approvals">
                <button type="button" className="btn btn-outline-secondary">
                  Go to approvals list
                </button>
              </Link>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setSuccess(false)}
              >
                Approve another rental
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
