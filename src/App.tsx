import { fetchSolc } from "web-solc";
import "./App.css";
import {
  ISolidityCompiler,
  SolidityCompilation,
  SolidityJsonInput,
  SolidityMetadataContract,
  SourcifyChain,
  Verification,
} from "@ethereum-sourcify/lib-sourcify";

async function verifyViaJsonInput() {
  class Solc implements ISolidityCompiler {
    async compile(
      version: string,
      solcJsonInput: SolidityJsonInput
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any> {
      const { compile } = await fetchSolc(version);
      return await compile(solcJsonInput);
    }
  }

  const solc = new Solc();

  const sources = {
    "contracts/SimpleStorage.sol": {
      content: `// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

// pragma solidity ^0.8.0;
// pragma solidity >=0.8.0 <0.9.0;

contract SimpleStorage {
  uint256 favoriteNumber;

  struct People {
    uint256 favoriteNumber;
    string name;
  }

  // uint256[] public anArray;
  People[] public people;

  mapping(string => uint256) public nameToFavoriteNumber;

  function store(uint256 _favoriteNumber) public {
    favoriteNumber = _favoriteNumber;
  }

  function retrieve() public view returns (uint256) {
    return favoriteNumber;
  }

  function addPerson(string memory _name, uint256 _favoriteNumber) public {
    people.push(People(_favoriteNumber, _name));
    nameToFavoriteNumber[_name] = _favoriteNumber;
  }
}`,
    },
  };

  const compilation = new SolidityCompilation(
    solc,
    "0.8.8+commit.dddeac2f",
    {
      language: "Solidity",
      sources,
      settings: {
        evmVersion: "london",
        libraries: {},
        metadata: { bytecodeHash: "ipfs" },
        optimizer: { enabled: false, runs: 200 },
        remappings: [],
        outputSelection: {
          "*": ["abi", "evm.bytecode", "evm.deployedBytecode"],
        },
      },
    },
    {
      path: "contracts/SimpleStorage.sol",
      name: "SimpleStorage",
    }
  );

  const myChain = new SourcifyChain({
    name: "Ethereum Mainnet",
    chainId: 11155111,
    rpc: ["https://gateway.tenderly.co/public/sepolia"],
    supported: true,
  });

  const verification = new Verification(
    compilation,
    myChain,
    "0x4880834E8C6D713EB432B9CA31413E6ABADA8B53"
  );

  await verification.verify();

  console.log(verification.export());
}

async function verifyViaMetadata() {
  class Solc implements ISolidityCompiler {
    async compile(
      version: string,
      solcJsonInput: SolidityJsonInput
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any> {
      const { compile } = await fetchSolc(version);
      return await compile(solcJsonInput);
    }
  }

  const solc = new Solc();

  const metadataResult = await fetch("./examples/metadata.json");
  const metadata = await metadataResult.json();
  const metadataContract = new SolidityMetadataContract(metadata, []);

  const isCompilable = await metadataContract.isCompilable();
  console.log(isCompilable);

  const compilation = await metadataContract.createCompilation(solc);

  const myChain = new SourcifyChain({
    name: "Ethereum Mainnet",
    chainId: 1,
    rpc: ["https://eth.llamarpc.com"],
    supported: true,
  });

  const verification = new Verification(
    compilation,
    myChain,
    "0x00000000219ab540356cBB839Cbe05303d7705Fa"
  );

  await verification.verify();

  console.log(verification.export());
}

function App() {
  return (
    <>
      <button onClick={() => verifyViaJsonInput()}>
        Verify via Json Input
      </button>
      <button onClick={() => verifyViaMetadata()}>Verify via Metadata</button>
    </>
  );
}

export default App;
