import Title from "antd/es/typography/Title"
import "./page_styles.css"
import {Outlet} from "react-router-dom"

const LandingPage = () => {
  return (
    <div className="main_container">
      <div className="title">
        <Title>Excel Importing Module</Title>
      </div>
      <div className="main_content">
        <Outlet/>
      </div>
    </div>
  )
}

export default LandingPage