import { Alert, Button, Form, Input, Space, Table, Upload } from "antd"
import "./page_styles.css"
import { PlusOutlined } from "@ant-design/icons"
import Title from "antd/es/typography/Title"
import type { ColumnsType } from 'antd/es/table';
import { Link, useNavigate, useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { useEffect, useState } from "react";
import { CreateTable, GetTable, UpdateTable } from "../utils/api";

interface IPage {
  page: "VIEW" | "NEW"
}

export interface IData {
  key: React.Key;
  item_no: string;
  item_desc: string;
  item_qty: string;
  item_price: string;
  item_rate: string;
  item_unit: string
}

const columns: ColumnsType<IData> = [
  {
    title: 'Item No',
    dataIndex: 'item_no'
  },
  {
    title: 'Desc',
    dataIndex: 'item_desc',
  },
  {
    title: 'Unit',
    dataIndex: 'item_unit',
  },
  {
    title: 'Qty',
    dataIndex: 'item_qty',
  },
  {
    title: 'Rate',
    dataIndex: 'item_rate',
  },
  {
    title: 'Price',
    dataIndex: 'item_price',
  }
];


const ImportViewPage = (prop: IPage) => {
  // States
  const [tableData, setTableData] = useState<IData[]>([])
  const [tableTitle, setTableTitle] = useState("No Table Name")
  const [uploadState, setUploadState] = useState<"ERR" | "SUC" | "">("")
  const [selectedRowsKeyState, setSelectedRowsKeyState] = useState<React.Key[]>([])
  const [dispalyEditFields, setDisplayEditFields] = useState<boolean>(false)
  let navigate = useNavigate();
  let params = useParams();

  useEffect(prop.page === "VIEW" ? () => {     
    GetTable(params.id as string).then(res => {setTableData(res); setTableTitle(params.id as string)})
  } : () => console.log(""), [])

  /* Handle the selection logic
  ------------------------------------------------  */
  const selectionHandler = (selectedRowKeys: React.Key[], selectedRows: IData[]) => {
    console.log(selectedRowKeys)
    setSelectedRowsKeyState(selectedRowKeys)
  }

  /* Handle the selection logic
    ------------------------------------------------  */
  const removeSelectedRowsHandler = () => {
    let local_table_data = [...tableData]
    setTableData(local_table_data.filter((row_data) => !selectedRowsKeyState.includes(row_data.key)))
  }

  /* Handle the saving logic
    ------------------------------------------------  */
  const saveButtonHandler = () => {
    if (prop.page === "NEW") {
      CreateTable(tableData, tableTitle.replace(' ', '_').toLocaleUpperCase()).then(res => {
        if (res) navigate("/")
      })
    } else {
      UpdateTable(tableData, tableTitle.replace(' ', '_').toLocaleUpperCase()).then(res => {
        if (res) navigate("/")
      })
    }
  }
  /* Handle the editing of rows
  ------------------------------------------------  */
  const editFieldHandler = (key: React.Key, value: any, field: any) => {
    var local_table_data = [...tableData]
    for (var i in local_table_data) {
      if (local_table_data[i].key === key) {
        switch (field) {
          case "INo":
            local_table_data[i].item_no = value
            break;
          case "Ds":
            local_table_data[i].item_desc = value
            break;
          case "Un":
            local_table_data[i].item_unit = value
            break;
          case "Qt":
            local_table_data[i].item_qty = value
            break;
          case "Ra":
            local_table_data[i].item_rate = value
            break;
          case "Pr":
            local_table_data[i].item_price = value
            break;
          default:
            break;
          }
         break; //Stop this loop, we found it!
      }
    }
    setTableData(local_table_data)
  }

  /* Convert the worksheet object to arrays of arrays
  ------------------------------------------------  */
  const sheet2arr = (sheet: XLSX.WorkSheet) => {
    let result = [];
    let row;
    let rowNum;
    let colNum;
    let range = XLSX.utils.decode_range(sheet['!ref'] ?? '');
    for(rowNum = range.s.r; rowNum <= range.e.r; rowNum++){
      row = [];
        for(colNum=range.s.c; colNum<=range.e.c; colNum++){
          let nextCell = sheet[
              XLSX.utils.encode_cell({r: rowNum, c: colNum})
          ];
          if( typeof nextCell === 'undefined' ){
              row.push(void 0);
          } else row.push(nextCell.w);
        }
        result.push(row);
    }
    return result;
  };
  
  /*  Verify if the excel meet the format, ie. 6 column excel
  ------------------------------------------------  */
  const verifyExcel = (ws: any[][]) => {
    if (ws[0].length !== 6) return false
    return true
  }

  /*   Verify if the excel meet the format
  ------------------------------------------------  */
  const mapToTable = (ws: any[][]):IData[] => {
    let data_array:IData[] = []
    for (let index = 0; index < ws.length; index++) {
      let row = ws[index];
      data_array.push({key: index, item_no: row[0] ?? '-', item_desc: row[1] ?? '-', item_price: row[5] ?? '-', item_qty: row[3] ?? '-', item_rate: row[4] ?? '-', item_unit: row[2] ?? '-'})
    }
    return data_array
  }

  /*   Read Excel file and load into state
  ------------------------------------------------  */
  const handleFileUpload = (file:any) => {
    const reader = new FileReader();
  
    reader.onload = e => {
      const data = e.target?.result
      const workbook = XLSX.read(data, {type: "array"})
      
      workbook.SheetNames.forEach((sheet)=>{
        const worksheet = workbook.Sheets[sheet]
        const arrayWorksheet = sheet2arr(worksheet)
        console.log(arrayWorksheet)
        if (verifyExcel(arrayWorksheet)) {
          setUploadState("SUC")
          setTableData(mapToTable(arrayWorksheet))
        } else
          setUploadState("ERR")
      })
  
    };
    reader.readAsArrayBuffer(file)
    
    // To Prevent Upload
    return false
  }

  return (
    <div className="gen_container import_container">
      <div className="input_control">
        <Form layout="vertical">
          <Form.Item label="Table Title">
            <Input placeholder="Table Name" onChange={(e) => setTableTitle(e.target.value)}></Input>
          </Form.Item>
          <Form.Item label="Upload Excel" valuePropName="fileList">
            <Upload accept=".xlsx" showUploadList={false} beforeUpload={(file:any) => handleFileUpload(file)}>
              <div>
                <PlusOutlined />
              </div>
            </Upload>
          </Form.Item>
        </Form>
        {
          uploadState !== "" &&
          <Alert message={uploadState === "ERR" ? "File Upload Error: Please use a 6 column excel" : "File Uploaded"} type={uploadState === "ERR" ? "error" : "success"} />
        }
      </div>
      <div className="table_control">
        <Title level={3}>{tableTitle}</Title>
        <Table dataSource = {tableData} columns = {columns} rowSelection = {{type: "checkbox", onChange: selectionHandler}} pagination = {false}></Table>
        <Form layout="inline" style={{'marginTop':'1em', 'display': dispalyEditFields ? '' : 'none'}}>
          <Space>
            <Form.Item>
              <Input placeholder="Item No" onChange={(e) => editFieldHandler(selectedRowsKeyState[0], e.target.value, "INo")}/>
            </Form.Item>
            <Form.Item>
              <Input placeholder="Description" onChange={(e) => editFieldHandler(selectedRowsKeyState[0], e.target.value, "Ds")}/>
            </Form.Item>
            <Form.Item>
              <Input placeholder="Unit" onChange={(e) => editFieldHandler(selectedRowsKeyState[0], e.target.value, "Un")}/>
            </Form.Item>
            <Form.Item>
              <Input placeholder="Qty" onChange={(e) => editFieldHandler(selectedRowsKeyState[0], e.target.value, "Qt")}/>
            </Form.Item>
            <Form.Item>
              <Input placeholder="Rate" onChange={(e) => editFieldHandler(selectedRowsKeyState[0], e.target.value, "Ra")}/>
            </Form.Item>
            <Form.Item>
              <Input placeholder="Price" onChange={(e) => editFieldHandler(selectedRowsKeyState[0], e.target.value, "Pr")}/>
            </Form.Item>
          </Space>
        </Form>
        <Space style={{'marginTop':'1em'}}>
          <Button onClick = {() => removeSelectedRowsHandler()}>Remove Selected</Button>
          <Button disabled = {selectedRowsKeyState.length > 1} onClick = {() => selectedRowsKeyState.length === 1 ? setDisplayEditFields(!dispalyEditFields) : null}>
            {dispalyEditFields ? "Done" : "Edit Selected"}            
          </Button>
        </Space>
        <br />
        <div style = {{'marginTop':'1em', 'display':'flex', 'justifyContent':'space-between'}}>
          <Button onClick = {() => saveButtonHandler()} type="primary">Save</Button>
          <Link to = {'/'}>
            <Button type="text">Go Back Home</Button>
          </Link>
        </div>
        
      </div>
    </div>
  )
}

export default ImportViewPage