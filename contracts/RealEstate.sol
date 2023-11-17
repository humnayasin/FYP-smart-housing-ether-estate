// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


 contract RealEstate is ERC721URIStorage {
   // to create ennumerable ERC721 tokens 
   using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    struct Request {
      address buyer;
      bool hasRequested;
    }
    mapping(uint256=>Request) public _requests;
    
    function makeRequest(uint256 tokenId) public {
        require(_exists(tokenId), "Token does not exist");
        require(!_requests[tokenId].hasRequested, "Request already made");

        _requests[tokenId] = Request(msg.sender, true);
    }

    function hasRequested(uint256 tokenId) public view returns (bool) {
        return _requests[tokenId].hasRequested;
    }

    function getRequestAddress(uint256 tokenId) public view returns (address) {
        return _requests[tokenId].buyer;
    }


    
    
    
    
     constructor() ERC721("Real Estate" ,"REAL"){

     }


      // to create nft for each property we use mint function

      
     function mint(string memory tokenURI) public returns(uint256){
       _tokenIds.increment();
       uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;

     }


     // function to know how many nfts have been minted
      function totalSupply() public view returns(uint256){
         return _tokenIds.current();
      }

      
   function isTokenValid(uint256 tokenId) public view returns(bool) {
      return _exists(tokenId);
   }



function removePropertyFromSale(uint256 tokenId) public {
    address tokenOwner = ownerOf(tokenId);
    require(tokenOwner == msg.sender || msg.sender == _requests[tokenId].buyer, "You are not authorized to remove the property from sale.");
    delete _requests[tokenId];
}

function unmintProperty(uint256 tokenId) public {
    require(ownerOf(tokenId) == msg.sender, "Only the owner can unmint the property.");
    delete _requests[tokenId];
    _burn(tokenId);
}





    
 }
   
