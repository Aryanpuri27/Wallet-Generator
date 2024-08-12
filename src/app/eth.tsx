"use client";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import Image from "next/image";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { Copy, Dices, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Description } from "@radix-ui/react-toast";
const Web3 = require("web3");
const HDKey = require("hdkey");
const { bufferToHex, privateToAddress } = require("ethereumjs-util");
const { ethers } = require("ethers");
export default function Eth() {
  const [mnemonic, setMnemonic] = useState(generateMnemonic());
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const generateRandomMnemonic = () => {
    const mnemonic = generateMnemonic();
    setMnemonic(mnemonic);
  };
  const { toast } = useToast();
  const [savedKey, setSavedKeys] = useState<string[]>([]);
  useEffect(() => {
    // Retrieve the array of public keys from local storage when the component mounts
    const savedKeys = localStorage.getItem("EthpublicKeys");
    if (savedKeys) {
      setSavedKeys(JSON.parse(savedKeys));
    }
  }, []);

  const addPublicKey = (newKey: any) => {
    // Update the state with the new key
    const updatedKeys = [...savedKey, newKey];
    setSavedKeys(updatedKeys);

    // Save the updated array to local storage
    localStorage.setItem("EthpublicKeys", JSON.stringify(updatedKeys));
    toast({
      title: "Public Key Added",
      description: newKey.toString(),
    });
  };

  const genrateWallet = () => {
    if (mnemonic.length < 5) {
      toast({
        title: "must have mnemonic phrase",
      });
      return;
    }
    const seed = mnemonicToSeedSync(mnemonic);
    const hdKey = HDKey.fromMasterSeed(seed);
    const path = "m/44'/60'/0'/0/0";
    const derived = hdKey.derive(path);
    // Get the private key
    const privateKey = derived.privateKey;

    // Get the public key and Ethereum address
    const publicKey = bufferToHex(privateKey);
    const address = bufferToHex(privateToAddress(privateKey));
    setPublicKey(address);
    setPrivateKey(bufferToHex(privateKey));
    addPublicKey(address);
    setMnemonic("");
  };
  const copyit = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "copied",
      description: key.toString(),
    });
  };
  return (
    <>
      <div className="flex flex-col gap-2 w-full ">
        <div className="flex justify-between px-4 mt-5">
          <h1 className="text-2xl font-bold text-primary">Mnemonic</h1>
          <button
            onClick={generateRandomMnemonic}
            className="bg-primary text-white font-bold rounded-lg p-2"
          >
            <Dices />
          </button>
        </div>
        <div>
          <textarea
            className="p-4 border border-gray-300 rounded-lg min-w-[400px] w-full  mt-4  md:h-[100px] sm:h-[300px]"
            value={mnemonic}
            onChange={(e) => setMnemonic(e.target.value)}
          />
        </div>
        <p className="text-center mb-6">
          save this Mnemonic String to recover your wallet
        </p>
      </div>
      <div className="flex flex-col items-center justify-center w-full">
        <button
          onClick={genrateWallet}
          className="bg-primary flex flex-row gap-3 text-white font-bold rounded-lg p-4 mt-4"
        >
          Generate Wallet
          <Wallet />
        </button>
      </div>
      {privateKey && (
        <div className="mt-5 w-full">
          <div className="flex justify-between align-middle w-full">
            <h1 className="text-2xl font-bold text-primary ">Private Key</h1>
            <button
              onClick={() => copyit(privateKey)}
              className=" font-bold rounded-lg  "
            >
              <Copy />
            </button>
          </div>

          <input
            className="p-4 border w-full border-gray-300 rounded-lg min-w-[400px] mt-4 h-[100px]"
            value={privateKey}
            readOnly
          />
        </div>
      )}
      {publicKey && (
        <>
          <div className="w-full">
            <div className="flex justify-between align-middle w-full">
              <h1 className="text-2xl font-bold text-primary mt-5">
                Public Key
              </h1>
              <button
                onClick={() => copyit(publicKey)}
                className=" font-bold rounded-lg "
              >
                <Copy />
              </button>
            </div>
            <input
              className="p-4 border w-full border-gray-300 rounded-lg min-w-[400px] mt-4 h-[100px]"
              value={publicKey}
              readOnly
            />
          </div>
        </>
      )}

      {savedKey && (
        <div className="w-full">
          <h1 className="text-2xl font-bold text-primary mt-5">Saved Keys</h1>
          {savedKey.map((e) => (
            <div key={e} className="relative mt-4 min-w-[400px]">
              <input
                className="p-4 pr-12 border w-full border-gray-300 rounded-lg h-[100px]"
                value={e}
                readOnly
              />
              <button
                onClick={() => copyit(e)}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
              >
                <Copy />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
