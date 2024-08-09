"use client";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import Image from "next/image";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { Copy, Dices, Wallet } from "lucide-react";
import { useState } from "react";
export default function Home() {
  const [mnemonic, setMnemonic] = useState(generateMnemonic());
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [publicKeyLocalStorage, setPublicKeyLocalStorage] = useState("");
  const [privateKeyLocalStorage, setPrivateKeyLocalStorage] = useState("");
  const generateRandomMnemonic = () => {
    const mnemonic = generateMnemonic();
    setMnemonic(mnemonic);
  };
  // const saveToLocalStorage = () => {
  //   localStorage.setItem("publicKey", publicKey);
  //   localStorage.setItem("privateKey", privateKey);
  //   alert("Keys saved to local storage");
  // };

  // const getFromLocalStorage = () => {
  //   const publicKey1 = localStorage.getItem("publicKey");
  //   const privateKey1 = localStorage.getItem("privateKey");
  //   setPublicKeyLocalStorage(publicKey1!);
  //   setPrivateKeyLocalStorage(privateKey1!);
  // };

  const genrateWallet = () => {
    const seed = mnemonicToSeedSync(mnemonic);
    const path = `m/44'/501'/1'/0'`; // This is the derivation path
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    console.log(Keypair.fromSecretKey(secret).publicKey.toBase58());
    setPublicKey(Keypair.fromSecretKey(secret).publicKey.toBase58());
    setPrivateKey(Keypair.fromSecretKey(secret).secretKey.toString());
  };
  return (
    <main className="flex min-h-screen flex-col items-center  p-24">
      <h1 className="text-6xl font-bold text-primary">100xWallet</h1>
      <p>create a public and private Key pair </p>

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
              onClick={() => navigator.clipboard.writeText(privateKey)}
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
                onClick={() => navigator.clipboard.writeText(publicKey)}
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
    </main>
  );
}
