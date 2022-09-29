<script lang="ts">
  const log = console.log
  import HdWallet  from './lib/HdWallet.svelte'
  import Hasher2 from './lib/Hasher2.svelte';


  // import Contract from './lib/Contract.svelte';
  import {
    // validateSecp256k1PrivateKey
  } from "@bitauth/libauth";
  import QR from "./lib/QR.svelte";



</script>

<main>
  <div class="hdAddrs" >
    <HdWallet/>
    <Hasher2/>
  </div>
<!-- <Contract/> -->

</main>

<style>


/* RESETS */


</style>