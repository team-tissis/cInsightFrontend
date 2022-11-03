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

const functionNames = ["mint", "mintWithReferral", "burn", "monthInit", "addFavos", "refer"];
const sbtAbi = getSbtAbiAddedImp(functionNames);

export async function fetchConnectedAccountInfo(method) {
    const { contract } = getContract("Sbt", sbtAbi);
    const currentAccount = await getCurrentAccountAddress();
    const response = await fetchFunction(contract, currentAccount, method);
    console.log({ address: currentAccount, method: method, value: response.toString() });
    return response.toString();
}

async function fetchFunction(contract, address, method) {
    let response;
    if (method == "favoOf") {
        response = contract.favoOf(address);
    }
    else if (method == "makiOf") {
        response = contract.makiOf(address);
    }
    else if (method == "gradeOf") {
        response = contract.gradeOf(address);
    }
    else if (method == "makiMemoryOf") {
        response = contract.makiMemoryOf(address);
    }
    else if (method == "referralOf") {
        response = contract.referralOf(address);
    }
    else {
        console.error("Method Not Found")
        response = "none";
    }
    return response
}

export async function fetchReferralRate() {
    const { contract } = getContract("Sbt");
    const message = await contract.referralRate();
    console.log({ referralRate: message });
    return message;
}

export async function fetchConnectedAccountReferralNum() {
    const referralRate = await fetchReferralRate();
    const grade = await fetchConnectedAccountInfo("gradeOf");
    return referralRate[grade];
}

export async function fetchMonthlyDistributedFavoNum() {
    const { contract } = getContract("Sbt");
    const message = await contract.monthlyDistributedFavoNum();
    console.log({ monthlyDistributedFavoNum: message.toString() });
    return message.toString();
}

export async function fetchMintedTokenNumber() {
    const { contract } = getContract("Sbt");
    const message = await contract.mintedTokenNumber();
    console.log({ mintedTokenNumber: message.toString() });
    return message.toString();
}

export async function mint() {
    const { contract } = getContract("Sbt");
    const options = { value: ethers.utils.parseEther("20.0") }
    const mintIndex = contract.mint(options);
    console.log({ mintIndex: mintIndex });

    //TODO; minted listen
}

export async function refer(address) {
    const { contract } = getContract("Sbt");
    const options = { value: ethers.utils.parseEther("20.0") }
    contract.refer(address, options);
    console.log({ address: address });

    //TODO; minted listen
}