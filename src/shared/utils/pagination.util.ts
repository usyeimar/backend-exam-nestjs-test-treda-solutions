import {
  PaginationOptions,
  PaginatedResult,
} from '../interfaces/pagination.interface';

export function paginate<T>(
  items: T[],
  totalItems: number,
  options: PaginationOptions,
): PaginatedResult<T> {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    items,
    meta: {
      totalItems,
      itemCount: items.length,
      itemsPerPage: limit,
      totalPages,
      currentPage: page,
    },
  };
}
