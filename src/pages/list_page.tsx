import { Button, Card } from "antd"
import "./page_styles.css"
import { Link } from "react-router-dom"

const ListPage = () => {
  return (
    <div className="gen_container">
      <Link to={'/view/23'}>
        <Card style={{'marginBottom': '1em'}}>
          Table 1
        </Card>
      </Link>
      <Link to={'/import'}>
        <Button type="primary">Import New Table From Excel</Button>
      </Link>
    </div>
  )
}

export default ListPage