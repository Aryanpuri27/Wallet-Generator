"use client";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import Image from "next/image";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { Copy, Dices, Wallet } from "lucide-react";
import { useState } from "react";
import Sol from "./sol";
import Eth from "./eth";
export default function Home() {
  const [issol, setissol] = useState(true);
  return (
    <main className="flex min-h-screen flex-col items-center  p-24">
      <h1 className="text-6xl font-bold text-primary">100xWallet</h1>
      <p>create a public and private Key pair </p>

      <div className="relative inline-block w-64 mt-6">
        <select
          onChange={(e) => setissol(e.target.value === "Solana")}
          className="block w-full px-3 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="" disabled>
            Select a blockchain
          </option>
          <option value={"Solana"} selected>
            Solana
          </option>
          <option value={"Ethereum"}>Ethereum</option>
        </select>
      </div>

      {issol ? <Sol /> : <Eth />}
    </main>
  );
}
