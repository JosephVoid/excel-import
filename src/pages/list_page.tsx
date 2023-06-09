import { Button, Card } from "antd"
import "./page_styles.css"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { DeleteTable, GetTables } from "../utils/api"
import { DeleteOutlined } from "@ant-design/icons"
import Title from "antd/es/typography/Title"

const ListPage = () => {
  const [tables, setTables] = useState<string[]>([])
  
  /* Load the list of tables */
  useEffect(() => {
    GetTables().then(res => {
      setTables(res)
    })
  }, [])

  /* Handle the deletion logic
  ------------------------------------------------  */
  const deleteHandler = (table_name: string) => {
    DeleteTable(table_name).then(res => {
      if (res) setTables(tables.filter((tbl) => tbl !== table_name))
    })
  }

  return (
    <div className="gen_container">
      <Title level={4} style={{'marginBottom':'1em'}}>Previously Uploaded Tables</Title>
      {
        tables.map(tbl => (
          <Card style={{'marginBottom': '1em'}}>
            <Link to={'/view/'+tbl}>
              {tbl.toLocaleUpperCase()}
            </Link>
            <DeleteOutlined onClick={() => deleteHandler(tbl)} style={{'float':'right'}}/>
          </Card>
        ))
      }
      <Link to={'/import'}>
        <Button type="primary">Import New Table From Excel</Button>
      </Link>
    </div>
  )
}

export default ListPage