<script lang="ts">
  const log = console.log;
  import init, { make_mnemonic } from "../wasm-bip39/pkg/wasm_bip39.js";
  import Switch from "./Switch.svelte";
  import { /*fade*/ fly } from "svelte/transition";
  import LotusWallet from "./LotusWallet.svelte";
  import EcashWallet from "./EcashWallet.svelte";
  import Hasher from "./Hasher.svelte";

  import QR from "./QR.svelte";

  let showWallet = "off";
  let switchWallet = "off";
  let showPhrase: boolean = false;

  let walletName = "ecash";

  let newWallet;

  let seed;
  let words;

  init();

  const makeWallet = async () => {
    const seed = await make_mnemonic();
    localStorage.setItem("seed", JSON.stringify(seed));

    words = seed.mnemonic;
    log(words);
    return seed.seed;
  };

  const handleclick = async () => {
    newWallet = makeWallet();
    seed = newWallet;
  };

  function toggle() {
    showPhrase = !showPhrase;
  }
  // function toggleName() {
  //   switchWallet == "off" ? (walletName = "ecash") : (walletName = "lotus");
  // }
</script>

<div>
  <Switch bind:value={showWallet} label="Show Wallet" design="slider" />
  <Switch bind:value={switchWallet} label="" design="inner" />
  <h2>
    {switchWallet == "off" ? (walletName = "ecash") : (walletName = "lotus")} Hd-Wallet
  </h2>
  {#if showWallet == "off"}
    <div transition:fly={{ y: 200, duration: 500 }}>
      <button on:click={() => handleclick()} class="btn toggle-btn"
        >New Wallet</button
      >

      {#if newWallet != null && switchWallet == "off"}
        <Hasher secretHash={seed.seed} />
        <div>
          <button class="btn2" on:click={toggle}>Show Phase</button>
        </div>
        {#if showPhrase}
          <h8>{words}</h8>
        {:else}
          <div />
        {/if}

        <div>
          {#await seed}
            <p>...waiting</p>
          {:then wallet}
            <EcashWallet secret={wallet} />
          {:catch error}
            <p style="color: red">{error.message}</p>
          {/await}
        </div>
      {:else if newWallet != null && switchWallet}
      <div>
        <button class="btn2" on:click={toggle}>Show Phase</button>
      </div>
        {#if showPhrase}
          <h8>{words}</h8>
        {:else}
          <div />
        {/if}
        <div>
          {#await newWallet}
            <p>...waiting</p>
          {:then wallet}
            <LotusWallet secret={wallet} />
          {:catch error}
            <p style="color: red">{error.message}</p>
          {/await}
        </div>
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

  h2 {
    color: #2600ff;

    font-size: 1.4rem;
    font-weight: 100;
    line-height: 1.1;
    margin: 0.5rem auto;
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
      font-family: "Courier New", Courier, monospace;
    }
    .btn.toggle-btn {
      border-width: 1px;
      border-color: #d3d3d3;
    }
    .btn2 {
      border-width: 1px;
      border-color: #d3d3d3;
    }
    /* .btn {
      border-radius: 10%;
      margin-bottom: 1rem;
    } */
  }
</style>
