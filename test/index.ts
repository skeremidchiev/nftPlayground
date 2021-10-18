// import { expect } from "chai";
import { ethers } from "hardhat";

describe("NFT", function () {
  it("NFT playground", async function () {
    const [owner, nftOwner, buyer] = await ethers.getSigners();
    console.log(owner.address, nftOwner.address, buyer.address);

    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.connect(owner).deploy(
      "https://sometokenDB/token/",
      "NFT",
      "NFT"
    );
    await nft.deployed();

    await nft
      .connect(nftOwner)
      .mint("peshos_art", "pesho", "cheren_kvadrat", 1);

    const mintedFilter = nft.filters.Minted();
    const events = await nft.queryFilter(mintedFilter, "latest");
    const nftID = events[0].args.nftID.toString();
    console.log("NFT ID:", nftID);

    const nft1 = await nft.get(nftID);
    console.log("NFT:", nft1);

    let nftOwnerAddress = await nft.ownerOf(nftID);
    console.log("NFT owner: ", nftOwnerAddress);

    await nft.connect(buyer).trade(nftID, { value: 1 });

    nftOwnerAddress = await nft.ownerOf(nftID);
    console.log("NFT owner: ", nftOwnerAddress);
  });
});
