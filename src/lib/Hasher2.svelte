<script lang="ts">
    const log = console.log;
    import {
      utf8ToBin,
      binToHex,
      hexToBin,
      instantiateSecp256k1,
      instantiateRipemd160,
      instantiateSha256,
      decodePrivateKeyWif,
    } from "@bitauth/libauth";
  ​
    let privKey: string;
    privKey = localStorage.getItem("wallet"); //= utf8ToBin(userInput)
  ​
    const hashThis = async (privKey) => {
      const wallet = JSON.parse(privKey);
      // log(wallet.xprv);
      const secp256k1 = await instantiateSecp256k1();
      const ripemd160 = await instantiateRipemd160();
      const sha256 = await instantiateSha256();
      const txid = hexToBin(
        "74aee75ece13cac6bf8a62c74bad2726c08a25498f38a92c65a510c0e2e50bef"
      );
      // const someMsg = sha256.hash(utf8ToBin("msgTosign"));
      // const sigKey = sha256.hash(wallet.xprv);
      const xpriv =
        "......";
  ​
      const firstIndexPrivKey = decodePrivateKeyWif(
        sha256,
        "cPVVpTeJFxnbdExdnfL2mFPRYw8b6sJqWsQ9tvJxb9cXRh6CC2VL"
      );
      //  const hashed256ToStr = binToHex(sigKey)
      const sigKey = firstIndexPrivKey.privateKey; //sha256.hash(hexToBin(xpriv));
      // const sigKey = sha256.hash(xpriv);
      // const pubk = hexToBin(
      //   "0274aa83cfd5be894ede6d1aade7d35459ee246e1936deb02f8c7677e3377ab684"
      // );
      // const pubKey = ripemd160.hash(
      //   sha256.hash(
      //     hexToBin(
      //       //"21"
      //       "0274aa83cfd5be894ede6d1aade7d35459ee246e1936deb02f8c7677e3377ab684"
      //     )
      //   )
      // );
      const pubKey = secp256k1.derivePublicKeyCompressed(sigKey);
      const sig = hexToBin(
        //"47"
        "30440220490801739a15c6b004fa22411c242622affb50bb2ee7f01c8d27cdc2a97332d702202030791fa6c6a09a2261da2ac4cbe28ad19de9bfa6583a55124c3d304f8b8060"
      );
      // const sig = secp256k1.signMessageHashDER(sigKey, someMsg);
      const sigTohex = binToHex(sig);
      // log(binToHex(firstIndexPrivKey.privateKey));
      log(sigTohex);
      // const usrInpToHex = binToHex(pubKey)
      // const pubKeyHash = ripemd160.hash(sha256.hash(pubKey))
      // const pkhString = binToHex(pubKeyHash)
  ​
      {
        (async () => {
          secp256k1.verifySignatureDER(sig, pubKey, txid)
            ? // secp256k1.(sig, pubKey, someMsg)
              console.log("???? Signature valid")
            : console.log("? Signature invalid");
        })();
      }
    };
    hashThis(privKey);
  </script>