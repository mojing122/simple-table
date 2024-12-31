import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import TabsContainer from "../layouts/Home/TabsContainer";
import Table from "../components/Table/Table";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Tab } from "@/types/tab";

const HomePage: React.FC = () => {
  const tabs = useSelector((state: RootState) => state.tabManager.tabs); // 访问 tabManager 中的 tabs
  const isActiveKey = useSelector(
    (state: RootState) => state.tabManager.isActiveKey
  ); // 访问 tabManager 中的 tabs
  const [currentTab, setCurrentTab] = useState<Tab | null>(null);

  useEffect(() => {
    const tab = tabs.find((tab) => tab.key === isActiveKey);
    setCurrentTab(tab || null);
  }, [isActiveKey]); // 当 isActiveKey 更新时运行

  return (
    <Layout>
      <TabsContainer>
        <Table filePath={currentTab?.contentFile || ""}></Table>
      </TabsContainer>
    </Layout>
  );
};

export default HomePage;
