var secrets = require('./secrets.js')
var ethereumjsWallet = require('ethereumjs-wallet');
var Web3 = require("web3");
var ProviderEngine = require("web3-provider-engine");
var FilterSubprovider = require('web3-provider-engine/subproviders/filters.js');
var WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js');
var Web3Subprovider = require("web3-provider-engine/subproviders/provider.js");

// create wallet from existing private key
var privateKey = secrets.config.myPrivateKey;
var wallet = ethereumjsWallet.fromPrivateKey(new Buffer(privateKey, "hex"));

Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;

// mainnet
var providerURL = {
	Ellaism: "https://jsonrpc.ellaism.org",
	Shikinseki: "https://jsonrpc.testnet.ellaism.org"
};
var engines = {
    Ellaism: new ProviderEngine(),
	  Shikinseki: new ProviderEngine()
};
var networks = ["Ellaism", "Shikinseki"];
for (let i in networks) {
    engines[networks[i]].addProvider(new FilterSubprovider());
    engines[networks[i]].addProvider(new WalletSubprovider(wallet, {}));
    engines[networks[i]].addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(providerURL[networks[i]])));
    engines[networks[i]].start();
}
var gas = 4700000;
var gasPrice = 1.5*1e9;

module.exports = {
    networks: {
        ellaism: {
			    network_id: 64,
			    provider: engines["Ellaism"],
			    gas: gas,
			    gasPrice: gasPrice,
			    from: secrets.config.myAddress
		    },
	      shikinseki: {
			    network_id: 16448,
			    provider: engines["Shikinseki"],
			    gas: gas,
			    gasPrice: gasPrice,
			    from: secrets.config.myAddress
		    }
    }
};
