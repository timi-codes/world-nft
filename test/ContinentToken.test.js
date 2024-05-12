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

    it.only('should transfer a continent between two accounts', async () => { 
        console.log(account1, account2)
        await continentToken.transferTokenFromContract(AFRICA_TOKEN.token_id, account1, { from: owner });
        const { logs } = await continentToken.transferContinent(AFRICA_TOKEN.token_id, account2, { from: account1, value: web3.utils.toWei('0.01', 'ether') });

        const newOwner = await continentToken.ownerOf(AFRICA_TOKEN.token_id);
        assert.equal(newOwner, account2);

        assert.equal(logs[1].event, 'ContinentTransfered');
        console.log(logs[1].args.from, logs[1].args.to)
        assert.equal(logs[1].args.from, account1);
        // assert.equal(logs[1].args.to, account2);
        // assert.equal(logs[1].args.tokenId, AFRICA_TOKEN.token_id);
    });
    
    // it('should mint a new continent', async () => {
    //     const tokenDecimals = await continentToken.decimals();
    //     assert.equal(tokenDecimals, decimals);
    // });
    
    // it('should have correct initial supply', async () => {
    //     const totalSupply = await continentToken.totalSupply();
    //     assert.equal(totalSupply, initialSupply);
    // });
    
    // it('should have correct owner', async () => {
    //     const ownerAddress = await continentToken.owner();
    //     assert.equal(ownerAddress, owner);
    // });
    
    // it('should transfer tokens correctly', async () => {
    //     await continentToken.transfer(account1, 100, { from: owner });
    //     const balance = await continentToken.balanceOf(account1);
    //     assert.equal(balance, 100);
    // });
    
    // it('should not transfer tokens if sender has insufficient balance', async () => {
    //     await expectRevert(continentToken.transfer(account1, 100, { from: account2 }), 'ERC20: transfer amount exceeds balance');
    // });
    
    // it('should not transfer tokens if recipient is the zero address', async () => {
    //     await expectRevert(continentToken.transfer('0x  
});