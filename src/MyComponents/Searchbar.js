import React , {useState} from 'react'
import "../StyleSheets/searchbar.css"
import SearchResults from './SearchResults';
import { Link } from 'react-router-dom'

  function Searchbar({ placeholderText,  handleSearch }) {
    const [query, setQuery] = useState('');
    const [isClicked, setIsClicked] = useState(false);
  
    const handleOnChange = (event) => {
      const searchText = event.target.value;
      setQuery(searchText);
    };

  const handleSearchClick = () => {
    console.log("run");
    handleSearch(query); // Call the handleSearch function from props
  };


    return (
      <>
        <div className="container1 row g-1">
          <div className=" div1 col-md-4">
            <input
              type="text"
              className="searchbar form-control form-control-lg"
              placeholder={placeholderText}
              value={query}
             
              onChange={handleOnChange}
             onSubmit={handleSearchClick}
        
         
            />
          </div>
          <div className="col-md-auto row">
           <Link to="/SearchResults" className="button1" type="submit" onClick={handleSearchClick}></Link>
          </div>
        </div>
      </>)
      }
  

export default Searchbar