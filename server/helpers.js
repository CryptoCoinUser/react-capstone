


exports.chooseRecentTx = (addrRes) => {
    let tx;
    if(addrRes.unconfirmed_txrefs){
        return addrRes.unconfirmed_txrefs[0].tx_hash;
    }else if(addrRes.txrefs){
        return addrRes.txrefs[0].tx_hash;
    } else {
        return 'warning: addrRes has neither unconfirmed_txrefs nor txrefs';
    }
}


exports.txRefreshFromAddrRes = (tx, addrRes) => {
    const txReport = {
        'preference': undefined,
        'confirmed' : undefined,
        'confirmations': -1,
        'internalMemo': ''
    }

    if(tx == -1){
        txReport.internalMemo += 'warning: tx was -1';
        tx = chooseRecentTx(addrRes);
    }

    if(addrRes.unconfirmed_txrefs){
        for (i = 0; i < addrRes.unconfirmed_txrefs.length; i++){
            if(addrRes.unconfirmed_txrefs[i].tx_hash == tx){
                txReport.preference = addrRes.unconfirmed_txrefs[i].preference;
                txReport.confirmed = false;
                return txReport;
            }
        }
    } 
    if(addrRes.txrefs){
        for (i = 0; i < addrRes.txrefs.length; i++){
           if(addrRes.txrefs[i].tx_hash == tx){
                txReport.confirmations = addrRes.txrefs[i].confirmations;
                txReport.confirmed = true;
                return txReport;
            }
        }
    }

    return txReport;  
}


exports.getAddrValueFromTxRes = (theAddress, txRes) => {
    let addrReport = {
        inInputs: undefined,
        output_value: -1,
        inOutputs: undefined,
        value: -1
    }
    if(txRes.outputs){
        for(var i = 0; i < txRes.outputs.length; i++){
            if(txRes.outputs[i].addresses){
                for(var k = 0; k < txRes.outputs[i].addresses.length; k++){
                    if (txRes.outputs[i].addresses[k] == theAddress){
                        addrReport.inOutputs = true;
                        addrReport.value = txRes.outputs[i].value;
                        return addrReport;
                    }
                }
            }
        }
    }
    if(txRes.inputs){
        for(var i = 0;  i< txRes.inputs.length; i++){
            if(txRes.inputs[i].addresses){
                for(var k = 0; k < txRes.inputs[i].addresses.length; k++){
                    if(txRes.inputs[i].addresses[k] == theAddress){
                        addrReport.inInputs = true;
                        addrReport.output_value = txRes.inputs[i].output_value;
                        return addrReport
                    }
                }
            }
        }
    }
    return addrReport
}
