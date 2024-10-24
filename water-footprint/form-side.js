const ethereum = window.ethereum;
const connectButton = document.getElementById('connectButton');
const addressInput = document.getElementById('walletAddress');
const sentCheckbox = document.getElementById('sent-checkbox');
const submitButton = document.getElementById('submitButton');
const targetAddress = '0xe7D6e27d2F5C46204934e635b8CE1055Dab1751b';
const contractAddress = "0xfBA686fbc8EA6490Ad5c9fDe82EB9A6FDd3b850b";
        const contractABI = [
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_eduToken",
                        "type": "address"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "organization",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "DonationSent",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "user",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "organization",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    }
                ],
                "name": "PurchaseRecorded",
                "type": "event"
            },
            {
                "inputs": [],
                "name": "donationPercentage",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "eduToken",
                "outputs": [
                    {
                        "internalType": "contract ERC20",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "user",
                        "type": "address"
                    }
                ],
                "name": "getPurchaseInfo",
                "outputs": [
                    {
                        "components": [
                            {
                                "internalType": "address",
                                "name": "user",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "amount",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address",
                                "name": "organization",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "timestamp",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct MyEcoStepsWaterFp.Purchase",
                        "name": "",
                        "type": "tuple"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "owner",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "organization",
                        "type": "address"
                    }
                ],
                "name": "purchase",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "purchases",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "user",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "organization",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "waterOrg1",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "waterOrg2",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "waterOrg3",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ];
const eduAmount = '0.1';
let userAddress = '';
let intervalId;

function updateButton(isConnected, address = '') {
    if (isConnected) {
        connectButton.textContent = "Connected";
        connectButton.style.backgroundColor = "darkgreen";
        userAddress = address;
        addressInput.value = address;
    } else {
        connectButton.textContent = "Connect MetaMask";
        connectButton.style.backgroundColor = "#007bff";
        addressInput.value = '';
        userAddress = '';
    }
}

async function checkConnection() {
    if (ethereum) {
        try {
            const accounts = await ethereum.request({
                method: 'eth_accounts'
            });
            if (accounts.length > 0) {
                updateButton(true, accounts[0]);
            } else {
                updateButton(false);
            }
        } catch (error) {
            console.error('Error checking connection:', error);
        }
    }
}

connectButton.addEventListener('click', async () => {
    if (ethereum) {
        try {
            const accounts = await ethereum.request({
                method: 'eth_requestAccounts'
            });
            if (accounts.length > 0) {
                updateButton(true, accounts[0]);
            }
        } catch (error) {
            console.error('Error connecting:', error);
        }
    } else {
        alert('MetaMask is not installed. Please install it to use this app.');
    }
});

setInterval(checkConnection, 3000);
checkConnection();

async function startTransaction() {
    if (validateForm()) {
        try {
            const transactionParameters = {
                to: targetAddress,
                from: userAddress,
                value: (parseInt(eduAmount * 1e18)).toString(16)
            };
            const txHash = await ethereum.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });
            console.log('Transaction sent:', txHash);
            intervalId = setInterval(checkTransactionStatus, 3000);
        } catch (error) {
            console.error('Transaction failed:', error);
        }
    } else {
        alert('Please fill out all required fields and confirm the checkbox.');
    }
}

function validateForm() {
    return sentCheckbox.checked &&
        document.getElementById('products').value !== '' &&
        document.getElementById('options').value !== '' &&
        document.getElementById('mail').value !== '' &&
        document.getElementById('phone').value !== '' &&
        document.getElementById('deliveryAddress').value !== '';
}

async function checkTransactionStatus() {
    const baseUrl = 'https://opencampus-codex.blockscout.com/api?';
    const apiParams = `module=account&action=txlist&address=${targetAddress}&sort=desc&page=1&offset=10`;

    try {
        const response = await fetch(`${baseUrl}${apiParams}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const transactions = data.result;

        const fiveMinutesAgo = Date.now() - 1 * 60 * 1000;
        const filteredTx = transactions.filter(tx =>
            tx.from.toLowerCase() === userAddress.toLowerCase() &&
            parseInt(tx.value) >= 0.095 * 1e18 &&
            tx.timeStamp * 1000 >= fiveMinutesAgo
        );

        if (filteredTx.length > 0) {
            alert("MyEcoSteps has successfully received your submission.");
            resetForm();
            clearInterval(intervalId);
        }
    } catch (error) {
        console.error('Failed to fetch transactions:', error);
    }
}

function resetForm() {
    document.getElementById('products').value = '';
    document.getElementById('options').value = '';
    document.getElementById('mail').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('deliveryAddress').value = '';
    sentCheckbox.checked = false;
}