export interface ClientResponse {
  content: Client[];
  pageable: Pageable;
  total: number;
  size: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  number: number;
  sort: Sort;
  empty: boolean;
}

export interface Client {
  id?: number;
  fullName: string;
  displayName: string;
  email: string;
  details: string;
  active: boolean;
  location?: string;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}
