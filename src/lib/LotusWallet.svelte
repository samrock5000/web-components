<script lang="ts">
    // import { /*fade*/ fly } from "svelte/transition";
    import {
        utf8ToBin,
        binToBase58,
        AddressType,
        Base58AddressFormatVersion,
        addressContentsToLockingBytecode,
        instantiateBIP32Crypto,
        deriveHdPrivateNodeFromSeed,
        deriveHdPath,
        binToUtf8,
    } from "@bitauth/libauth";
    const log = console.log;

    export let secret;

    let newWallet;

    let wallet: {
        words: string;
        seed: Uint8Array;
        // xprv: string;
        lotusAddrs: any[];
    };

    let networkChar: Uint8Array = utf8ToBin("_");
    let addrType = Base58AddressFormatVersion["p2pkh"];
    let ltprefix: Uint8Array = utf8ToBin("lotus");

    const lotus_wallet = async (seed) => {

        const crypto = await instantiateBIP32Crypto();

        const hdNode = deriveHdPrivateNodeFromSeed(crypto, seed);
        // const someChild = deriveHdPath(crypto, hdNode, `m/44'/899'/0'/0/0`);

        let addrs = [];
        for (let i = 0; i < 10; i++) {
            const someChild = deriveHdPath(
                crypto,
                hdNode,
                `m/44'/899'/0'/0/${i}`
            );
            const pubKey = crypto.secp256k1.derivePublicKeyCompressed(
                someChild.privateKey
            );
            const pubKeyHash = crypto.ripemd160.hash(
                crypto.sha256.hash(pubKey)
            );

            const script = addressContentsToLockingBytecode({
                payload: pubKeyHash,
                // type: AddressType.p2pkh,
                type: AddressType.p2sh,
            });

            const payload = Uint8Array.from([addrType, ...script]);
            const checksumMsg = Uint8Array.from([
                ...ltprefix,
                ...networkChar,
                ...payload,
            ]);
            const checksum = crypto.sha256.hash(checksumMsg).slice(0, 4);
            const preBase58Payload = Uint8Array.from([...payload, ...checksum]);
            const base58Payload = binToBase58(preBase58Payload);

            // const encodedPayloadToBase58 = binToBase58(encodedPayload)
            const addr =
                binToUtf8(ltprefix) + binToUtf8(networkChar) + base58Payload;
            addrs.push(addr);
        }
        wallet = {
            words: seed.words,
            seed: seed.seed,
            lotusAddrs: addrs,
        };

        return wallet;
    };

    newWallet = lotus_wallet(secret);
</script>

<div>
    {#await newWallet}
        <p>...waiting</p>
    {:then wallet}
        <div class="addr-text">
            {#each wallet.lotusAddrs as addy}
                <p id="addr">{addy}</p>
            {/each}
        </div>
    {:catch error}
        <p style="color: red">{error.message}</p>
    {/await}
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

        
    }
</style>
