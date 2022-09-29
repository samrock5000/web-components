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
  <div class="navbar">
    <p><a href="https://github.com/samrock5000/web-components"   target="_blank">github</a></p>
    <div/>
  <div class="hdAddrs" >
    <HdWallet/>
    <Hasher2/>
  </div>
<!-- <Contract/> -->

</main>

<style>


/* RESETS */
.navbar {
 
  overflow: hidden;
  background-color: rgb(255, 255, 255);
  position: fixed;
  top: 0;
  width: 100%;
}

.navbar a {
  float: left;
  display: contents;
  color: #020101;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 17px;
}

.navbar a:hover {
  background: rgba(32, 24, 24, 0.589);
  color: rgb(54, 54, 54);
}

</style>