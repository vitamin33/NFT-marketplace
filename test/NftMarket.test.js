const truffleAssert = require('truffle-assertions');
const assert = require("assert");
const { ethers } = require('ethers');

const NftMarket = artifacts.require("NftMarket")

contract("NftMarket", accounts => {
    let _contract = null;
    let _nftPrice = ethers.utils.parseEther("0.3").toString();

    before(async () => {
        _contract = await NftMarket.deployed();
        console.log(accounts);
    })

    describe("Mint token", () => {

        const tokenURI = "https://test.com"
        before(async () => {
            await _contract.mintToken(tokenURI, _nftPrice, {
                from: accounts[0]
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
           // try {
           //     await _contract.mintToken(tokenURI, {
           //         from: accounts[0]
           //     })
           // } catch (e) {
           //     assert(e, "NFT was minted with previously used token URI")
           // }

            await truffleAssert.fails(
                _contract.mintToken(tokenURI, _nftPrice, {
                    from: accounts[0]
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
})