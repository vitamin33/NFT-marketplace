pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NftMarket is ERC721URIStorage {

    using Counters for Counters.Counter;

    Counters.Counter private _listedItems;
    Counters.Counter private _tokenIds;

    mapping(string => bool) private _usedTokenURIs;

    constructor() ERC721("Vitamin NFT Market", "VNFT") {}

    function mintToken(string memory tokenURI) public payable returns (uint) {
        require(!tokenUriExists(tokenURI), "Token URI already exists!");

        _tokenIds.increment();
        _listedItems.increment();
        uint newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        _usedTokenURIs[tokenURI] = true;
        return newTokenId;
    }

    function tokenUriExists(string memory tokenURI) private returns (bool) {
        return _usedTokenURIs[tokenURI] == true;
    }
}
