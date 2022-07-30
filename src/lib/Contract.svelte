<!-- <script lang="ts">
import { compileString } from 'cashc';
import  {Artifact}  from 'cashscript';
const log = console.log;
const code = `pragma cashscript ^0.6.5;

contract TransferWithTimeout(pubkey sender, pubkey recipient, int timeout) {
    // Require recipient's signature to match
    function transfer(sig recipientSig) {
        require(checkSig(recipientSig, recipient));
    }
    // Require timeout time to be reached and sender's signature to match
    function timeout(sig senderSig) {
        require(checkSig(senderSig, sender));
        require(tx.time >= timeout);
    }
}
`
    let artifact;

      function compile() {
    try {
      localStorage.setItem("code", code);
       artifact = compileString(code);
    //   Artifact(artifact);
    log(artifact)
    } catch (e) {
      alert(e.message);
      console.error(e.message);
    }
  }
  compile()

</script> -->