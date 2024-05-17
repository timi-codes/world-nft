// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract ContinentToken is ERC721Enumerable, Ownable {
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    using Address for address payable;
    using Strings for uint256;
    using Strings for uint8;


    Counters.Counter private _tokenIds;
    // The max number of NFTs in the collection 7 representing Africa, Asia, Europe, North America, South America, Australia, and Antarctica
    uint256 public constant MAX_SUPPLY = 7;

    uint256 public teamFee = 0.01 ether;

    string public baseTokenURI;

    struct Continent {
        string name;
        string metadataURI;
        address owner;
        address[] citizens;
        uint256 citizenTax;
    }

    mapping(uint256 => Continent) public continents;


    event ContinentCreated(uint256 indexed tokenId, string name, string metadataURI);
    event CitizenshipPurchased(uint256 indexed tokenId, address indexed citizen);
    event ContinentTransfered(address indexed from, address indexed to, uint256 indexed tokenId);

    constructor(string memory name, string memory symbol, string memory _baseTokenURI) ERC721(name, symbol) {
        baseTokenURI = _baseTokenURI;
        _initializeContinents();
    }

    function _initializeContinents() private {
        _createContinent("Africa");
        _createContinent("Antarctica");
        _createContinent("Asia");
        _createContinent("Europe");
        _createContinent("North America");
        _createContinent("Oceania");
        _createContinent("South America");
    }

    function _createContinent(string memory _name) private {
        require(_tokenIds.current() < MAX_SUPPLY, "Max supply reached");

        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        _safeMint(address(this), tokenId);

        continents[tokenId] = Continent({
            name: string(abi.encodePacked(_name, " #", tokenId.toString())),
            metadataURI: tokenURI(tokenId),
            owner: address(this),
            citizens: new address[](0),
            citizenTax: 0
        });

        emit ContinentCreated(tokenId, _name, tokenURI(tokenId));
    }

    function transferTokenFromContract(uint256 _tokenId, address _to) external onlyOwner {
        require(ownerOf(_tokenId) == address(this), "Token is not owned by the contract");
        _transfer(address(this), _to, _tokenId);
        continents[_tokenId].owner = _to;

        emit ContinentTransfered(address(this), _to, _tokenId);
    }

    function transferContinent(uint256 _tokenId, address _to) external payable {
        address previousOwner = ownerOf(_tokenId);
        require(previousOwner == msg.sender, "You are not the owner of this continent");
        require(msg.value >= teamFee, "Not enough Ether sent to cover team fee");
        
        _transfer(previousOwner, _to, _tokenId);

        if(msg.sender != owner()){
            Address.sendValue(payable(owner()), teamFee);
        }

        continents[_tokenId].owner = _to;

        emit ContinentTransfered(previousOwner, _to, _tokenId);
    }

    function getAllContinents() public view returns (uint256[] memory, string[] memory, string[] memory, address[] memory, uint256[] memory) {
        uint256 totalContinents = totalSupply();
        uint256[] memory tokenIds = new uint256[](totalContinents);
        string[] memory names = new string[](totalContinents);
        string[] memory metadataURIs = new string[](totalContinents);
        address[] memory owners = new address[](totalContinents);
        uint256[] memory citizenTaxes = new uint256[](totalContinents);

        for (uint256 i = 0; i < totalContinents; i++) {
            tokenIds[i] = tokenByIndex(i);
            names[i] = continents[tokenIds[i]].name;
            metadataURIs[i] = continents[tokenIds[i]].metadataURI;
            owners[i] = continents[tokenIds[i]].owner;
            citizenTaxes[i] = continents[tokenIds[i]].citizenTax;
        }

        return (tokenIds, names, metadataURIs, owners, citizenTaxes);
    }

    function getContinentOwner(uint256 _tokenId) external view returns (address) {
        return ownerOf(_tokenId);
    }

    function buyCitizenship(uint256 _tokenId) external payable {
        require(ownerOf(_tokenId) != address(0), "Continent does not exist");
        require(ownerOf(_tokenId) != msg.sender, "You already own this continent");
        require(msg.value >= continents[_tokenId].citizenTax, "Not enough Ether sent to cover citizenship tax");

        payable(ownerOf(_tokenId)).sendValue(msg.value);
        continents[_tokenId].citizens.push(msg.sender);

        emit CitizenshipPurchased(_tokenId, msg.sender);
    }

    function setCitizenTax(uint256 _tokenId, uint256 _citizenTax) external {
        require(ownerOf(_tokenId) == msg.sender, "You are not the owner of this continent");
        continents[_tokenId].citizenTax = _citizenTax;
    } 

    function getCitizens(uint256 _tokenId) external view returns (address[] memory) {
        return continents[_tokenId].citizens;
    }

    function setTeamFee(uint256 _newTeamFee) external onlyOwner {
        teamFee = _newTeamFee;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function setBaseURI(string memory _baseTokenURI) public onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory){
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory currentBaseURI = _baseURI();
        return bytes(currentBaseURI).length > 0
            ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), ".json"))
            : "";
    }

    function withdraw() external onlyOwner {
        payable(owner()).sendValue(address(this).balance);
    }
}

