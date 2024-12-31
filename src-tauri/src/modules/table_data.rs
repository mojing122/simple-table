use calamine::{open_workbook_auto, Reader};
use serde::Serialize;
use std::collections::HashMap;
use std::error::Error;

#[derive(Serialize)]
struct S2DataConfig {
    fields: S2DataFields,
    meta: Vec<S2Meta>,
    data: Vec<HashMap<String, String>>, // 将 data 嵌入到 S2DataConfig 中
}

#[derive(Serialize)]
struct S2DataFields {
    columns: Vec<String>,
}

#[derive(Serialize)]
struct S2Meta {
    field: String,
    name: String,
}

pub mod table_data {
    use super::*;

    /**
     * 将Excel文件转换为antd表格所需的数据结构
     * @param {&str} file_path - Excel文件的绝对路径
     * @returns {Result<Vec<Vec<String>>, Error>} - 转换后的数据数组或错误
     */
    pub fn convert_excel_to_table_data(
        path: &str,
        sheet_name: &str,
    ) -> Result<String, Box<dyn Error>> {
        let has_header = true; // 设置是否有表头
        let mut workbook = open_workbook_auto(path)?;

        // 获取所有工作表名称
        let sheet_names = workbook.sheet_names().to_vec();
        let mut current_sheet_name = sheet_names[0].clone();
        if !sheet_name.is_empty() {
            current_sheet_name = sheet_name.to_string(); // 转换为 String
        }

        let range = workbook
            .worksheet_range(&current_sheet_name)
            .expect(&format!("Cannot get data of {}", current_sheet_name));

        let num_columns = range.get_size().1; // 获取列数
        let mut rows: Vec<HashMap<String, String>> = Vec::new();

        // 直接根据 has_header 决定 headers 的来源
        let headers: Vec<String> = if has_header {
            range
                .rows()
                .next()
                .unwrap_or_default()
                .iter()
                .map(|cell| cell.to_string())
                .collect()
        } else {
            (1..=num_columns).map(|i| format!("unknown{}", i)).collect()
        };

        // 迭代数据行（从第二行开始，如果有表头）
        let start_row = if has_header { 1 } else { 0 };

        for row in range.rows().skip(start_row) {
            let mut fields = HashMap::new();
            for (index, cell) in row.iter().enumerate() {
                let column_name = if index < headers.len() {
                    headers[index].clone()
                } else {
                    format!("unknown{}", index + 1) // 处理缺失值
                };
                let cell_value = cell.to_string();
                fields.insert(column_name, cell_value);
            }
            rows.push(fields);
        }

        // 构建 s2DataConfig 配置，包含 data 字段
        let s2_data_config = S2DataConfig {
            fields: S2DataFields {
                columns: headers.clone(),
            },
            meta: headers
                .iter()
                .enumerate()
                .map(|(_index, field)| {
                    S2Meta {
                        field: field.clone(),
                        name: field.clone(), // 这里可以根据需要修改展示名称
                    }
                })
                .collect(),
            data: rows, // 将 rows 数据放入 data 字段
        };

        // 将数据序列化为 JSON 格式
        let json_data = serde_json::to_string_pretty(&s2_data_config)?;

        // 返回 JSON 字符串
        Ok(json_data)
    }
}
