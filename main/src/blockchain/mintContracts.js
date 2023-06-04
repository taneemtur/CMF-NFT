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
import { getChainById } from './supportedChains';
import Web3 from 'web3'
import { toast } from 'react-toastify';
import { switchChain } from '../utils'



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
            return {'code': 200, 'data': currentContract};
        }else{
            toast.error('Metamask Not installed');
            return {'code': 404};
        }
    } catch (error) {
        toast.error(error);
        return {'code': 404};
    }
}

export const deployContract = async (account, chain, contractName, URI) => {
    await switchChain(chain);
    const selectedContract = await getfactoryContract(chain);
    const contract = await initContract(selectedContract);
    const contractAddress = await contract.data.methods.deployERC1155(contractName, URI).send({from: account});
    return contractAddress.events.ERC1155Created.returnValues.tokenContract;
}

export const mint = async (chainId, account) => {
    const selectedContract = getfactoryContract(chainId);
    const id = toast.loading('Minting...');
    try {
        if(window.ethereum){
            const web3 = new Web3(window.ethereum);
            const mintContract = new web3.eth.Contract(selectedContract.abi, selectedContract.address);
            const mintoTo = await mintContract.methods.mint().send({from: account});
            toast.update(id, {
                render: `Minted Successfull.`, closeOnClick: true, type: 'success', autoClose: 5000, isLoading: false, closeButton: true
              });
            return {'code': 200, data: mintoTo};
        }else{
            toast.update(id, {
                render: `Metamask Not Installed.`, closeOnClick: true, type: 'error', autoClose: 5000, isLoading: false, closeButton: true
              });
        }
    } catch (error) {
        toast.update(id, {
            render: `${error.message}.`, closeOnClick: true, type: 'error', autoClose: 5000, isLoading: false, closeButton: true
        });
    }
}


