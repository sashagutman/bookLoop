import { cloneElement, isValidElement, type FunctionComponent } from "react";
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
    <nav
      aria-label="Books pagination"
      className={className}
      style={{ display: "grid", placeItems: "center", marginTop: 20 }}
    >
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
          if (!isValidElement(original)) return original;
          if (type === "prev") {
            return cloneElement(original, { children: <LeftOutlined className="pag-arrow" /> });
          }
          if (type === "next") {
            return cloneElement(original, { children: <RightOutlined /> });
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
