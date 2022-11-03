import { ethers } from "ethers";
import contractFunctions from "../../broadcast/cInsightScript.s.sol/31337/run-latest.json";
import Sbt from "../../abi/Sbt.sol/Sbt.json";
import SkinNft from "../../abi/SkinNft.sol/SkinNft.json";

// スマコンのアドレスを取得
function getContractAddress(contractName) {
    const contractAddress = contractFunctions.transactions.find((v) => v.contractName === contractName).contractAddress;
    return contractAddress;
}

function getAbi(contractName) {
    if (contractName === "Sbt") return Sbt.abi;
    else if (contractName === "SkinNft") return SkinNft.abi;
}

// 1番目のアカウントアドレスを msg.sender としている．
const accountIndex = 2;
export function getSigner() {
    // ローカルネットワークにアクセスする方法（ http://localhost:8545 が指定される）
    const provider = new ethers.providers.JsonRpcProvider();
    const signer = provider.getSigner(accountIndex); // 2番目の account（1番目は deployer）
    // MetaMask を使う方法 (うまくいかない)
    // const provider = new ethers.providers.Web3Provider(window.ethereum, 31337);
    // const signer = provider.getSigner();

    return signer;
}

// 1番目のアカウントアドレスを msg.sender としている．
export async function getCurrentAccountAddress() {
    const provider = new ethers.providers.JsonRpcProvider();
    const accounts = await provider.listAccounts();
    return accounts[accountIndex];
}

export function getContract(contractName) {
    const contractAddress = getContractAddress(contractName);
    const abi = getAbi(contractName);
    const signer = getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    return { contractAddress, signer, contract };
}