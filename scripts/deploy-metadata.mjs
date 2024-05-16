import { createHelia } from 'helia';
import { json } from '@helia/json'
import { unixfs } from '@helia/unixfs'
import fs from 'fs';

const helia = await createHelia();

console.log('Helia node created', helia.libp2p.peerId.toString());
//NOTE: my content data are being added to my local node but not being added to the IPFS network.
// I am going to use an RPC client to connect to the IPFS network and add my content data to the network for now and come back to this later.

// Fucntion to upload images
async function uploadImage(continent, image) {

    const file = await fs.promises.readFile(`./metadata/assets/${image}`);
    const _fs = unixfs(helia)
    const cid = await _fs.addBytes(file);
    console.log(`${continent} image uploaded to IPFS with hash: ${cid}`);
    return cid.toString();
}

// Function to upload metadata from each continent from json file
async function uploadMetadata(continent, metadata) {
    const buffer = Buffer.from(JSON.stringify(metadata));
    const _json = json(helia)
    const cid = await _json.add(buffer)
    console.log(`${continent} metadata uploaded to IPFS with hash: ${cid}`);
    return cid.toString();
}

//Upload images and metadata to IPFS for each continent
async function main() {
    const continents = ['africa', 'south-america', 'north-america', 'antarctica', 'asia', 'europe', 'oceania'];
    for (let continent of continents) {
        const image = `${continent}.png`;
        const _json = await fs.promises.readFile(`./metadata/${continent}.json`)
        
        const metadata = JSON.parse(_json);
        metadata.image = await uploadImage(continent, image);
        await uploadMetadata(continent, metadata);
    }
}

main();