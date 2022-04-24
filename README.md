# Algo Vote

**Check out the application here**: [Algo Vote](https://www.algo-vote.com/)

This app was created as a proof of concept for how a decentralized voting system could work. The frontend and backend are both hosted in a centralized manner to provide convenience to the end user, but all voting logic is carried out using smart contracts on the algorand blockchain. Thus, it is possible (but much less convenient) to handle all aspects of the voting process by interacting with the smart contract directly on the blockchain instead of using this app.

## Basic Voting Workflow

Step 1: [Create the vote](https://www.algo-vote.com/createVote)

-   Click 'Create Vote'.
-   Select 'New Accounts' if you want to generate new algorand accounts (or if you want to mix new accounts with existing accounts) or 'Pre-Funded Accounts' if you already have accounts ready to use for the vote.<br/> Note: making new accounts is more expensive because it's assumed that the creator will fund them all with the minimum algo balance required for the vote.
-   Add candidates for the vote, either by uploaded a csv or excel file, or entering them manually.
-   Enter a start date & time for the vote (must start at some point in the future).
-   Enter an end date & time for the vote.
-   After reviewing the details, paste the secret key of the account that will be used to fund the vote.
-   If the transactions are successful, a link will appear to view the smart contract on the blockchain and an excel file with all the vote details will be created.

Step 2: [Participate in the vote](https://www.algo-vote.com/participateVote)

-   Any prefunded accounts must register to participate in the vote (registration **MUST** happen before the vote starts).<br/> Note: new accounts are automatically opted in to the vote when the vote is created.
-   Once the vote begins, all registered participants can use the 'Voting' workflow to select their candidate of choice and cast their vote.

Step 3: [View the vote results](https://www.algo-vote.com/voteResults)

-   At any point after a vote's inception, anyone can view the results of the vote within the application by navigating to 'View Vote Results' and entering the vote's application id.
-   The information provided includes statistics on how many participants have registered/voted, how many votes each candidate has received, the start and end times of the vote, and so on.
-   Additionally, links are provided to view the smart contract details directly on the blockchain explorer.

## Demo videos

Using all new accounts:

https://user-images.githubusercontent.com/55325093/156935723-e4f610f8-635a-44b6-9905-0aeca1ee97ea.mp4

Using prefunded accounts:

https://user-images.githubusercontent.com/55325093/156935692-72d19389-45e6-4d8c-b1fd-f52041cdddab.mp4

## Donations

Donations to support the maintenance, development, and scaling of this app are more than welcome :blush:.

### Bitcoin

```
bc1q950thswhn6wc2qmrh73y86qjhft86qq3p6gd58
```

![](frontend/src/images/BTC.png)

### Ethereum

```
0x363C4B0973E88C9f016abE6c98f1314b3BF35d8a
```

![](frontend/src/images/ETH.png)

### Algorand

```
ZGCQ73NMFLN3NWMLFFXTRDVKOKX2C33HTDDK7MVNACCDEOTVMRRA7YAYME
```

![](frontend/src/images/ALGO.png)
