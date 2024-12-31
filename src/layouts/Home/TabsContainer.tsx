import React, { useState, useEffect } from "react";
import type { TabsProps } from "antd";
import { Tabs } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import {
  addTab,
  removeTab,
  updateActiveKey,
} from "../../store/modules/tabStore";
import { Tab } from "@/types/tab";
import { open } from "@tauri-apps/plugin-dialog";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const TabsContainer: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const tabs = useSelector((state: RootState) => state.tabManager.tabs); // 访问 tabManager 中的 tabs
  const isActiveKey = useSelector(
    (state: RootState) => state.tabManager.isActiveKey
  ); // 访问 tabManager 中的 isActiveKey
  // console.log("tabs", tabs);

  // 在组件中修改store数据

  const dispatch = useDispatch();

  const [activeKey, setActiveKey] = useState(isActiveKey);
  const [items, setItems] = useState<TabsProps["items"]>(tabs);
  const [_, setCurrentTab] = useState<Tab | null>(null);
  // const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 使用 useEffect 来更新 items
  useEffect(() => {
    setItems(tabs);
  }, [tabs]); // 当 tabs 更新时运行

  useEffect(() => {
    setActiveKey(isActiveKey);
    const tab = tabs.find((tab) => tab.key === isActiveKey);
    setCurrentTab(tab || null);
  }, [isActiveKey]); // 当 isActiveKey 更新时运行

  const add = async () => {
    const newKey = new Date().getTime().toString();
    // Open a dialog
    const file = await open({
      multiple: false,
      directory: false,
    });
    console.log(file);
    if (!file) {
      console.warn("No file selected");
      return;
    }
    // Ensure file is a string before processing
    if (typeof file === "string") {
      const fileExtension = file.split(".").pop()?.toLowerCase() || "";
      if (fileExtension === "xlsx") {
        const fileName = file.split("/").pop()?.split(".")[0] || "未命名文件";
        dispatch(addTab({ key: newKey, label: fileName, contentFile: file }));
        dispatch(updateActiveKey(newKey));
      } else {
      }
    } else {
      console.error("文件获取出错:", file);
    }
  };

  const remove = (targetKey: TargetKey) => {
    if (!items) return;
    const targetIndex = items.findIndex((item) => item.key === targetKey);
    const newItems = items.filter((item) => item.key !== targetKey);

    if (newItems.length && targetKey === activeKey) {
      const newActiveKey =
        newItems[
          targetIndex === newItems.length ? targetIndex - 1 : targetIndex
        ].key;
      dispatch(updateActiveKey(newActiveKey));
    }
    dispatch(removeTab(targetKey.toString()));
  };

  const onEdit = (targetKey: TargetKey, action: "add" | "remove") => {
    if (action === "add") {
      add();
    } else {
      remove(targetKey);
    }
  };

  const onChange = (newActiveKey: string) => {
    dispatch(updateActiveKey(newActiveKey));
    const tab = tabs.find((tab) => tab.key === newActiveKey);
    setCurrentTab(tab || null);
  };

  return (
    <div>
      <Tabs
        type="editable-card"
        size="small"
        activeKey={activeKey}
        onChange={onChange}
        onEdit={onEdit}
        items={items}
      />
      <div>{children}</div>
    </div>
  );
};

export default TabsContainer;
