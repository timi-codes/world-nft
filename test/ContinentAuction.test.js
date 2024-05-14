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

    beforeEach(async () => {
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

    });

    describe('Bidding', () => {
        it('should not bid if auction is not open', async () => {
            const oneSecDuration = 1; // 1 sec

            await continentAuction.createAuction(AFRICA_TOKEN.token_id, startPrice, bidIncrement, oneSecDuration, { from: owner });
            await new Promise(resolve => setTimeout(resolve, 2000)); // wait for auction to end

            const bidAmount = web3.utils.toBN(startPrice).add(web3.utils.toBN(bidIncrement));

            await expectRevert(
                continentAuction.placeBid(AFRICA_TOKEN.token_id, { from: bidder1, value: bidAmount.toString() }),
                'Auction ended or not started'
            );
        });

        it('should not place bid if owner already owns a continent', async () => { 
            await continentToken.transferTokenFromContract(AFRICA_TOKEN.token_id, bidder1, { from: owner });
            const asiaTokenId = 2;
            await continentAuction.createAuction(asiaTokenId, startPrice, bidIncrement, duration, { from: owner });

            await expectRevert(
                continentAuction.placeBid(asiaTokenId, { from: bidder1, value: startPrice }),
                'You already own a continent'
            );
        });

        it('bid should be higher than current bid', async () => { 
            await continentAuction.createAuction(AFRICA_TOKEN.token_id, startPrice, bidIncrement, duration, { from: owner });

            await expectRevert(
                continentAuction.placeBid(AFRICA_TOKEN.token_id, { from: bidder1, value: startPrice }),
                'Bid must be higher than current bid by at least the bid increment'
            );
        });

        it('should place bid successfully', async () => { 
            const bidAmount = web3.utils.toBN(startPrice).add(web3.utils.toBN(bidIncrement));

            await continentAuction.createAuction(AFRICA_TOKEN.token_id, startPrice, bidIncrement, duration, { from: owner });

            const { logs } = await continentAuction.placeBid(AFRICA_TOKEN.token_id, { from: bidder1, value: bidAmount.toString() });

            assert.equal(logs[0].event, 'BidPlaced');
            assert.equal(logs[0].args.tokenId, AFRICA_TOKEN.token_id);
            assert.equal(logs[0].args.bidder, bidder1);
            assert.equal(logs[0].args.amount.toString(), bidAmount.toString());
        });

        it('should update auctions with highest bid', async () => { 
            const bidAmount = web3.utils.toBN(startPrice).add(web3.utils.toBN(bidIncrement));

            await continentAuction.createAuction(AFRICA_TOKEN.token_id, startPrice, bidIncrement, duration, { from: owner });
            await continentAuction.placeBid(AFRICA_TOKEN.token_id, { from: bidder2, value: bidAmount.toString() });

            const auction = await continentAuction.getAuction(AFRICA_TOKEN.token_id);
            const bids = await continentAuction.getBids(AFRICA_TOKEN.token_id);

            assert.equal(auction[2].toString(), bidAmount.toString());
            assert.equal(auction[6], bidder2);

            assert.equal(bids[0][0].toString(), bidAmount.toString());
            assert.equal(bids[0][2], bidder2);
        });

        it('should refund previous highest bidder after new bid is placed', async () => {
            const firstBidAmount = web3.utils.toBN(startPrice).add(web3.utils.toBN(bidIncrement));

            await continentAuction.createAuction(AFRICA_TOKEN.token_id, startPrice, bidIncrement, duration, { from: owner });
            await continentAuction.placeBid(AFRICA_TOKEN.token_id, { from: bidder1, value: firstBidAmount.toString() });
            const initialBalanceOfBidder1 = await web3.eth.getBalance(bidder1);

            const secondBidAmount = web3.utils.toBN(firstBidAmount).add(web3.utils.toBN(bidIncrement));
            await continentAuction.placeBid(AFRICA_TOKEN.token_id, { from: bidder2, value: secondBidAmount.toString() });

            const finalBalanceOfBidder1 = await web3.eth.getBalance(bidder1);
            const expectedBalanceOfBidder1 = web3.utils.toBN(initialBalanceOfBidder1).add(web3.utils.toBN(firstBidAmount));

            assert.equal(expectedBalanceOfBidder1.toString(), finalBalanceOfBidder1, "Previous highest bidder balance incorrect");

        });

    });
});