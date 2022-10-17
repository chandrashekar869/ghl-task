## Clone the repo using 

git clone https://github.com/chandrashekar869/ghl-task.git

## Switch to master 

git pull origin master

## Run the docker compose script using 

docker-compose up -d

## The UI can be accessed on hostname:3000

## The database used is mongodb with the following details

## database: 
payments-app

## collections:
transaction - Stores all the transactions 
wallet - Stores all the wallet information

## API Endpoints:
1. POST http://hostname:3000/wallet/setup - Sets up or creates a wallet
    Sample Input:
    {
      "walletName": "test wallet1",
      "walletBalance": 20
    }

2. GET http://hostname:3000/wallet - Gets all the wallets
3. GET http://hostname:3000/wallet/:walletId - Gets a single wallet
4. GET http://hostname:3000/transactions?walletId=WALLET_ID&skip=0&limit=2 - Gets transactions based on skip and limit skip is the page number

5. POST http://hostname:3000/transactions/transact/634d4c148e8e92e5a9f4d2fc - Makes a transaction based on the amount passed. Negative debit, Positive credit
    Sample Input:
    1. {
      "description": "Recharge",
      "amount": 10
       }
    2. {
      "description": "Paid",
      "amount": -10
       }
