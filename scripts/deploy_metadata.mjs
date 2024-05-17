import { createHelia } from 'helia';
import { unixfs as createUnixfs } from '@helia/unixfs'
import { LevelDatastore } from 'datastore-level'
import { promises as fsPromises } from 'fs'
import fs from "fs";
import Path from "path";

const datastore = new LevelDatastore('.ipfs-ds')
await datastore.open()

const heliaNode = await createHelia();
const unixfs = createUnixfs(heliaNode);

console.log('Helia node created', heliaNode.libp2p.peerId.toString());

async function uploadImages(folderPath) {
    try {
        const dirents = await fsPromises.readdir(folderPath, { withFileTypes: true });
        let rootCid = await unixfs.addDirectory();

        // Loop through each image file in the folder
        await Promise.all(dirents.map(async (dirent) => {
            const imagePath = Path.join(folderPath, dirent.name);

            const cid = dirent.isDirectory() ?
                await uploadImages(imagePath) :
                await unixfs.addFile({
                    content: fs.createReadStream(imagePath, { highWaterMark: 16 * 1024 })
                });

            // Copy the file CID to the directory in IPFS
            rootCid = await unixfs.cp(cid, rootCid, dirent.name);

            console.log(`Uploaded ${dirent.name} to IPFS with CID: ${cid.toString()}`);

        }));

        console.log(`Image folder uploaded to IPFS with hash: ${rootCid.toString()}`);
        return rootCid.toString();
    } catch (error) {
        console.error('Error uploading images:', error);
    }
}

async function uploadMetadata(folderPath, imageCid) {
    try {
        const dirents = await fsPromises.readdir(folderPath, { withFileTypes: true });
        let rootCid = await unixfs.addDirectory();

        // Loop through each image file in the folder
        await Promise.all(dirents.map(async (dirent, index) => {
            const jsonPath = Path.join(folderPath, dirent.name);

            let cid = '';
            if (dirent.isDirectory()) { 
                cid = await uploadMetadata(jsonPath)
            } else {
                const fileData = await fsPromises.readFile(jsonPath)
                const json = JSON.parse(fileData)

                // Update image path in metadata json
                json.image = `ipfs://${imageCid.toString()}/${index + 1}.png`
                await fsPromises.writeFile(jsonPath, JSON.stringify(json))

                cid = await unixfs.addFile({
                    content: fs.createReadStream(jsonPath, { highWaterMark: 16 * 1024 })
                });
            }

            // Copy the file CID to the directory in IPFS
            rootCid = await unixfs.cp(cid, rootCid, dirent.name);

            console.log(`Uploaded ${dirent.name} to IPFS with CID: ${cid.toString()}`);

        }));

        console.log(`JSON folder uploaded to IPFS with hash: ${rootCid.toString()}`);
        return rootCid.toString();
    } catch (error) {
        console.error('Error uploading images:', error);
    }
}


async function main() {

    const imageCid = await uploadImages('./metadata/images');
    const baseUri = await uploadMetadata('./metadata/json', imageCid);
    console.log(`Base URI: ${baseUri}`);


    // process.on('exit', () => {
    //     heliaNode.stop();
    //     console.log('🛑 Helia node stopped');
    // });
}

main();
