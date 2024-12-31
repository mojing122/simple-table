import { useRef, useState, useEffect } from "react";
import { SheetComponent } from "@antv/s2-react";
import "@antv/s2-react/dist/s2-react.min.css";
import { invoke } from "@tauri-apps/api/core";
import style from "./Table.module.css";

const s2Options = {
  width: 800,
  height: 200,
};

interface DataConfig {
  [key: string]: any;
  data: any[];
  fields: {
    values: string[];
  };
}

// 定义 Table 组件的 props 类型
interface TableProps {
  filePath: string;
}

const Table: React.FC<TableProps> = ({ filePath }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [s2DataConfig, setS2DataConfig] = useState<DataConfig>({
    data: [],
    fields: { values: [] },
  });
  async function readTable() {
    console.log(filePath);
    const path = filePath;
    try {
      const message = await invoke<string>("read_table_data", { path });
      setS2DataConfig(JSON.parse(message));
    } catch (error) {
      console.error("Failed to read table data:", error);
    }
  }

  useEffect(() => {
    readTable();
  }, [filePath]);

  useEffect(() => {
    console.log(s2DataConfig.data);
  }, [s2DataConfig]);

  return (
    <div ref={containerRef} id="container" className={style.table_container}>
      <SheetComponent
        sheetType="table"
        dataCfg={s2DataConfig}
        options={s2Options}
        adaptive={{
          width: true,
          height: true,
          getContainer: () => containerRef.current!,
        }}
      />
    </div>
  );
};

export default Table;
