// test/ContinentToken.test.js
const { expectRevert } = require('@openzeppelin/test-helpers');
const { assert } = require('chai');
const ContinentToken = artifacts.require('ContinentToken');

contract('ContinentToken', (accounts) => { 
    let continentToken;
    const name = 'ContinentToken';
    const symbol = 'CNT';
    const decimals = 18;
    const maxSupply = 7;
    const owner = accounts[0];
    const account1 = accounts[1];
    const account2 = accounts[2];
    const account3 = accounts[3];
    const account4 = accounts[4];


    const AFRICA_TOKEN = {
        token_id: 1,
        name: 'Africa',
    };
    
    beforeEach(async () => {
        continentToken = await ContinentToken.new(name, symbol, decimals, { from: owner });
    });
    
    it('should have correct name', async () => {
        const tokenName = await continentToken.name();
        assert.equal(tokenName, name);
    });
    
    it('should have correct symbol', async () => {
        const tokenSymbol = await continentToken.symbol();
        assert.equal(tokenSymbol, symbol);
    });

    it('should mint continents on contract creation', async () => { 
        const continentData = await continentToken.getAllContinents();
        assert.equal(continentData[0].length, maxSupply);
        assert.equal(continentData[1][0], AFRICA_TOKEN.name);
    });

    it('should transfer a continent from the contract to new owner', async () => {

        const contractOwner = await continentToken.ownerOf(AFRICA_TOKEN.token_id);
        const { logs } = await continentToken.transferTokenFromContract(AFRICA_TOKEN.token_id, account1, { from: owner });

        const newOwner = await continentToken.ownerOf(AFRICA_TOKEN.token_id);

        assert.equal(newOwner, account1);
        assert.equal(logs[1].event, 'ContinentTransfered');
        assert.equal(logs[1].args.from, contractOwner);
        assert.equal(logs[1].args.to, account1);
        assert.equal(logs[1].args.tokenId, AFRICA_TOKEN.token_id);
    });

    it('should transfer a continent between two accounts', async () => { 
        await continentToken.transferTokenFromContract(AFRICA_TOKEN.token_id, account1, { from: owner });
        const { logs } = await continentToken.transferContinent(AFRICA_TOKEN.token_id, account2, { from: account1, value: web3.utils.toWei('0.01', 'ether') });

        const newOwner = await continentToken.ownerOf(AFRICA_TOKEN.token_id);
        assert.equal(newOwner, account2);

        assert.equal(logs[1].event, 'ContinentTransfered');
        assert.equal(logs[1].args.from, account1);
        assert.equal(logs[1].args.to, account2);
        assert.equal(logs[1].args.tokenId, AFRICA_TOKEN.token_id);
    });
    
});