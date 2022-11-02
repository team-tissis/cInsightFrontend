import { getContract } from "./utils";

async function lastUpdatedMonth() {
    const { contract } = getContract("Sbt");
    const message = await contract.lastUpdatedMonth();
    console.log({ lastUpdatedMonth: message });
    return message.toString();
}

async function mintedTokenNumber() {
    const { contract } = getContract("Sbt");
    const message = await contract.mintedTokenNumber();
    console.log({ mintedTokenNumber: message.toString() });
    return message.toString();
}

export { lastUpdatedMonth, mintedTokenNumber };