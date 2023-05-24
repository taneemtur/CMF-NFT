import arbitrumABI from './mintContractABIs/arbitrum.json'
import avalancheABI from './mintContractABIs/avalanche.json'
import bscABI from './mintContractABIs/bsc.json'
import ethereumABI from './mintContractABIs/ethereum.json'
import { getChainById } from './supportedChains';
import Web3 from 'web3'
import { toast } from 'react-toastify';


export const mintContracts = {
    'Sepolia': {
        'address': '0x299B2750e4e4E7D0AEF80E7982cEd219a5E48428',
        'abi': ethereumABI
    },
    'Binance Smart Chain Testnet': {
        'address': '0x7CD14887C1eA9bfd1a1417dC293df13f31Db6659',
        'abi': bscABI
    },
    // 'Arbitrum Goerli': {
    //     'address': '0xaC87db196C1e1BfEe2578deD29d7511114dceb8F',
    //     'abi': arbitrumABI
    // },
    'Avalanche Fuji Testnet': {
        'address': '0xaF7f34022AdfEfCcfaFFc83186a85d8B446E31d9',
        'abi': avalancheABI
    }
};

// most important function for multichain, comparing supportedchains and mintContract for minting
export const getChainContract = (chain) => {
    const selectedChain = getChainById(chain)
    let contractData;
    Object.keys(mintContracts).find(function (chain) {
        if(chain === selectedChain.chainName){
            contractData = mintContracts[chain]
        }
    });
    return contractData;
}

export const mint = async (chainId, account) => {
    const selectedContract = getChainContract(chainId);
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


