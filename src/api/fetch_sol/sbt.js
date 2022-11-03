import { getContract } from "./utils";

export async function fetchAccountInfo(address, method) {
    const { contract } = getContract("Sbt");
    const response = await fetchFunction(contract, address, method);
    console.log({ method: response.toString() });
    return response.toString;
}

async function fetchFunction(contract, address, method) {
    let response = -1;
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
    }
    return response
}


export async function lastUpdatedMonth() {
    const { contract } = getContract("Sbt");
    const message = await contract.lastUpdatedMonth();
    console.log({ lastUpdatedMonth: message });
    return message.toString();
}

export async function mintedTokenNumber() {
    const { contract } = getContract("Sbt");
    const message = await contract.mintedTokenNumber();
    console.log({ mintedTokenNumber: message.toString() });
    return message.toString();
}
