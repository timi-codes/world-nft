import { createHelia } from 'helia';
import { json } from '@helia/json'
import { unixfs } from '@helia/unixfs'
import { promises as fsPromises } from 'fs'

const helia = await createHelia();
const fs = unixfs(helia)

console.log('Helia node created', helia.libp2p.peerId.toString());

async function uploadImages(folderPath, parentDirCid = null) {
    const images = await fsPromises.readdir(folderPath, { withFileTypes: true })

    const dirCid = parentDirCid ? parentDirCid : await fs.addDirectory()
    for (let image of images) { 
        const itemPath = `${folderPath}/${image.name}`;

        if (image.isFile()) {
            const fileData = await fsPromises.readFile(itemPath)
            console.log(image.name, fileData.length)
            await fs.addBytes(fileData, dirCid, image.name)
        }
    }

    console.log(`image folder uploaded to IPFS with hash: ${dirCid}`);
    return dirCid.toString();
}

// Function to upload metadata from each continent from json file
async function uploadJSON(continent, metadata) {
    const buffer = Buffer.from(JSON.stringify(metadata));
    const _json = json(helia)
    const cid = await _json.add(buffer)
    console.log(`${continent} metadata uploaded to IPFS with hash: ${cid}`);
    return cid.toString();
}

//Upload images and metadata to IPFS for each continent
async function main() {
    // const continents = ['africa', 'south-america', 'north-america', 'antarctica', 'asia', 'europe', 'oceania'];
    await uploadImages('./metadata/images');
}

main();
