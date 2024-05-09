pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract ContinentToken is ERC721Enumerable, Ownable {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    // The max number of NFTs in the collection 7 representing Africa, Asia, Europe, North America, South America, Australia, and Antarctica
    uint256 public constant MAX_SUPPLY = 7;

    uint256 public teamFeePercentage = 5; // 5%

    string public baseTokenURI;

    struct Continent {
        string name;
        string metadataURI;
        address owner;
        address[] citizens;
        uint256 citizenTax;
    }

    mapping(uint256 => Continent) public continents;


    event CitizenshipPurchased(uint256 indexed tokenId, address indexed citizen);

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        _initializeContinents();
    }

    function _initializeContinents() private {
        _createContinent("Africa", "ipfs://QmXup9MMVfLpwNhT7D1cWTnqioKXhKm9MtzqkGkFczBf9d");
        _createContinent("Asia", "ipfs://QmWzjUfTMERpJ1eSJekV1gM8W2sXgHPFfW5PfTTN5PJKkW");
        _createContinent("Europe", "ipfs://QmYfnw9U1V8y2c6cNUrjM7E15RkTR5urCgHrBn8aFg9muK");
        _createContinent("North America", "ipfs://Qmaz5vYVc4YNARcvQQyJQFKs2m7ZzFbDNwufVgA5GZyryY");
        _createContinent("South America", "ipfs://QmUanE2fbAdMxAWt7eok7AG9FtDcWQGxue7yMdoBkN6j3X");
        _createContinent("Australia", "ipfs://QmZ6QuYUCi3z3YqBuV8X1p7vqJt7cPyYNEJ6M6WjAFkbvS");
        _createContinent("Antarctica", "ipfs://QmNqznNNymXDJ4T1soN2M9hDhzUxmxTFzJ5V8EQ6q2vzRe");
    }

    function _createContinent(string memory _name, string memory _metadataURI) private {
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();

        require(tokenId <= MAX_SUPPLY, "The continent collection is fully minted!");

        continents[tokenId] = Continent(_name, _metadataURI, address(0), new address[](0));
        _safeMint(address(this), tokenId);
    }

    function transferContinent(uint256 _tokenId, address _to) external {
        require(_to != address(0), "Invalid address");
        require(_to != ownerOf(_tokenId), "Cannot transfer to the current owner");
        require(_to != address(this), "Cannot transfer to the contract itself");
        require(msg.sender == ownerOf(_tokenId), "Not the owner of the continent");
    
        // Transfer the continent to the new owner
        address tokenOwner = ownerOf(_tokenId);
        safeTransferFrom(tokenOwner, _to, _tokenId);

        // Transfer team fee to the contract owner
        address payable teamFeeRecipient = payable(owner());
        uint256 teamFee = (teamFeePercentage * continents[_tokenId].citizens.length) / 100;
        teamFeeRecipient.sendValue(teamFee);

        continents[_tokenId].owner = _to;

        emit ContinentTransferred(_tokenId, tokenOwner, _to);
    }

    function getAllContinents() external view returns (address[] memory) {
        return continents;
    }

    function buyCitizenship(uint256 _tokenId) external payable {
        require(ownerOf(_tokenId) != address(0), "Continent does not exist");
        require(msg.value == continents[_tokenId].citizenTax, "Not enough ether to purchase citizenship");

        address tokenOwner = ownerOf(_tokenId);
        require(tokenOwner.sendValue(fee), "Transfer failed");

        continents[_tokenId].citizens.push(msg.sender);

        emit CitizenshipPurchased(_tokenId, msg.sender);
    }

    function setCitizenshipTax(uint256 _tokenId, uint256 _citizenshipTax) external {
        require(ownerOf(_continentId) == msg.sender, "You are not the owner of this continent");
        continents[_tokenId].citizenshipTax = _citizenshipTax;
    }

    function getCitizens(uint256 _tokenId) external view returns (address[] memory) {
        return continents[_tokenId].citizens;
    }

    function setTeamFeePercentage(uint256 _newTeamFeePercentage) external onlyOwner {
        require(_newTeamFeePercentage <= 100, "Percentage must be less than or equal to 100");
        teamFeePercentage = _newTeamFeePercentage;
    }
    
    // Withdraw the ether in the contract
    function withdrawTeamFee() public payable onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ether left to withdraw");

        (bool success, ) = (msg.sender).call{value: balance}("");
        require(success, "Transfer failed.");
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function setBaseURI(string memory _baseTokenURI) public onlyOwner {
        baseTokenURI = _baseTokenURI;
    }
}

