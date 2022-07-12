pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NftMarket is ERC721URIStorage {

    using Counters for Counters.Counter;

    struct NftItem {
        uint tokenId;
        uint price;
        address creator;
        bool isListed;
    }

    uint public listingPrice = 0.005 ether;

    Counters.Counter private _listedItems;
    Counters.Counter private _tokenIds;

    uint256[] private _allNfts;

    mapping(string => bool) private _usedTokenURIs;
    mapping(uint => NftItem) private _idToNftItem;

    mapping(uint => uint) private _idToNftIndex;

    event NftItemCreated(
        uint tokenId,
        uint price,
        address creator,
        bool isListed
    );

    constructor() ERC721("Vitamin NFT Market", "VNFT") {}

    function totalSupply() public view returns(uint) {
        return _allNfts.length;
    }

    function tokenByIndex(uint index) public view returns(uint) {
        require(index < totalSupply(), "Index out of the bounds");

        return _allNfts[index];
    }

    function mintToken(string memory tokenURI, uint price) public payable returns (uint) {
        require(!tokenUriExists(tokenURI), "Token URI already exists!");
        require(msg.value == listingPrice, "Price must be equal to listing price");

        _tokenIds.increment();
        _listedItems.increment();
        uint newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        _createNftItem(newTokenId, price);
        _usedTokenURIs[tokenURI] = true;

        return newTokenId;
    }

    function _createNftItem(
        uint tokenId,
        uint price
    ) private {
        require(price > 0, "Price must be at least 1 wei");

        _idToNftItem[tokenId] = NftItem(
            tokenId,
            price,
            msg.sender,
            true
        );

        emit NftItemCreated(tokenId, price, msg.sender, true);
    }

    function buyNft(uint tokenId) public payable {
        uint price = _idToNftItem[tokenId].price;
        address owner = ERC721.ownerOf(tokenId);

        require(msg.sender != owner, "You already own this NFT item");
        require(msg.value == price, "Please submit the asking price");

        _idToNftItem[tokenId].isListed = false;
        _listedItems.decrement();

        ERC721._transfer(owner, msg.sender, tokenId);
        payable(owner).transfer(msg.value);
    }

    function getNftItem(uint tokenId) public view returns (NftItem memory) {
        return _idToNftItem[tokenId];
    }

    function listedItemsCount() public view returns (uint) {
        return _listedItems.current();
    }

    function tokenUriExists(string memory tokenURI) private returns (bool) {
        return _usedTokenURIs[tokenURI] == true;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint tokenId
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId);

        if (from == address(0)) {
            _addTokenToAllTokensEnumeration(tokenId);
        }
    }

    function _addTokenToAllTokensEnumeration(uint tokenId) private {
        _idToNftIndex[tokenId] = _allNfts.length;
        _allNfts.push(tokenId);
    }
}
