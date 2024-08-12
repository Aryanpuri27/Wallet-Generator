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
export default function Sol() {
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
    const savedKeys = localStorage.getItem("SolpublicKeys");
    if (savedKeys) {
      setSavedKeys(JSON.parse(savedKeys));
    }
  }, []);

  const addPublicKey = (newKey: any) => {
    // Update the state with the new key
    const updatedKeys = [...savedKey, newKey];
    setSavedKeys(updatedKeys);

    // Save the updated array to local storage
    localStorage.setItem("SolpublicKeys", JSON.stringify(updatedKeys));
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
    const path = `m/44'/501'/1'/0'`; // This is the derivation path
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    setPublicKey(Keypair.fromSecretKey(secret).publicKey.toBase58());
    setPrivateKey(Keypair.fromSecretKey(secret).secretKey.toString());
    addPublicKey(Keypair.fromSecretKey(secret).publicKey.toBase58());
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
