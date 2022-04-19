import React, {useEffect} from "react";
import "./../shared/Search.css";
import SearchIcon from "@mui/icons-material/Search";
import AOS from "aos";

function Search(props) {
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, [])
  return (
    <div className="main">
      <div className="form-group has-search">
        <span className="form-control-feedback">
          <SearchIcon />
        </span>
        <input
          type="text"
          className="form-control"
          placeholder={props.placeholder}
          onChange={props.onChange}
        />
      </div>
    </div>
  );
}

export default Search;
