import { BaseEntity, BaseSearchForm } from ".";

export type User = BaseEntity & {
  id?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  isStaff?: string;
};

export type UserForm = User;

export type UserSearchForm = BaseSearchForm & {
  name?: string;
  id?: string;
};
