import { getChainById } from "./blockchain/supportedChains";

export const splitWalletAddress = (address) => {
    const start = address?.substring(0, 5);
    const end = address?.substring(address.length - 5, address.length);
    return `${start}...${end}`;
}

export const switchChain = async (chainId) => {
    const chainParam = getChainById(chainId)
    try {
        await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainId }],
        });
    } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
        try {
            await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [chainParam],
            });
        } catch (addError) {
            // handle "add" error
        }
        }
        // handle other "switch" errors
    }
}