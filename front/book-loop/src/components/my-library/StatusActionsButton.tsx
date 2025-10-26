import type { FunctionComponent } from "react";
import { Dropdown, Button, Popconfirm, type MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { IoBookOutline, IoBook } from "react-icons/io5";
import { MdOutlineDownloadDone } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";

export type ActionKey = "to-read" | "reading" | "finished" | "delete";

type Props = {
  bookId: string;
  onAction: (bookId: string, action: ActionKey) => void;
  disabledKeys?: Partial<Record<ActionKey, boolean>>;
  loading?: boolean;
  ariaLabel?: string;
};

const StatusActionsButton: FunctionComponent<Props> = ({
  bookId, onAction, disabledKeys, loading, ariaLabel = "More"
}) => {
  const DeleteWithConfirm: FunctionComponent = () => (
    <Popconfirm
      title="Remove from this list?"
      okText="Remove"
      okButtonProps={{ danger: true }}
      cancelText="Cancel"
      onConfirm={() => onAction(bookId, "delete")}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 12px" }}>
        <AiOutlineDelete /> Remove
      </div>
    </Popconfirm>
  );

  const items: MenuProps["items"] = [
    {
      key: "to-read", disabled: !!disabledKeys?.["to-read"],
      label:
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}><IoBookOutline />
          Want to Read
        </div>
    },
    {
      key: "reading", disabled: !!disabledKeys?.reading,
      label:
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}><IoBook />
          Reading
        </div>
    },
    {
      key: "finished", disabled: !!disabledKeys?.finished,
      label:
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}><MdOutlineDownloadDone />
          Finished
        </div>
    },
    { type: "divider" as const },
    {
      key: "delete", disabled: !!disabledKeys?.delete,
      label: <DeleteWithConfirm />
    },
  ];

  const onClick: MenuProps["onClick"] = (info) => {
    const k = info.key as ActionKey;
    if (k === "delete") return;
    onAction(bookId, k);
  };

  return (
    <Dropdown menu={{ items, onClick }} trigger={["click"]} placement="bottomLeft">
      <Button aria-label={ariaLabel} loading={loading} type="default">
         <DownOutlined />
      </Button>
    </Dropdown>
  );
};

export default StatusActionsButton;



