import Moralis from 'moralis'
export default async function handler(address,chain){
    if(!Moralis.Core.isStarted){
      await Moralis.start({
        apiKey: "fdQEQwN8qXkOgmFBbfcntw1YXu5X7U5uZF71TirnKn685jF9STbYgvl8swRA1GUS"
      });
    }try {
      console.log(chain)
      console.log(address)
      const response = await Moralis.EvmApi.nft.getWalletNFTs({
        "chain": chain,
        "format": "decimal",
        "normalizeMetadata": true,
        "tokenAddresses": [],
        "mediaItems": false,
        "address": address
      });
      
      console.log(response.raw);
      // res.status(200).json(response.raw);
      return response.raw 
    } catch (error) {
      // res.status(400).json(error);
      return error
    }
}
  