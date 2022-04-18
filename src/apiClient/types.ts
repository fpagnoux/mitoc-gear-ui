export interface ListWrapper<T> {
  count: number;
  previous: string | null;
  next: string | null;
  results: T[];
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isDeskworker: boolean;
  groups: { groupName: string; id: number }[];
}

export interface APIErrorType {
  msg: string;
  err: string;
  args?: Record<string, any>;
}

export interface Note {
  id: string;
  note: string;
  dateInserted: string;
  author: { firstName: string; lastName: string };
}
