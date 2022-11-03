import { getContract, getCurrentAccountAddress } from "./utils";

export async function fetchConnectedAccountInfo(method) {
    const { contract } = getContract("Sbt");
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


export async function fetchMonthlyDistributedFavoNum() {
    const { contract } = getContract("Sbt");
    const message = await contract.monthlyDistributedFavoNum();
    console.log({ monthlyDistributedFavoNum: message.toString() });
    return message.toString();
}

export async function mintedTokenNumber() {
    const { contract } = getContract("Sbt");
    const message = await contract.mintedTokenNumber();
    console.log({ mintedTokenNumber: message.toString() });
    return message.toString();
}
