export const splitWalletAddress = (address) => {
    const start = address.substring(0, 5);
    const end = address.substring(address.length - 5, address.length);
    return `${start}...${end}`;
}