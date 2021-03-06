const truffleAssert = require('truffle-assertions');
const assert = require("assert");
const { ethers } = require('ethers');

const NftMarket = artifacts.require("NftMarket")

contract("NftMarket", accounts => {
    let _contract = null;
    let _nftPrice = ethers.utils.parseEther("0.3").toString();
    let _listingPrice = ethers.utils.parseEther("0.005").toString();

    before(async () => {
        _contract = await NftMarket.deployed();
        console.log(accounts);
    })

    describe("Mint token", () => {

        const tokenURI = "https://test.com"
        before(async () => {
            await _contract.mintToken(tokenURI, _nftPrice, {
                from: accounts[0],
                value: _listingPrice
            })
        })

        it("owner of first token should be address[0]", async () => {
            const owner = await _contract.ownerOf(1);

            assert.equal(owner, accounts[0], "Owner of token is not matching accounts[0]")
        })

        it("first token should point to the correct token URI", async () => {
            const actualTokenURI = await _contract.tokenURI(1);

            assert.equal(actualTokenURI, tokenURI, "Token URI is not correctly set")
        })
        it("should not be possible to create two NFTs with the same URI", async () => {
            await truffleAssert.fails(
                _contract.mintToken(tokenURI, _nftPrice, {
                    from: accounts[0],
                    _listingPrice
                }),
                truffleAssert.ErrorType.REVERT,
                "Token URI already exists!"
            );
        })
        it("should be one listed item", async () => {
            const listedItems = await _contract.listedItemsCount();

            assert.equal(listedItems.toNumber(), 1, "Listed item count is not 1")
        })
        it("should have create NFT item", async () => {
            const nft = await _contract.getNftItem(1);

            assert.equal(nft.tokenId, 1, "TokenId is not 1");
            assert.equal(nft.price, _nftPrice, "NFT item price is not correct");
            assert.equal(nft.creator, accounts[0], "Creator address is not correct");
            assert.equal(nft.isListed, true, "NFT item isListed parameter is not correct");
        })
    })

    describe("Buy NFT", () => {
        before(async () => {
            await _contract.buyNft(1, {
                from: accounts[1],
                value: _nftPrice
            })
        })

        it("should unlist the item", async () => {
            let listedItem = await _contract.getNftItem(1);
            assert.equal(listedItem.isListed, false, "Item is still listed");
        })
        it("should decreased listed item counts", async () => {
            let itemsCount = await _contract.listedItemsCount();
            assert.equal(itemsCount.toNumber(), 0, "Count of items should be decremented");
        })
        it("should change the owner", async () => {
            let owner = await _contract.ownerOf(1);
            assert.equal(owner, accounts[1], "Item is still listed");
        })
    })

    describe("Token transfers", () => {
        const tokenURI = "https://token-json2.com";
        before(async () => {
            await _contract.mintToken(tokenURI, _nftPrice, {
                from: accounts[0],
                value: _listingPrice
            })
        })
        it("should have two NFTs created", async () => {
            const totalSupply = await _contract.totalSupply();
            assert.equal(totalSupply.toNumber(), 2, "Total supply of token is not correct");
        })
        it("should be able to retrieve token by index", async () => {
            const tokenId1 = await _contract.tokenByIndex(0);
            const tokenId2 = await _contract.tokenByIndex(1);

            assert.equal(tokenId1.toNumber(), 1, "First token id is wrong");
            assert.equal(tokenId2.toNumber(), 2, "Second token id is wrong");
        })
        it("should have one listed NFT", async () => {
            const allNfts = await _contract.getAllNftsOnSale();

            assert.equal(allNfts[0].tokenId, 2, "Listed Nft has a wrong id");
        })
        it("account[1] should have one owned NFT", async () => {
            const ownedNfts = await _contract.getOwnedNfts({
                from: accounts[1]
            });

            assert.equal(ownedNfts[0].tokenId, 1, "Wrong amount of owned NFTs by account 1");
        })
        it("account[0] should have one owned NFT", async () => {
            const ownedNfts = await _contract.getOwnedNfts({
                from: accounts[0]
            });

            assert.equal(ownedNfts[0].tokenId, 2, "Wrong amount of owned NFTs by account 0");
        })
    })

    describe("Token transfer to new owner", () => {
        before(async () => {
            await _contract.transferFrom(
                accounts[0],
                accounts[1],
                2
            )
        })

        it("account[0] should own 0 tokens", async () => {
            const ownedNfts0 = await _contract.getOwnedNfts({
                from: accounts[0]
            })
            assert.equal(ownedNfts0.length, 0, "Invalid length of tokens for account[0]");
        })
        it("account[1] should own 2 tokens", async () => {
            const ownedNfts1 = await _contract.getOwnedNfts({
                from: accounts[1]
            })
            assert.equal(ownedNfts1.length, 2, "Invalid length of tokens for account[1]");
        })
    })

    describe("Burn token", () => {
        const tokenURI3 = "https://token-json3.com";
        before(async () => {
            await _contract.mintToken(tokenURI3, _nftPrice, {
                from: accounts[2],
                value: _listingPrice
            })
        })

        it("account[2] should have one owned NFT", async () => {
            const ownedNfts = await _contract.getOwnedNfts({ from: accounts[2] });

            assert.equal(ownedNfts[0].tokenId, 3, "Wrong amount of owned NFTs by account[2]");
        })
        it("account[2] should owned 0 NFTs", async () => {
            await _contract.burnToken(3, { from: accounts[2] });
            const ownedNfts = await _contract.getOwnedNfts({ from: accounts[2] });

            assert.equal(ownedNfts.length, 0, "Owned nft length should be 0");
        })
    })

    describe("List an NFT", () => {
        before(async () => {
            await _contract.placeNftOnSale(1, _nftPrice, {
                    from: accounts[1], value: _listingPrice
                })
        })

        it("should have 2 listed items", async () => {
            const allNfts = await _contract.getAllNftsOnSale();
            console.log(allNfts)

            assert.equal(allNfts.length, 3, "Wrong length of listed NFTs");
        })
        it("should set new listing price", async () => {
            await _contract.setListingPrice(_listingPrice);
            const listingPrice = await _contract.listingPrice();

            assert.equal(listingPrice.toString(), _listingPrice, "Wrong listing price.");
        })
    })
})