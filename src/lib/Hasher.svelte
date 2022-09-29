<script lang="ts">
  const log = console.log;
  import {
    utf8ToBin,
    binToHex,
    instantiateSecp256k1,
    instantiateRipemd160,
    instantiateSha256,
  } from "@bitauth/libauth";
  export let secretHash;

  let seed: string;
  seed = localStorage.getItem("seed"); //= utf8ToBin(userInput)

  const hashThis = async (secretHash) => {
    const wallet = JSON.parse(secretHash);
    // log(wallet.xprv)
    log(wallet.seed);
    const secp256k1 = await instantiateSecp256k1();
    const ripemd160 = await instantiateRipemd160();
    const sha256 = await instantiateSha256();

    const someMsg = sha256.hash(utf8ToBin("this is lotusia!"));
    const sigKey = sha256.hash(wallet.seed);

    const hashed256ToStr = binToHex(sigKey);

    const pubKey = secp256k1.derivePublicKeyCompressed(sigKey);

    const sig = secp256k1.signMessageHashDER(sigKey, someMsg);
    const sigTohec = binToHex(sig);
    log(sigTohec);
    log(hashed256ToStr);
    const usrInpToHex = binToHex(pubKey);
    const pubKeyHash = ripemd160.hash(sha256.hash(pubKey));
    const pkhString = binToHex(pubKeyHash);

    {
      (async () => {
        secp256k1.verifySignatureDER(sig, pubKey, someMsg)
          ? console.log("🚀 Signature valid hahaha")
          : console.log("❌ Signature invalid");
      })();
    }
  };
  hashThis(seed);
</script>
