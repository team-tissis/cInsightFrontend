import { getContract, getAbi, getCurrentAccountAddress } from "./utils";
import { fetchConnectedAccountInfo } from "./sbt";
import { ethers } from "ethers";

const functionNames = [
  "initialize",
  "propose",
  "queue",
  "execute",
  "cancel",
  "veto",
  "getReceipt",
  "state",
  "castVote",
  "castVoteWithReason",
  "castVoteBySig",
  "_setExecutingGracePeriod",
  "_setExecutingDelay",
  "_setVotingDelay",
  "_setVotingPeriod",
  "_setProposalThreshold",
  "_setPendingVetoer",
  "_acceptVetoer",
  "_burnVetoPower",
  "getHasVoted",
  "getSupport",
  "getVotes",
  "getProposer",
  "getTargets",
  "getValues",
  "getSignatures",
  "getCalldatas",
  "getForVotes",
  "getAgainstVotes",
  "getAbstainVotes",
];

const proxyExtendedAbi = getProxyAbiAddedLogic(functionNames);

const { contract } = getContract(
  "ChainInsightGovernanceProxyV1",
  proxyExtendedAbi
);

function getProxyAbiAddedLogic(_functionNames) {
  const abi = getAbi("ChainInsightGovernanceProxyV1");
  const abiLogic = getAbi("ChainInsightLogicV1");
  for (var i = 0; i < _functionNames.length; i++) {
    abi.push(abiLogic.find((v) => v.name === _functionNames[i]));
  }
  return abi;
}

export async function propose(
  targets,
  values,
  signatures,
  datas,
  datatypes,
  description
) {
  console.log("propose start ...");
  console.log("targets, values, signatures, datas, datatypes, description");
  console.log(targets, values, signatures, datas, datatypes, description);
  const abiCoder = ethers.utils.defaultAbiCoder;
  const calldatas = abiCoder.encode([datatypes], [datas]);
  console.log("contract set");
  const proposalResponse = await contract.propose(
    targets,
    values,
    signatures,
    calldatas,
    description
  );
  console.log("propose end ...");
  console.log("proposeResponse:");
  console.log(proposalResponse);
  return proposalResponse;
}

export async function vote(proposalResponse, voteResult, reason) {
  let support;
  if (voteResult == "against") {
    support = 0;
  } else if (voteResult == "for") {
    support = 1;
  } else if (voteResult == "abstention") {
    support = 2;
  }
  await contract.castVoteWithReason(proposalResponse, support, reason);
}

export async function queue(proposalResponse) {
  await contract.queue(proposalResponse);
}

export async function execute(proposalResponse) {
  await contract.execute(proposalResponse);
}

export async function cancel(proposalResponse) {
  await contract.cancel(proposalResponse);
}

export async function veto(proposalResponse) {
  await contract.veto(proposalResponse);
}

export async function getState(proposalResponse) {
  const message = await contract.state(proposalResponse);
  console.log(message);
  return message;
}
// if (message == 0) {
//   return "Pending";
// } else if (message == 1) {
//   return "Active";
// } else if (message == 2) {
//   return "Canceled";
// } else if (message == 3) {
//   return "Defeated";
// } else if (message == 4) {
//   return "Succeeded";
// } else if (message == 5) {
//   return "Queued";
// } else if (message == 6) {
//   return "Expired";
// } else if (message == 7) {
//   return "Executed";
// } else if (message == 8) {
//   return "Vetoed";
//   return message;
// }

export async function getProposalInfo(method, proposalResponse) {
  if (proposalResponse == undefined) {
    const proposalCount = await getProposalCount();
    var proposalInfos = [];

    for (let i = 0; i < proposalCount; i++) {
      proposalInfos.push(_getProposalInfo(method, proposalResponse));
      return proposalInfos;
    }
  } else {
    return _getProposalInfo(method, proposalResponse);
  }
}

export async function _getProposalInfo(method, proposalResponse) {
  const message = await contract.proposals(proposalResponse);

  // if (method == "id") {
  //   console.log(message.id.toString());
  //   return message.id.toString();
  if (method == "proposer") {
    return message.proposer.toString();
  } else if (method == "eta") {
    return message.eta.toString();
  } else if (method == "targets") {
    const message = await contract.getTargets(proposalResponse);
    return message.toString();
  } else if (method == "values") {
    const message = await contract.getValues(proposalResponse);
    return message.toString();
  } else if (method == "signatures") {
    const message = await contract.getSignatures(proposalResponse);
    return message.toString();
  } else if (method == "calldatas") {
    const message = await contract.getCalldatas(proposalResponse);
    return message.toString();
  } else if (method == "startBlock") {
    return message.startBlock.toString();
  } else if (method == "endBlock") {
    return message.startBlock.toString();
  } else if (method == "forVotes") {
    const message = await contract.getForVotes(proposalResponse);
    return message.toString();
  } else if (method == "againstVotes") {
    const message = await contract.getAgainstVotes(proposalResponse);
    return message.toString();
  } else if (method == "abstainVotes") {
    const message = await contract.getAbstainVotes(proposalResponse);
    return message.toString();
  }
}

export async function getAccountVotingInfo(method, proposalResponse) {
  const accountAddress = await getCurrentAccountAddress();
  const message = await contract.getReceipt(proposalResponse, accountAddress);
  console.log(message.hasVoted.toString());
  if (method == "canVote") {
    const grade = await fetchConnectedAccountInfo("gradeOf");
    return grade >= 1;
  } else if (method == "hasVoted") {
    return message.hasVoted.toString();
  } else if (method == "support") {
    return message.support.toString();
  } else if (method == "votes") {
    return message.votes.toString();
  }
}

// export async function getExecutingGracePeriod() {
//   const message = await contract.executingGracePeriod();
//   console.log(message);
//   return message.toString();
// }
//
// export async function getExecutingDelay() {
//   const message = await contract.executingDelay();
//   console.log(message.toString());
//   return message.toString();
// }
//
// export async function getVotingPeriod() {
//   const message = await contract.votingPeriod();
//   console.log(message.toString());
//   return message.toString();
// }
//
// export async function getVotingDelay() {
//   const message = await contract.votingDelay();
//   console.log(message.toString());
//   return message.toString();
// }
//
// export async function getProposalThreshold() {
//   const message = await contract.proposalThreshold();
//   console.log(message.toString());
//   return message.toString();
// }
//
// export async function getLatestProposalId(address) {
//   const message = await contract.latestProposalIds(address);
//   console.log(message.toString());
//   return message.toString();
// }

export async function getProposalCount() {
  const message = await contract.proposalCount();
  console.log("proposalCount done...");
  console.log(message.toString());
  return message.toString();
}
