/** @type import('hardhat/config').HardhatUserConfig */
require("fs")
require("hardhat-preprocessor")
require("hardhat-deploy")
require("dotenv").config()
require("@nomiclabs/hardhat-etherscan")

function getRemappings() {
    return fs
        .readFileSync("remappings.txt", "utf8")
        .split("\n")
        .filter(Boolean) // remove empty lines
        .map((line) => line.trim().split("="))
}

const PRIVATE_KEY = process.env.PRIVATE_KEY
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL


module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            // gasPrice: 130000000000,
        },
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 5,
            blockConfirmations: 6,
        },
        mainnet: {
            url: process.env.MAINNET_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 1,
            blockConfirmations: 6,
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.8.17",
            },
        ],
    },
    preprocess: {
        eachLine: (hre) => ({
            transform: (line) => {
                if (line.match(/^\s*import /i)) {
                    for (const [from, to] of getRemappings()) {
                        if (line.includes(from)) {
                            line = line.replace(from, to)
                            break
                        }
                    }
                }
                return line
            },
        }),
    },
    paths: {
        sources: "./src",
        cache: "./cache_hardhat",
    },
}
