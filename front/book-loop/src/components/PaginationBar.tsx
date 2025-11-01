import type { FunctionComponent } from "react";
import { Pagination } from "antd";
import { EllipsisOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import "../style/pagination.css";

type Props = {
  page: number;
  limit: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
  className?: string;
};

const PaginationBar: FunctionComponent<Props> = ({
  page,
  limit,
  total,
  onChange,
  className,
}) => {
  return (
    <nav aria-label="Books pagination" className={className}>
      <Pagination
        className="catalog-pagination"
        current={page}
        total={total}
        pageSize={limit}
        onChange={(nextPage, pageSize) => onChange(nextPage, pageSize)}
        showSizeChanger={false}
        showLessItems
        responsive
        itemRender={(_page, type, original) => {
          if (type === "prev") {
            // Возвращаем элемент того же типа/класса, что и внутри antd,
            // но со своей иконкой — без cloneElement.
            return (
              <button
                type="button"
                className="ant-pagination-item-link"
                aria-label="Previous page"
              >
                <LeftOutlined className="pag-arrow" />
              </button>
            );
          }
          if (type === "next") {
            return (
              <button
                type="button"
                className="ant-pagination-item-link"
                aria-label="Next page"
              >
                <RightOutlined />
              </button>
            );
          }
          if (type === "jump-prev" || type === "jump-next") {
            return (
              <span className="ant-pagination-item-ellipsis" aria-hidden>
                <EllipsisOutlined />
              </span>
            );
          }
          return original;
        }}
      />
    </nav>
  );
};

export default PaginationBar;
