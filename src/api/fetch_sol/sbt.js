import { ethers } from "ethers";
import { getContract, getAbi, getCurrentAccountAddress } from "./utils";

function getSbtAbiAddedImp(_functionNames) {
  const abi = getAbi("Sbt");
  const abiImp = getAbi("SbtImp");
  for (var i = 0; i < _functionNames.length; i++) {
    abi.push(abiImp.find((v) => v.name === _functionNames[i]));
  }
  return abi;
}

const functionNames = [
  "mint",
  "mintWithReferral",
  "burn",
  "monthInit",
  "addFavos",
  "refer",
];
const sbtAbi = getSbtAbiAddedImp(functionNames);

export async function fetchConnectedAccountInfo(method, account) {
  const { contract } = await getContract("Sbt", sbtAbi);
  if (account === undefined) {
    account = await getCurrentAccountAddress();
  }
  const response = await fetchFunction(contract, account, method);
  // console.log({
  //   address: account,
  //   method: method,
  //   value: response.toString(),
  // });
  return response.toString();
}

async function fetchFunction(contract, address, method) {
  let response;
  if (method == "favoOf") {
    response = contract.favoOf(address);
  } else if (method == "makiOf") {
    response = contract.makiOf(address);
  } else if (method == "gradeOf") {
    response = contract.gradeOf(address);
  } else if (method == "makiMemoryOf") {
    response = contract.makiMemoryOf(address);
  } else if (method == "referralOf") {
    response = contract.referralOf(address);
  } else if (method == "tokenIdOf") {
    response = contract.tokenIdOf(address);
  } else if (method == "tokenURI") {
    response = contract.tokenURI(contract.tokenIdOf(address));
  } else {
    console.error("Method Not Found");
    response = "none";
  }
  return response;
}

export async function fetchAccountImageUrl(address) {
  const { contract } = await getContract("Sbt", sbtAbi);
  let response;

  if (address === undefined) {
    const myAddr = await getCurrentAccountAddress();
    response = await fetchFunction(contract, myAddr, "tokenURI");
  } else {
    response = await fetchFunction(contract, address, "tokenURI");
  }
  // image uriを取る処理
  var result;
  var request = new XMLHttpRequest();
  request.open("GET", response, false);
  request.send(null);
  result = JSON.parse(request.responseText).image;
  return result;
}

export async function fetchReferralRate() {
  const { contract } = await getContract("Sbt");
  const message = await contract.referralRate();
  console.log({ referralRate: message });
  return message;
}

export async function fetchConnectedAccountReferralNum(account) {

  const referralRate = await fetchReferralRate();
  if (account === undefined) {
    account = await getCurrentAccountAddress();
  }
  const grade = await fetchConnectedAccountInfo("gradeOf", account);
  return referralRate[grade];
}

export async function fetchMonthlyDistributedFavoNum() {
  const { contract } = await getContract("Sbt");
  const message = await contract.monthlyDistributedFavoNum();
  console.log({ monthlyDistributedFavoNum: message.toString() });
  return message.toString();
}

export async function fetchMintedTokenNumber() {
  const { contract } = await getContract("Sbt");
  const message = await contract.mintedTokenNumber();
  console.log({ mintedTokenNumber: message.toString() });
  return message.toString();
}

export async function mint(address) {
  // mint
  let mintIndex;
  if (address === undefined) {
    const { contract } = await getContract("Sbt");
    const options = { value: ethers.utils.parseEther("0.1") };
    mintIndex = contract.mint(options);
  }
  // mint with referral
  else {
    const { contract } = await getContract("Sbt", sbtAbi);
    const options = { value: ethers.utils.parseEther("0.1") };
    mintIndex = contract.mintWithReferral(address, options);
  }

  console.log({ mintIndex: mintIndex });

  //TODO; minted listen
}

export async function refer(address) {
  const { contract } = await getContract("Sbt");
  contract.refer(address);

  //TODO; refer listen
}

export async function _addFavos(address, num) {
  const { contract } = await getContract("Sbt", sbtAbi);
  console.log(address);
  contract.addFavos(address, num);
}

export async function addFavos(address, num) {
  console.log({ addFavos: address });
  try {
    await _addFavos(address, num);
  } catch (e) {
    console.alert(e);
  }
}
