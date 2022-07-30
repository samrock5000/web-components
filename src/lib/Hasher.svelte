<script lang="ts">
const log = console.log;
import { 
    utf8ToBin,
    binToHex,
    hexToBin,
    instantiateSecp256k1,
    instantiateRipemd160, 
    instantiateSha256,
   
  } from '@bitauth/libauth'

  let privKey:string;
  privKey = localStorage.getItem('wallet');//= utf8ToBin(userInput)
 
  const hashThis = async (privKey) => {
     const wallet = JSON.parse(privKey)
    log(wallet.xprv)
    const secp256k1 = await instantiateSecp256k1();
    const ripemd160 = await instantiateRipemd160();
    const sha256 = await instantiateSha256();

    const someMsg = sha256.hash(utf8ToBin("whateva"))
    const sigKey = sha256.hash(wallet.xprv)

    // const hashed256ToStr = binToHex(sigKey)
   
    const pubKey = secp256k1.derivePublicKeyCompressed(sigKey)

    const sig = secp256k1.signMessageHashDER(sigKey, someMsg)
    const sigTohec = binToHex(sig)
    log(sigTohec)
    // const usrInpToHex = binToHex(pubKey)
    // const pubKeyHash = ripemd160.hash(sha256.hash(pubKey))
    // const pkhString = binToHex(pubKeyHash)

    {
        (async () => {
    secp256k1.verifySignatureDER(sig, pubKey, someMsg)
    ? console.log('🚀 Signature valid')
    : console.log('❌ Signature invalid');
        })();
    }
  
  }
  hashThis(privKey)               
        
 
 

</script>


