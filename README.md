# Algo Vote

**DISCLAIMER**:
THIS APP IS USING TESTNET AND MEANT ONLY AS A PROOF OF CONCEPT, DON'T USE MAINNET ACCOUNTS WHEN INTERACTING WITH IT.
FOR ALL INTENSIVE PURPOSES, FULL VOTING PROCESSES CAN BE CREATED RELIABLY, JUST MAKE SURE YOU USE A TESTNET ACCOUNT.

A NEW TESTNET ACCOUNT CAN BE **CREATED** BY CLICKING _HERE_ AND **FUNDED** BY CLICKING _HERE_

This app was created as a proof of concept for how a decentralized voting system could work. The frontend and backend are both hosted in a centralized manner to provide convenience to the end user, but all voting logic is carried out using smart contracts on the algorand blockchain. Thus, it is possible (but much less convenient) to handle all aspects of the voting process by interacting directly with the blockchain instead of using this app.

## Basic Voting Workflow

Step 1: Create the vote

-   Click 'Create Vote'
-   Select 'New Accounts' if you want to generate new algorand accounts (or if you want to mix new accounts with existing accounts) or 'pre-funded accounts' if you already have accounts ready to use for this vote
    Note: making new accounts is more expensive because it's assumed that the creator will fund them all with the minimum algo balance required for the vote.
-   Add candidates for the vote, either by uploaded a csv or excel file, or entering them manually
-   Enter a start date & time for the vote (must start at some date into the future)
-   Enter an end date & time for the vote
-   After, reviewing the details, paste the secret key of the account that will be used to fund the vote (creating smart contracts & voting token, and funding any new accounts)
-   If the transactions are successful, a link will appear to view the smart contract on the blockchain and an excel file with all the vote details will be created

Step 2: Participate in the vote

-   Any prefunded accounts must register to participate in the vote (registration MUST HAPPEN before the start date & time of the vote)
    NOTE: new accounts are automatically opted into the vote when the vote is created
-   Once the vote begins, all participants can use tohe 'Voting' workflow to select their candidate of choice and cast their vote

Step 3: View the vote results

-   At any point after a vote's inception, anyone can view the results of the vote within the application by navigating to 'View Vote Results' and entering the vote's application id
-   The information provided includes statistics on how many participants have registered/voted, how many votes each candidate has received, the total number of votes eligibile to be cast, and the start and end times of the vote
-   Additionally, links are provided to view the smart contract details directly on the blockchain explorer

## Demo videos

Using all new accounts:
video

Using brand new accounts:
video

## Donations

Donations to support the maintenance, continued development, and scaling of this app are more than welcome ☺️

BTC:

ETH:

ALGO:
