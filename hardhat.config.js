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

module.exports = {
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
