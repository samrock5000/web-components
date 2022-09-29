<script lang="ts">
  // import { /*fade*/ fly } from "svelte/transition";
  import {
    binToHex,
    hexToBin,
    encodeCashAddress,
    CashAddressType,
    encodeHdPrivateKey,
    deriveHdPath,
    instantiateBIP32Crypto,
    deriveHdPrivateNodeFromSeed,
  } from "@bitauth/libauth";
  export let secret;

  const log = console.log;

  let newWallet;

  let wallet: {
    words: string;
    seed: Uint8Array;
    xprv: string;
    address: any[];
  };

  let network = "mainnet";
  let prefix = network == "mainnet" ? "ecash" : "ectest";
  let cashType = CashAddressType["P2PKH"];

  const makeWallet = async (seed) => {
    const crypto = await instantiateBIP32Crypto();

    const hdNode = deriveHdPrivateNodeFromSeed(crypto, seed);

    let addrs = [];
    //Ecash Addr
    for (let i = 0; i < 10; i++) {
      const someChild = deriveHdPath(crypto, hdNode, `m/44'/1899'/0'/0/${i}`);
      const pubKey = crypto.secp256k1.derivePublicKeyCompressed(
        someChild.privateKey
      );
      const pubKeyHash = crypto.ripemd160.hash(crypto.sha256.hash(pubKey));
      const pubKeyHashHex = binToHex(pubKeyHash);

      const childAddrs = encodeCashAddress(
        prefix,
        cashType,
        hexToBin(pubKeyHashHex)
      );

      addrs.push(childAddrs);
    }

    let params = {
      network: "mainnet",
      node: hdNode,
      // node: {
      //   chainCode,
      //   childIndex: 0,
      //   depth: 0,
      //   parentFingerprint,
      //   privateKey,
      //   valid
      // }
    };

    const xprv = encodeHdPrivateKey(crypto, params);

    wallet = {
      words: seed.mnemonic,
      seed: seed.seed,
      xprv: xprv,
      address: addrs,
    };
    localStorage.setItem("wallet", JSON.stringify(newWallet));

    return wallet;
  };

  newWallet = makeWallet(secret);
</script>

<div>
  {#await newWallet}
    <p>...waiting</p>
  {:then wallet}
    <div class="addr-text">
      {#each wallet.address as addy}
        <p id="addr">{addy}</p>
      {/each}
    </div>
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}

  <!-- {/if} -->
</div>

<style>
  div {
    text-align: center;
    padding: 0.1em;
    margin: 0 auto;
  }

  img {
    height: 16rem;
    width: 16rem;
  }

  h1 {
    color: #2600ff;

    font-size: 4rem;
    font-weight: 100;
    line-height: 1.1;
    margin: 2rem auto;
    max-width: 14rem;
  }

  p {
    word-wrap: break-word;
    max-width: 14rem;
    margin: 1rem auto;
    line-height: 1.35;
  }

  @media (min-width: 480px) {
    h1 {
      max-width: none;
    }

    p {
      max-width: none;
      word-wrap: break-word;
    }
    #addr {
      text-align: center;
      font-family: "Courier New", Courier, monospace;
    }

    .btn {
      margin-bottom: 1rem;
    }
  }
</style>
