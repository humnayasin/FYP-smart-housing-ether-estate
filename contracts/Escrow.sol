// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

interface IERC721
 {
    function transferFrom(
        address _from,
        address _to,
        uint256 _id )external;     
    }
contract Escrow{
    address public lender;
    address public inspector;
    address public nftAddress;
    address payable public seller;

    
    modifier onlySeller() 
    {
        require (msg.sender== seller, "Only seller can call this method understand!!!");
        _;

        
    } 
    modifier onlyBuyer(uint256 _nftId) 
    {
        require (msg.sender== buyer[_nftId], "Only buyer can call this method understand!!!");
        _;

        
    }
     modifier onlyInspector() 
    {
        require (msg.sender== inspector, "Only inspector can call this method understand!!!");
        _;
    }
    mapping (uint256 => bool) public isListed;
    mapping (uint256 => uint256) public purchasePrice;
    mapping (uint256 => uint256) public escrowAmount;
    mapping (uint256 => address) public buyer;
    mapping (uint256 => bool) public inspectionPassed;
    mapping (uint256 => mapping(address => bool) )public approval;

    constructor(address _nftAddress, address payable _seller, address _inspector, address _lender )
   {
        nftAddress = _nftAddress;
        seller = _seller;
        inspector = _inspector;
        lender = _lender;
    }


     function list  (uint256 _nftID, address _buyer, uint256 _purchasePrice, uint256 _escrowAmount) 
     public payable onlySeller {
        //Transfer nft from selller to this Contract
            IERC721(nftAddress).transferFrom(msg.sender, address(this), _nftID);
            isListed[_nftID] = true;
            purchasePrice[_nftID] = _purchasePrice;
            escrowAmount[_nftID] = _escrowAmount;
            buyer[_nftID] = _buyer;         
     }
     
    //Put under contract (Only buyer---------> payable escrow)
    function depositEarnest(uint256 _nftId) public payable onlyBuyer(_nftId){


                require (msg.value>= escrowAmount[_nftId]);

    } 
    // UPDATE INSPECTION STATUS--->ONLY INSPECTOR
    function updateInspectionStatus (uint256 _nftID , bool _passed ) public onlyInspector{
        inspectionPassed[_nftID] = _passed;
    }
 // Approve Sale 
 function approveSale(uint256 _nftID) public {
    approval[_nftID][msg.sender] = true; 

 }         
    receive() external payable {
        
    }
    function getBalance()public view returns(uint256){
        return address(this).balance;
    }
    //Finalize sale
    //Require inspection status add more items here, like appraisal 
    //Require sales to be authorized 
    // Require funds to be correct amount 
    // Tranfer NFT to buyer 
    // Transfer funds to seller 
    function finalizeSale(uint256 _nftID) public{
         require(inspectionPassed[_nftID]);
         require (approval[_nftID][buyer[_nftID]]);
         require (approval[_nftID][seller]);
         require (approval[_nftID][lender]);
         require(address(this).balance>= purchasePrice[_nftID]);

        isListed[_nftID] = false;
        (bool success,)= payable(seller).call{value: address(this).balance}("");
        require(success);
    IERC721(nftAddress).transferFrom(address(this),buyer[_nftID], _nftID);
    }
    //Cancel Sale (handle earnest deposit)
    //-> if inspection status is not approved than refund otherwise send seller 
    function cancelSale(uint256 _nftID)public{
        if(inspectionPassed[_nftID]== false)
        {
            payable(buyer[_nftID]).transfer(address(this).balance);
        } 
        else {
            payable(seller).transfer(address(this).balance);
        }
    }
   

} 
           

    

