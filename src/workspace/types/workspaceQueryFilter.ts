export interface WorkspaceQueryFilters {
  id?: string;
  name?: string;
  owner_id?: number;
  sortBy?: string;
  sortOrder?: string;
  limit?: number; //amount
  offset?: number; //beginning
}

export interface WorkspaceFindOneQuery {
  id?: string;
  email?: string;
  name?: string;
  picture_url?: string;
}
