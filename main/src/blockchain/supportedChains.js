export const supportedChains = [
    {
        "chainId": '0x5',
        "chainName": "Goerli",
        "rpcUrls": [
            'https://rpc.goerli.eth.gateway.fm',
            'https://eth-goerli.public.blastapi.io'
        ],
        "nativeCurrency": {
            'name': 'Eth',
            'symbol': 'eth',
            'decimals': 18,
        }
    },
    {
        "chainId": '0xa869',
        "chainName": "Avalanche Fuji Testnet",
        "rpcUrls": [
            'https://api.avax-test.network/ext/bc/C/rpc',
            'https://ava-testnet.public.blastapi.io/ext/bc/C/rpc',
        ],
        "nativeCurrency": {
            'name': 'AVAX',
            'symbol': 'AVAX',
            'decimals': 18,
        }
    },
    {
        "chainId": '0x66eed',
        "chainName": "Arbitrum Goerli",
        "rpcUrls": [
            'https://goerli-rollup.arbitrum.io/rpc',
            'https://arbitrum-goerli.public.blastapi.io'
        ],
        "nativeCurrency": {
            'name': 'AGOR',
            'symbol': 'AGOR',
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