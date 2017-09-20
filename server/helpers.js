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