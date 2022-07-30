<script lang="ts">
    const log = console.log
    import init, { make_mnemonic } from "../wasm-bip39/pkg/wasm_bip39.js";
    import Switch from './Switch.svelte'
    import { /*fade*/  fly } from 'svelte/transition';
	let visible = true;
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
    import QR from "./QR.svelte";
  
    init();
    let switchValue;
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
  
    const makeWallet = async () => {
      const seed = await make_mnemonic();
      const crypto = await instantiateBIP32Crypto();
      
      const hdNode = deriveHdPrivateNodeFromSeed(crypto, seed.seed);  

            let addrs = [];
            for (let i = 0; i < 10; i++) {  
              const someChild = deriveHdPath(crypto, hdNode, `m/44'/1899'/0'/0/${i}`);
              const pubKey = crypto.secp256k1.derivePublicKeyCompressed(
              someChild.privateKey
                 );
              const pubKeyHash = crypto.ripemd160.hash(crypto.sha256.hash(pubKey));
              const pubKeyHashHex = binToHex(pubKeyHash);
      
              const childAddrs =
              encodeCashAddress(
                prefix,
                cashType,
                hexToBin(pubKeyHashHex)
               )
                   
                    addrs.push(childAddrs)
                   
                    
            }
            // log(addrs)   
                   
        // console.log(
        //   `m/44'/1899'/0'/0/${i}: ${encodeCashAddress(
        //     prefix,
        //     cashType,
        //     hexToBin(pubKeyHashHex)
        //   )}`
        // );

  
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
        address: addrs
      };
      localStorage.setItem('wallet', JSON.stringify(wallet));
      return wallet;
    };
   
    
    const handleclick = async () => {
      newWallet = 
      makeWallet();     
    };
 
  </script>
  
  <div>
    <h1>eCash Hd-Wallet</h1>

    <Switch bind:value={switchValue} label="Show Wallet" design="slider" />
    {#if switchValue == 'on'}
    <div transition:fly="{{ y: 200, duration: 500 }}">
    <button on:click={() => handleclick()} class="btn toggle-btn">New Wallet</button>
    
   
    {#if newWallet != null}
       {#await newWallet}
         <p>...waiting</p>
       {:then wallet}
        <div class="addr-text">
        <p class="mnemonic">{wallet.words}</p>
        <!-- <p>{wallet.seed}</p> -->
        <p>{wallet.xprv}</p> 
        <!-- <QR codeValue={wallet.xprv} squareSize="200"/> -->
        {#each wallet.address as addy}
           <p id="addr">{addy}</p>
        {/each} 
      </div>
       {:catch error}
         <p style="color: red">{error.message}</p>
       {/await}
     {/if} 
    </div>
    {/if}
  
  
  </div>
  
  <style>
  
    div {
      text-align: center;
      padding: 1em;
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
      }
      #addr {
      text-align: center;
      font-family:'Courier New', Courier, monospace ;     
    }

      .btn {
        margin-bottom: 1rem;
      }
     
      
    }
  </style>
  