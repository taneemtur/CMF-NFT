export const supportedChains = [
    {
        "chainId": '0xaa36a7',
        "chainName": "Sepolia",
        "rpcUrls": [
            'https://rpc.sepolia.org',
            'https://eth-sepolia.public.blastapi.io'
        ],
        "nativeCurrency": {
            'name': 'Eth',
            'symbol': 'eth',
            'decimals': 18,
        }
    },
    {
        "chainId": '0x61',
        "chainName": "Binance Smart Chain Testnet",
        "rpcUrls": [
            'https://bsc-testnet.publicnode.com',
            'https://bsc-testnet.public.blastapi.io'
        ],
        "nativeCurrency": {
            'name': 'tBNB',
            'symbol': 'tBNB',
            'decimals': 18,
        }
    },
    {
        "chainId": '0x66eed',
        "chainName": "Arbitrum Goerli",
        "rpcUrls": [
            'https://arb-goerli.g.alchemy.com/v2/demo',
            'https://arbitrum-goerli.public.blastapi.io',
        ],
        "nativeCurrency": {
            'name': 'AGOR',
            'symbol': 'AGOR',
            'decimals': 18,
        }
    },
    {
        "chainId": '0xa869',
        "chainName": "Avalanche Fuji Testnet",
        "rpcUrls": [
            'https://rpc.ankr.com/avalanche_fuji',
            'https://api.avax-test.network/ext/bc/C/rpc',
        ],
        "nativeCurrency": {
            'name': 'AVAX',
            'symbol': 'AVAX',
            'decimals': 18,
        }
    },
]

export const defaultChain = supportedChains[0];

export function isChainSupported(chainId) {
    return supportedChains.some(chain => chain.chainId === chainId);
}

export function getChainById(chainId) {
    return supportedChains.find(chain => chain.chainId === chainId);
}

export function getChainByName(chainId) {
    const chain = supportedChains.find(chain => chain.chainId === chainId)
    return chain?.nativeCurrency?.name;
}

export function getChainName(chainId){
    const chain = supportedChains.find(chain => chain.chainId === chainId)
    return chain?.chainName;
}