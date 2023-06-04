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
import collectioABI from './collectionABI/collection.json'
import { getChainById } from './supportedChains';
import Web3 from 'web3'
import { toast } from 'react-toastify';
import { switchChain } from '../utils'

const zeroAddress = '0x0000000000000000000000000000000000000000';

export const marketplaceContracts = {
    'Sepolia': {
        'address': '0x5Ce69143F7bECFe2a229E89a0e2bd943929164a8',
        'abi': marketEth
    },
    'Binance Smart Chain Testnet': {
        'address': '0xb6503f4dB938A6e66e00385116e6cE397f756Bba',
        'abi': marketBsc
    },
    'Arbitrum Goerli': {
        'address': '0x5Ce69143F7bECFe2a229E89a0e2bd943929164a8',
        'abi': marketArb
    },
    'Avalanche Fuji Testnet': {
        'address': '0xb6503f4dB938A6e66e00385116e6cE397f756Bba',
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

export const listNFT = async (paymentToken, tokenId, amount, price, nftCollectionAddress, chainId, account) => {
    paymentToken == 'Eth' ? paymentToken = zeroAddress : paymentToken = 'USDT';
    await switchChain(chainId);
    const selectedContract = await getMarketplaceContract(chainId);
    const contract = await initContract(selectedContract);
    const list = await contract.methods.listItemForFixedPrice(paymentToken, tokenId, amount, convertToWei(price), nftCollectionAddress).send({from: account})
    console.log(list.events.OfferSale.returnValues._fixeditemid)
    return list.events.OfferSale.returnValues._fixeditemid;
}

export const listingCancel = async (listingId, chainId, account) => {
    await switchChain(chainId);
    const selectedContract = await getMarketplaceContract(chainId);
    const contract = await initContract(selectedContract);
    const cancel = await contract.methods.cancelListing(listingId).send({from: account})
    return cancel;
}

export const buyNFT = async (listingId, chainId, account) => {
    await switchChain(chainId);
    const selectedContract = await getMarketplaceContract(chainId);
    const contract = await initContract(selectedContract);
    const buy = await contract.methods.BuyFixedPriceItem(listingId).send({from: account})
    return buy;
}

