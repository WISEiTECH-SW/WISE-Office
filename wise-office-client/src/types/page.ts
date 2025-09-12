export interface PageInfo {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

export interface PageParams {
    currentPage: number;
    offset: number;
}
