import arbitrumABI from './mintContractABIs/arbitrum.json'
import avalancheABI from './mintContractABIs/avalanche.json'
import bscABI from './mintContractABIs/bsc.json'
import ethereumABI from './mintContractABIs/ethereum.json'
import { getChainById } from './supportedChains';
import Web3 from 'web3'
import { toast } from 'react-toastify';


export const mintContracts = {
    'Sepolia': {
        'address': '0x68B1Bb324BfC395626c48638DA019CC23d766f65',
        'abi': ethereumABI
    },
    'Binance Smart Chain Testnet': {
        'address': '0x1FCe84568ef3D4E30e10bb68d0E12e61F1D9Ac7D',
        'abi': bscABI
    },
    'Arbitrum Goerli': {
        'address': '0xaC87db196C1e1BfEe2578deD29d7511114dceb8F',
        'abi': arbitrumABI
    },
    'Avalanche Fuji Testnet': {
        'address': '0xbB2289bfbF477881FFd36d54c62A5321E3e24597',
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

export const mint = async (chainId, Uri, account) => {
    const selectedContract = getChainContract(chainId);
    const id = toast.loading('Minting...');
    try {
        if(window.ethereum){
            const web3 = new Web3(window.ethereum);
            const mintContract = new web3.eth.Contract(selectedContract.abi, selectedContract.address);
            const mintoTo = await mintContract.methods.mintTo(account, Uri).send({from: account});
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


