

const instance = await NftMarket.deployed();

instance.mintToken("https://gateway.pinata.cloud/ipfs/QmfTTA9oVumkATBQdz1iv2AcTvGbQ5uD64mY3yzNgH2PVP","500000000000000000", {value: "5000000000000000",from: accounts[0]})
instance.mintToken("https://gateway.pinata.cloud/ipfs/QmRAARbbTqo85urGv6jCAmBUvczSj6LncXvmfKjdg2bDQk","300000000000000000", {value: "5000000000000000",from: accounts[0]})