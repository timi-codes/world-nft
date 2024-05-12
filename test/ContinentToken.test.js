const { expectRevert } = require('@openzeppelin/test-helpers');
const { assert } = require('chai');
const { describe } = require('node:test');
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

    describe('Minting', () => { 
        it('should mint continents on contract creation', async () => {
            const continentData = await continentToken.getAllContinents();
            assert.equal(continentData[0].length, maxSupply);
            assert.equal(continentData[1][0], AFRICA_TOKEN.name);

            const ownerOfAfrica = await continentToken.ownerOf(AFRICA_TOKEN.token_id);
            assert.equal(ownerOfAfrica, continentToken.address);
        });

        it('should get owner of a continent', async () => {
            const ownerOfAfrica = await continentToken.getContinentOwner(AFRICA_TOKEN.token_id);
            assert.equal(ownerOfAfrica, continentToken.address);
        });
    });


    describe('Transfer Token From Contract', () => { 
        it('should not transfer a token if not owned by the contract', async () => {
            await continentToken.transferTokenFromContract(AFRICA_TOKEN.token_id, account1, { from: owner });
            await expectRevert(
                continentToken.transferTokenFromContract(AFRICA_TOKEN.token_id, account2, { from: owner }),
                'Token is not owned by the contract'
            );
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
    });

    describe('Transfer Token From Account', () => { 
        it('should not transfer a continent between two accounts if not owned by the sender', async () => {
            await continentToken.transferTokenFromContract(AFRICA_TOKEN.token_id, account1, { from: owner });
            await expectRevert(
                continentToken.transferContinent(AFRICA_TOKEN.token_id, account2, { from: account3, value: web3.utils.toWei('0.01', 'ether') }),
                'You are not the owner of this continent'
            );
        });

        it('should not transfer a continent between two accounts if enough ether is not sent for team fee', async () => {
            await continentToken.transferTokenFromContract(AFRICA_TOKEN.token_id, account1, { from: owner });
            await expectRevert(
                continentToken.transferContinent(AFRICA_TOKEN.token_id, account2, { from: account1, value: web3.utils.toWei('0.001', 'ether') }),
                'Not enough Ether sent to cover team fee'
            );
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


    describe('Citizenship', () => { 

        it('should not set citizen tax if caller is not the token owner', async () => { 
            await continentToken.transferTokenFromContract(AFRICA_TOKEN.token_id, account1, { from: owner });

            const NEW_CITIZEN_TAX = web3.utils.toWei('0.005', 'ether');
            await expectRevert(
                continentToken.setCitizenTax(AFRICA_TOKEN.token_id, NEW_CITIZEN_TAX, { from: account2 }),
                'You are not the owner of this continent'
            );
        });

        it('should set citizen tax', async () => { 
            await continentToken.transferTokenFromContract(AFRICA_TOKEN.token_id, account1, { from: owner });

            const NEW_CITIZEN_TAX = web3.utils.toWei('0.005', 'ether');
            await continentToken.setCitizenTax(AFRICA_TOKEN.token_id, NEW_CITIZEN_TAX, { from: account1 });
            const continentData = await continentToken.getAllContinents();

            assert.equal(continentData[4][0], NEW_CITIZEN_TAX);
        });

        it('should not buy citizenship if caller owns the token', async () => { 
            await continentToken.transferTokenFromContract(AFRICA_TOKEN.token_id, account1, { from: owner });

            await expectRevert(
                continentToken.buyCitizenship(AFRICA_TOKEN.token_id, { from: account1, value: web3.utils.toWei('0.01', 'ether') }),
                'You already own this continent'
            );
        });

        it('should not buy citizenship if not enough ether is sent to cover citizen fee', async () => { 
            await continentToken.transferTokenFromContract(AFRICA_TOKEN.token_id, account1, { from: owner });
            await continentToken.setCitizenTax(AFRICA_TOKEN.token_id, web3.utils.toWei('0.005', 'ether'), { from: account1 });

            await expectRevert(
                continentToken.buyCitizenship(AFRICA_TOKEN.token_id, { from: account2, value: web3.utils.toWei('0.004', 'ether') }),
                'Not enough Ether sent to cover citizenship tax'
            );
        });

        it('should buy citizenship', async () => { 
            await continentToken.transferTokenFromContract(AFRICA_TOKEN.token_id, account1, { from: owner });   

            const initialOwnerBalance = await web3.eth.getBalance(account1);
            const citizenTax = web3.utils.toWei('0.01', 'ether')

            const { logs } = await continentToken.buyCitizenship(AFRICA_TOKEN.token_id, { from: account2, value: citizenTax });

            assert.equal(logs[0].event, 'CitizenshipPurchased');
            assert.equal(logs[0].args.citizen, account2);
            assert.equal(logs[0].args.tokenId, AFRICA_TOKEN.token_id);

            const finalOwnerBalance = await web3.eth.getBalance(account1);
            const expectedOwnerBalance = (web3.utils.toBN(initialOwnerBalance)
                .add(web3.utils.toBN(citizenTax)))
            assert.equal(finalOwnerBalance.toString(), expectedOwnerBalance.toString(), "Continent owner balance incorrect");

            const citizens = await continentToken.getCitizens(AFRICA_TOKEN.token_id);
            assert.equal(citizens[0], account2);
        });
        
    });
});