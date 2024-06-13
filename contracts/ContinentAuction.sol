// SPDX-License-Identifier: MIT
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

    enum AuctionStatus { Pending, Open, Closed }

    struct Auction {
        uint256 tokenId; // id of the auction token 
        uint256 bidIncrement; // the minimum bid increment
        AuctionStatus status; // the status of the auction (Pending, Open, Closed)

        uint256 highestBid; // the current highest bid amount
        BidItem[] bids; // the auction bids
        address highestBidder; // the account with the current highest bid

        uint256 startTime; // the time the auction started
        uint256 endTime; // the time the auction ended
    }

    struct BidItem {
        uint256 amount; // bid price in wei
        uint256 timestamp; // timestamp of bid
        address bidder; // address of bidder
    }

    mapping(uint256 => Auction) public auctions;

    ContinentToken public continentTokenContract;

    event BidPlaced(address indexed bidder, uint256 tokenId, uint256 amount, uint256 timestamp);
    event AuctionEnded(address indexed winner, uint256 tokenId, uint256 amount);
    event AuctionStarted(uint256 indexed tokenId, uint256 startTime, uint256 endTime);

    constructor(address _continentToken) {
        continentTokenContract = ContinentToken(_continentToken);
    }

    function createAuction(uint256 _tokenId, uint256 _startPrice, uint256 _bidIncrement, uint256 _duration) public onlyOwner {
        
        uint256 endTime = (block.timestamp + _duration);

        require(continentTokenContract.ownerOf(_tokenId) == address(continentTokenContract), "Continent not in contract");
        require(auctions[_tokenId].endTime == 0 && auctions[_tokenId].status != AuctionStatus.Open, "Auction already exists");
        require(endTime > block.timestamp, "End time must be in the future");

        auctions[_tokenId].tokenId = _tokenId;
        auctions[_tokenId].bidIncrement = _bidIncrement;
        auctions[_tokenId].highestBid = _startPrice; 
        auctions[_tokenId].highestBidder = address(0);
        auctions[_tokenId].startTime = block.timestamp;
        auctions[_tokenId].endTime = endTime;
        auctions[_tokenId].status = AuctionStatus.Open;

        emit AuctionStarted(_tokenId, auctions[_tokenId].startTime, auctions[_tokenId].endTime);
    }

    function endAuction(uint256 _tokenId) public onlyOwner {
        Auction storage auction = auctions[_tokenId];

        require(auction.endTime > 0 && auction.status != AuctionStatus.Pending, "Auction not started");
        require(auction.endTime <= block.timestamp, "Auction not ended yet");

        auction.status = AuctionStatus.Closed;
        continentTokenContract.safeTransferFrom(address(this), auction.highestBidder, _tokenId);

        emit AuctionEnded(auction.highestBidder, _tokenId, auction.highestBid);
    }

    function setAuctionStatus(uint256 _tokenId, AuctionStatus _status) public onlyOwner {
        auctions[_tokenId].status = _status;
    }

    function getAuction(uint256 _tokenId) public view returns (uint256, uint256, uint256, uint256, uint256, AuctionStatus, address) {
        return (_tokenId, auctions[_tokenId].bidIncrement, auctions[_tokenId].highestBid, auctions[_tokenId].startTime, auctions[_tokenId].endTime, auctions[_tokenId].status, auctions[_tokenId].highestBidder);
    }

    function placeBid(uint256 _tokenId) public payable {

        uint256 bidTime = block.timestamp;

        require(bidTime < auctions[_tokenId].endTime, "Auction ended or not started");
        require(continentTokenContract.balanceOf(msg.sender) < MAX_PURCHASE_PER_WALLET, "You already own a continent");

        uint256 nextMinimumBid = auctions[_tokenId].highestBid + auctions[_tokenId].bidIncrement;
        require(msg.value >= nextMinimumBid, "Bid must be higher than current bid by at least the bid increment");

        // Refund the previous highest bid
        if (auctions[_tokenId].highestBidder != address(0)) {
            address payable previousBidder = payable(auctions[_tokenId].highestBidder);
            previousBidder.sendValue(auctions[_tokenId].highestBid);
        }

        auctions[_tokenId].highestBid = msg.value;
        auctions[_tokenId].highestBidder = msg.sender;

        auctions[_tokenId].bids.push(BidItem({
            amount: msg.value,
            timestamp: bidTime,
            bidder: msg.sender
        }));

        emit BidPlaced(msg.sender, _tokenId, msg.value, bidTime);
    }

    function getBids(uint256 _tokenId) public view returns (BidItem[] memory) {
        BidItem[] memory bids = auctions[_tokenId].bids;
        return bids;
    }

    function withdraw() public onlyOwner {
        payable(owner()).sendValue(address(this).balance);
    }

}