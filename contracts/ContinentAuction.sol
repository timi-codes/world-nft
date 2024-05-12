pragma solidity ^0.8.13;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./ContinentToken.sol";


contract ContinentAuction is Ownable {
    using SafeMath for uint256;
    using Address for address payable;

    uint256 public constant MAX_PURCHASE_PER_WALLET = 1;

    struct Auction {
        uint256 tokenId; // id of the auction token 
        uint256 bidIncrement; // the minimum bid increment
        bool ended;

        uint256 highestBid; // the current highest bid amount
        mapping(address => BidItem[]) bids; // the auction bids
        address highestBidder; // the account with the current highest bid

        uint256 startTime; // the time the auction started
        uint256 endTime; // the time the auction ended
    }

    struct BidItem {
        uint256 amount; // bid price in wei
        uint256 timestamp; // timestamp of bid
    }

    mapping(uint256 => Auction) public auctions;

    ContinentToken public continentTokenContract;

    event BidPlaced(address indexed bidder, uint256 tokenId, uint256 amount);
    event AuctionEnded(address indexed winner, uint256 tokenId, uint256 amount);
    event AuctionStarted(uint256 indexed tokenId, uint256 startTime, uint256 endTime);

    constructor(address _continentToken) {
        continentTokenContract = ContinentToken(_continentToken);
    }

    function createAuction(uint256 _tokenId, uint256 _startPrice, uint256 _bidIncrement, uint256 _startTime, uint256 _endTime) public onlyOwner {

        require(continentTokenContract.ownerOf(_tokenId) == address(continentTokenContract), "Continent not in contract");
        require(auctions[_tokenId].endTime == 0, "Auction already exists");
        require(_startTime < _endTime, "Invalid start and end time");
        require(_endTime > block.timestamp, "End time must be in the future");

        auctions[_tokenId].tokenId = _tokenId;
        auctions[_tokenId].bidIncrement = _bidIncrement;
        auctions[_tokenId].ended = false;
        auctions[_tokenId].highestBid = _startPrice;
        auctions[_tokenId].highestBidder = address(0);
        auctions[_tokenId].startTime = _startTime;
        auctions[_tokenId].endTime = _endTime;

        emit AuctionStarted(_tokenId, _startTime, _endTime);
    }

    function getAuction(uint256 _tokenId) public view returns (uint256, uint256, uint256, uint256, uint256, bool, address) {
        return (_tokenId, auctions[_tokenId].bidIncrement, auctions[_tokenId].highestBid, auctions[_tokenId].startTime, auctions[_tokenId].endTime, auctions[_tokenId].ended, auctions[_tokenId].highestBidder);
    }

    function endAuction(uint256 _tokenId) public onlyOwner {
        require(auctions[_tokenId].endTime > 0, "Auction not started");
        require(block.timestamp >= auctions[_tokenId].endTime, "Auction not ended yet");

        auctions[_tokenId].ended = true;
        emit AuctionEnded(auctions[_tokenId].highestBidder, _tokenId, auctions[_tokenId].highestBid);

        continentTokenContract.transferTokenFromContract(_tokenId, auctions[_tokenId].highestBidder);
    }   

    function placeBid(uint256 _tokenId) public payable {

        require(auctions[_tokenId].endTime > 0, "Auction not started");
        require(block.timestamp < auctions[_tokenId].endTime, "Auction ended");
        require(continentTokenContract.balanceOf(msg.sender) < MAX_PURCHASE_PER_WALLET, "Bidder already owns a continent");

        uint256 nextMinimumBid = auctions[_tokenId].highestBid + auctions[_tokenId].bidIncrement;
        require(msg.value >= nextMinimumBid, "Bid must be higher than current bid by at least the bid increment");

        // Refund the previous highest bid
        if (auctions[_tokenId].highestBidder != address(0)) {
            address payable previousBidder = payable(auctions[_tokenId].highestBidder);
            previousBidder.sendValue(auctions[_tokenId].highestBid);
        }

        auctions[_tokenId].highestBid = msg.value;
        auctions[_tokenId].highestBidder = msg.sender;

        auctions[_tokenId].bids[msg.sender].push(BidItem({
            amount: msg.value,
            timestamp: block.timestamp
        }));

        emit BidPlaced(msg.sender, _tokenId, msg.value);
    }

    function getBids(uint256 _tokenId) public view returns (BidItem[] memory) {
         BidItem[] memory bids = auctions[_tokenId].bids[msg.sender];
        return bids;
    }

    function withdraw() public onlyOwner {
        payable(owner()).sendValue(address(this).balance);
    }

}