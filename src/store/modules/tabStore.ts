import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Tab } from "../../types/tab";

const tabStore = createSlice({
  name: "tabManager",
  initialState: {
    tabs: [{ key: "1", label: "New Table", contentFile: "New Table" }] as Tab[],
    isActiveKey: "1",
  },
  reducers: {
    addTab(state, action: PayloadAction<Tab>) {
      state.tabs.push(action.payload); // 添加新的 tab
    },
    removeTab(state, action: PayloadAction<string>) {
      state.tabs = state.tabs.filter((tab) => tab.key !== action.payload); // 根据 key 移除 tab
    },
    updateActiveKey(state, action: PayloadAction<string>) {
      state.isActiveKey = action.payload; // 更新当前激活的 tab
    },
  },
});

const { addTab, removeTab, updateActiveKey } = tabStore.actions;
const tabReducer = tabStore.reducer;
export { addTab, removeTab, updateActiveKey };

export default tabReducer;
