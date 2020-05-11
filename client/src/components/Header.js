import React from "react";
import { useHistory } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";

const Header = (props) => {

  const history = useHistory();

  const homeHandler = () => {
    history.replace("/")  
  }

  return <div>
    <div className="header">
      <div className="header-company">
        <div className="header-company-title">Rameses Systems Inc</div>
      </div>
      <div className="header-separtor"/>
      <div className="header-title-container">
        <div className="header-title">Database Migration</div>
        <IconButton onClick={homeHandler}>
          <HomeIcon  style={{color: "white" }}/>
        </IconButton>
      </div>
    </div>
  </div>
};

export default Header;
