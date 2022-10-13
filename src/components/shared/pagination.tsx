import React, { ReactNode, useEffect } from "react";
import { PageSet } from "utils/network/api_hooks";
import { Form as BsForm, Pagination as BsPagination } from "react-bootstrap";
import { Flex } from "./flex";
import { InputField } from "./input";
import { Form, useEffectSkipFirst } from "utils/hooks";
import { BaseSearchForm, PagingResponse } from "entities";

type Props = {
  response: PagingResponse | null;
  pageSet: PageSet;
  searchForm?: Form<BaseSearchForm>;
};

export const Pagination: React.FC<Props> = ({
  response,
  pageSet,
  searchForm,
}: Props) => {
  useEffect(() => {
    if (searchForm) {
      if (searchForm.object.page && pageSet.page !== searchForm.object.page) {
        pageSet.setPage(searchForm.object.page);
      }

      if (
        searchForm.object.perPage &&
        pageSet.perPage !== searchForm.object.perPage
      ) {
        pageSet.setPerPage(searchForm.object.perPage);
      }
    }
  }, []);

  useEffectSkipFirst(() => {
    if (searchForm) {
      searchForm.update((f) => {
        f.page = pageSet.page;
        f.perPage = pageSet.perPage;
      });
    }
  }, [pageSet.page, pageSet.perPage]);

  const handleClickPagination = (offset: number) => {
    pageSet.setPage(offset / pageSet.perPage + 1);
  };

  const maxPage = (): number => {
    if (!response) {
      return 0;
    }
    return Math.ceil(response.count / pageSet.perPage) || 1;
  };

  const createPaginationItem = (): ReactNode[] => {
    const offset = 4;
    const pageIndex = pageSet.page - 1;
    let minPageIndex = pageIndex - offset;
    let maxPageIndex = pageIndex + offset;
    if (minPageIndex < 0) {
      maxPageIndex += -minPageIndex;
      minPageIndex = 0;
    }
    if (maxPageIndex + 1 >= maxPage()) {
      const diff = maxPageIndex + 1 - maxPage();
      if (minPageIndex > 1) {
        minPageIndex -= diff;
      }
      maxPageIndex = maxPage() - 1;
    }
    const numbers = [];
    for (let i = minPageIndex; i <= maxPageIndex; i++) {
      numbers.push(i + 1);
    }
    const nodes = [];
    if (numbers[0] > 1) {
      nodes.push(<BsPagination.Ellipsis key="ellipsis-prev" disabled />);
    }
    numbers.map((pageNum: number) => {
      nodes.push(
        <BsPagination.Item
          key={pageNum}
          active={pageSet.page == pageNum}
          onClick={() => pageSet.setPage(pageNum)}
        >
          {pageNum}
        </BsPagination.Item>
      );
    });
    if (numbers[numbers.length - 1] < maxPage()) {
      nodes.push(<BsPagination.Ellipsis key="ellipsis-next" disabled />);
    }
    return nodes;
  };

  return (
    <>
      {response &&
        response.count > (searchForm?.object?.perPage ?? pageSet.perPage) && (
          <Flex flexDirection="row">
            <BsPagination style={{ margin: 0 }}>
              {pageSet.page > 1 && (
                <>
                  <BsPagination.First onClick={() => pageSet.setPage(1)} />
                  <BsPagination.Prev
                    onClick={() => pageSet.setPage(pageSet.page - 1)}
                  />
                </>
              )}

              {createPaginationItem()}
              {pageSet.page < maxPage() && (
                <>
                  <BsPagination.Next
                    onClick={() => pageSet.setPage(pageSet.page + 1)}
                  />
                  <BsPagination.Last
                    onClick={() => pageSet.setPage(maxPage())}
                  />
                </>
              )}
            </BsPagination>
            <BsForm.Label style={{ marginTop: 7, marginLeft: 10 }}>
              表示数:
            </BsForm.Label>
            <BsForm.Select
              required
              style={{ width: 80 }}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                pageSet.setPerPage(parseInt(e.target.value));
              }}
              value={pageSet.perPage}
            >
              {[20, 50, 100, 200, 500].map((perPage: number) => {
                return (
                  <option key={perPage} value={perPage}>
                    {perPage}
                  </option>
                );
              })}
            </BsForm.Select>
          </Flex>
        )}
    </>
  );
};

export default BsPagination;
