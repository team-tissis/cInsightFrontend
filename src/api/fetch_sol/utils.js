import { ethers } from "ethers";
import contractFunctions from "../../broadcast/cInsightScript.s.sol/31337/run-latest.json";
import Sbt from "../../abi/Sbt.sol/Sbt.json";
import SbtImp from "../../abi/SbtImp.sol/SbtImp.json";
import SkinNft from "../../abi/SkinNft.sol/SkinNft.json";

// スマコンのアドレスを取得
function getContractAddress(contractName) {
  console.log(contractName);
  const contractAddress = contractFunctions.transactions.find((v) => v.contractName === contractName).contractAddress;
  return contractAddress;
}

export function getAbi(contractName) {
  if (contractName === "Sbt") return Sbt.abi;
  else if (contractName === "SbtImp") return SbtImp.abi;
  else if (contractName === "SkinNft") return SkinNft.abi;
}

// 1番目のアカウントアドレスを msg.sender としている．
const accountIndex = 1; // 0x70997970c51812dc3a010c7d01b50e0d17dc79c8
// const accountIndex = 2; // 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc

export function getSigner() {
  // ローカルネットワークにアクセスする方法（ http://localhost:8545 が指定される）
  const provider = new ethers.providers.JsonRpcProvider();
  const signer = provider.getSigner(accountIndex); // 2番目の account（1番目は deployer）
  // MetaMask を使う方法 (うまくいかない)
  // const provider = new ethers.providers.Web3Provider(window.ethereum, 31337);
  // const signer = provider.getSigner();

  return signer;
}
export async function getCurrentAccountAddress() {
  const provider = new ethers.providers.JsonRpcProvider();
  const accounts = await provider.listAccounts();
  return accounts[accountIndex];
}

export function getContract(contractName, abi) {
  if (abi === undefined) abi = getAbi(contractName);
  const contractAddress = getContractAddress(contractName);
  const signer = getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);
  return { contractAddress, signer, contract };
}
