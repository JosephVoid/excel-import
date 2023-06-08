import { Button, Card } from "antd"
import "./page_styles.css"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { GetTables } from "../utils/api"

const ListPage = () => {
  const [tables, setTables] = useState<string[]>([])
  
  useEffect(() => {
    GetTables().then(res => {
      setTables(res)
    })
  }, [])

  return (
    <div className="gen_container">
      {
        tables.map(tbl => (
          <Link to={'/view/'+tbl}>
            <Card style={{'marginBottom': '1em'}}>
              {tbl.toLocaleUpperCase()}
            </Card>
          </Link>
        ))
      }
      <Link to={'/import'}>
        <Button type="primary">Import New Table From Excel</Button>
      </Link>
    </div>
  )
}

export default ListPage