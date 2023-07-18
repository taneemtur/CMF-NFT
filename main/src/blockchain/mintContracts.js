import marketEth from './marketPlaceABIs/marketEth.json'
import marketBsc from './marketPlaceABIs/marketBsc.json'
import marketArb from './marketPlaceABIs/marketArb.json'
import marketAvax from './marketPlaceABIs/marketAvax.json'
// marketpalces contract abis above
import factoryEth from './factoryABIs/factoryEth.json'
import factoryBsc from './factoryABIs/factoryBsc.json'
import factoryArb from './factoryABIs/factoryArb.json'
import factoryAvax from './factoryABIs/factorryAvax.json'
// factory contract abis above
import usdtETH from './usdtABIs/usdtEth.json'
import usdtBsc from './usdtABIs/usdtBsc.json'
import usdtArb from './usdtABIs/usdtArb.json'
import usdtAvax from './usdtABIs/usdtAvax.json'
// usdt contract abis above
import collectioABI from './collectionABI/collection.json'
import { getChainById } from './supportedChains';
import Web3 from 'web3'
import { toast } from 'react-toastify';
import { switchChain } from '../utils'

const zeroAddress = '0x0000000000000000000000000000000000000000';

export const marketplaceContracts = {
    'Sepolia': {
        'address': '0x1dee9011a41Ab1251Ca10A3398f50c9a7434a9ef',
        'abi': marketEth
    },
    'Binance Smart Chain Testnet': {
        'address': '0x1F1588C94a9D14a56C9f7b45a21edD16405c2Ad9',
        'abi': marketBsc
    },
    'Arbitrum Goerli': {
        'address': '0x3e3f0c65Aa7Ad8b6dADb74fd1C88600e16573086',
        'abi': marketArb
    },
    'Avalanche Fuji Testnet': {
        'address': '0x269B96dC744772a7638f205057828641565D5602',
        'abi': marketAvax
    }
};

export const factoryContracts = {
    'Sepolia': {
        'address': '0xCA8d956579d6220b8527e79F76894f645B60B07d',
        'abi': factoryEth
    },
    'Binance Smart Chain Testnet': {
        'address': '0x5Ce69143F7bECFe2a229E89a0e2bd943929164a8',
        'abi': factoryBsc
    },
    'Arbitrum Goerli': {
        'address': '0xCA8d956579d6220b8527e79F76894f645B60B07d',
        'abi': factoryArb
    },
    'Avalanche Fuji Testnet': {
        'address': '0xDA880dD37Dc8780c09220E6d67F674260bFCD876',
        'abi': factoryAvax
    }
};

export const usdtContracts = {
    'Sepolia': {
        'address': '0x597DE5C3200b9A73596c963466aB5Fb05eC1a9FD',
        'abi': usdtETH
    },
    'Binance Smart Chain Testnet': {
        'address': '0x597DE5C3200b9A73596c963466aB5Fb05eC1a9FD',
        'abi': usdtBsc
    },
    'Arbitrum Goerli': {
        'address': '0x56f00dD6b1c8013fE51A8fc286363E70CC19f5a4',
        'abi': usdtArb
    },
    'Avalanche Fuji Testnet': {
        'address': '0x5Ce69143F7bECFe2a229E89a0e2bd943929164a8',
        'abi': usdtAvax
    }
};


// most important function for multichain, comparing supportedchains and mintContract for minting
export const getfactoryContract = (chain) => {
    const selectedChain = getChainById(chain)
    let contractData;
    Object.keys(factoryContracts).find(function (chain) {
        if(chain === selectedChain.chainName){
            contractData = factoryContracts[chain]
        }
    });
    return contractData;
}

export const getMarketplaceContract = (chain) => {
    const selectedChain = getChainById(chain)
    let contractData;
    Object.keys(marketplaceContracts).find(function (chain) {
        if(chain === selectedChain.chainName){
            contractData = marketplaceContracts[chain]
        }
    });
    return contractData;
}

export const getUSDTContract = (chain) => {
    const selectedChain = getChainById(chain)
    let contractData;
    Object.keys(usdtContracts).find(function (chain) {
        if(chain === selectedChain.chainName){
            contractData = usdtContracts[chain]
        }
    });
    return contractData;
}

export const initContract = (selectedContract) => {
    try {
        if(window.ethereum){
            const web3 = new Web3(window.ethereum);
            const currentContract = new web3.eth.Contract(selectedContract.abi, selectedContract.address);
            return currentContract
        }else{
            toast.error('Metamask Not installed');
        }
    } catch (error) {
        toast.error(error);
    }
}

export const convertToWei = (price) => {
    try {
        if(window.ethereum){
            const web3 = new Web3(window.ethereum);
            const weiPrice = web3.utils.toWei(price, "ether");
            return weiPrice
        }else{
            toast.error('Metamask Not installed');
        }
    } catch (error) {
        toast.error(error);
    }
}

export const deployContract = async (account, chain, contractName, URI) => {
    await switchChain(chain);
    const selectedContract = await getfactoryContract(chain);
    const contract = await initContract(selectedContract);
    const contractAddress = await contract.methods.deployERC1155(contractName, URI).send({from: account});
    return contractAddress.events.ERC1155Created.returnValues.tokenContract;
}

export const mint = async (chainId, collectionAddress, account, tokenId, supply) => {
    console.log(chainId, collectionAddress, account, tokenId, supply)
    await switchChain(chainId);
    const selectedContract = { 'address': collectionAddress, 'abi': collectioABI }
    const contract = await initContract(selectedContract);
    const mintItem = await contract.methods.mint(account, tokenId, supply).send({from: account})
    return mintItem;
}

export const approveCollection = async (account, chainId, collectionAddress) => {
    await switchChain(chainId);
    const marketplaceAddress = getMarketplaceContract(chainId);
    const selectedContract = { 'address': collectionAddress, 'abi': collectioABI }
    const contract = await initContract(selectedContract);
    const approve = await contract.methods.setApprovalForAll(marketplaceAddress.address, true).send({from: account})
    return approve;
}

export const approveUSDT = async (account, chainId, price) => {
    await switchChain(chainId);
    const marketplaceAddress = getMarketplaceContract(chainId);
    const selectedContract = getUSDTContract(chainId);
    const contract = await initContract(selectedContract);
    const approve = await contract.methods.approve(marketplaceAddress.address, convertToWei(price)).send({from: account})
    return approve;
}

export const listNFT = async (paymentToken, tokenId, amount, price, nftCollectionAddress, chainId, account) => {
    console.log(paymentToken, tokenId, amount, price, nftCollectionAddress, chainId, account)
    await switchChain(chainId);
    const usdt = await getUSDTContract(chainId)
    paymentToken == 'Eth' ? paymentToken = zeroAddress : paymentToken = usdt.address;
    const selectedContract = await getMarketplaceContract(chainId);
    const contract = await initContract(selectedContract);
    const list = await contract.methods.listItemForFixedPrice(paymentToken, tokenId, amount, convertToWei(price), nftCollectionAddress).send({from: account})
    console.log(list.events.OfferSale.returnValues._fixeditemid)
    return list.events.OfferSale.returnValues._fixeditemid;
}

export const listAuctionNFT = async (price, startAuctionTime, endAuctionTime, tokenId, amount, nftCollectionAddress, paymentToken, chainId, account) => {
    await switchChain(chainId);
    const usdt = await getUSDTContract(chainId)
    paymentToken == 'Eth' ? paymentToken = zeroAddress : paymentToken = usdt.address;
    const selectedContract = await getMarketplaceContract(chainId);
    const contract = await initContract(selectedContract);
    const list = await contract.methods.listItemForAuction(convertToWei(price), startAuctionTime, endAuctionTime , tokenId, amount, nftCollectionAddress, paymentToken).send({from: account})
    console.log(list.events.AuctionStart.returnValues._auctionid)
    return list.events.AuctionStart.returnValues._auctionid;
}

export const listingCancel = async (listingId, chainId, account) => {
    await switchChain(chainId);
    const selectedContract = await getMarketplaceContract(chainId);
    const contract = await initContract(selectedContract);
    const cancel = await contract.methods.cancelListing(listingId).send({from: account})
    return cancel;
}

export const buyNFT = async (listingId, price, chainId, account) => {
    await switchChain(chainId);
    const selectedContract = await getMarketplaceContract(chainId);
    const contract = await initContract(selectedContract);
    console.log(listingId, convertToWei(price));
    const buy = await contract.methods.BuyFixedPriceItem(listingId).send({from: account, value: convertToWei(price)})
    return buy;
}

export const bid = async (tokenId, price, chainId, account) => {
    await switchChain(chainId);
    const selectedContract = await getMarketplaceContract(chainId);
    const contract = await initContract(selectedContract);
    const bid = await contract.methods.bid(tokenId, convertToWei(price)).send({from: account, value: convertToWei(price)})
    return bid;
}

export const claimNFT = async (tokenId, chainId, account) => {
    await switchChain(chainId);
    const selectedContract = await getMarketplaceContract(chainId);
    const contract = await initContract(selectedContract);
    const claimNft = await contract.methods.claimNft(tokenId).send({from: account})
    return claimNft;
}

export const claimReward = async (tokenId, chainId, account) => {
    await switchChain(chainId);
    const selectedContract = await getMarketplaceContract(chainId);
    const contract = await initContract(selectedContract);
    const claimReward = await contract.methods.auctionEndAndClaimReward(tokenId).send({from: account})
    return claimReward;
}

