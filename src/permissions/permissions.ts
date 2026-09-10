export type Permission =
  | "dashboard:view"

  | "tickets:view_all"
  | "tickets:view_assigned"
  | "tickets:view_own"
  | "tickets:create"
  | "tickets:edit"
  | "tickets:delete"
  | "tickets:assign"
  | "tickets:reassign"
  | "tickets:update_status"
  | "tickets:update_priority"

  | "comments:view"
  | "comments:create"
  | "comments:edit"
  | "comments:delete"

  | "resolution:create"
  | "resolution:view"

  | "users:manage"

  | "categories:manage"

  | "reports:view";