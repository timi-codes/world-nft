const { expectRevert } = require('@openzeppelin/test-helpers');
const { assert } = require('chai');
const ContinentAuction = artifacts.require('ContinentAuction');
const ContinentToken = artifacts.require('ContinentToken');

contract('ContinentAuction', (accounts) => {
    let continentToken;
    let continentAuction;

    const owner = accounts[0];
    const bidder1 = accounts[1];
    const bidder2 = accounts[2];

    const AFRICA_TOKEN = {
        token_id: 1,
        name: 'Africa',
    };
    const startPrice = web3.utils.toWei("1", "ether");
    const bidIncrement = web3.utils.toWei("0.1", "ether");
    const duration = 3600; // 1 hr

    before(async () => {
        continentToken = await ContinentToken.new("ContinentToken", "CNT", "", { from: owner });
        continentAuction = await ContinentAuction.new(continentToken.address, { from: owner });
    });

    describe('Auction', () => { 
        it('should not start auction if continent is not owned by contract', async () => {
            await continentToken.transferTokenFromContract(AFRICA_TOKEN.token_id, bidder1, { from: owner });

            await expectRevert(
                continentAuction.createAuction(AFRICA_TOKEN.token_id, startPrice, bidIncrement, duration, { from: owner }),
                'Continent not in contract'
            );
        });

        it('should not start auction if auction is already running', async () => { 
            await continentAuction.createAuction(AFRICA_TOKEN.token_id, startPrice, bidIncrement, duration, { from: owner })

            await expectRevert(
                continentAuction.createAuction(AFRICA_TOKEN.token_id, startPrice, bidIncrement, duration, { from: owner }),
                'Auction already exists'
            );
        });

        it('should not start auction if end time is not in the future', async () => { 
            const _duration = 0;
            await expectRevert(
                continentAuction.createAuction(AFRICA_TOKEN.token_id, startPrice, bidIncrement, _duration, { from: owner }),
                'End time must be in the future'
            );
        });

        it('should create an auction', async () => {
            const { logs } = await continentAuction.createAuction(AFRICA_TOKEN.token_id, startPrice, bidIncrement, duration, { from: owner });

            assert.equal(logs[0].event, 'AuctionStarted');
            assert.equal(logs[0].args.tokenId, AFRICA_TOKEN.token_id);
        });

        it('should get an ongoing auction', async () => {
            const { logs } = await continentAuction.createAuction(AFRICA_TOKEN.token_id, startPrice, bidIncrement, duration, { from: owner });
            const auction = await continentAuction.getAuction(AFRICA_TOKEN.token_id);

            assert.equal(auction[0], AFRICA_TOKEN.token_id);
            assert.equal(auction[1], bidIncrement);
            assert.equal(auction[2], startPrice);
            assert.equal(auction[3].toString(), logs[0].args.startTime.toString());
            assert.equal(auction[4].toString(), logs[0].args.endTime.toString());
            assert.equal(auction[5], 1) //1 represents open auctionstatus enum in contract
            assert.equal(auction[6], '0x' + '0'.repeat(40));

        });

        it('should not end an auction if not started', async () => { 
            await expectRevert(
                continentAuction.endAuction(AFRICA_TOKEN.token_id, { from: owner }),
                'Auction not started'
            );
        });

        it.only('should end an auction', async () => {
            await continentAuction.createAuction(AFRICA_TOKEN.token_id, startPrice, bidIncrement, duration, { from: owner });
            const { logs } = await continentAuction.endAuction(AFRICA_TOKEN.token_id, { from: owner });

            assert.equal(logs[0].event, 'AuctionEnded');
            assert.equal(logs[0].args.winner, '0x' + '0'.repeat(40));
            assert.equal(logs[0].args.tokenId, AFRICA_TOKEN.token_id);
            assert.equal(logs[0].args.amount.toString(), startPrice);
        });
    });

    describe('Bidding', () => {
        it('should not bid if auction is not ongoing', async () => {
            const startTime = Math.floor(Date.now() / 1000) + 3600; // 1 hr from now
            const endTime = startTime + 3600; // 1 hr after start time
            await continentAuction.createAuction(AFRICA_TOKEN.token_id, startPrice, bidIncrement, startTime, endTime, { from: owner });

            await expectRevert(
                continentAuction.placeBid(AFRICA_TOKEN.token_id, { from: bidder1, value: startPrice }),
                'Auction not started'
            );
        });

        it('should not bid if auction is ended', async () => {
            await continentAuction.createAuction(AFRICA_TOKEN.token_id, startPrice, bidIncrement, startTime, endTime, { from: owner });
            await continentAuction.endAuction(AFRICA_TOKEN.token_id, { from: owner });

            await expectRevert(
                continentAuction.placeBid(AFRICA_TOKEN.token_id, { from: bidder1, value: startPrice }),
                'Auction ended'
            );
        });
    });
});