function calculate_transaction_fees(base_fee, max_fee, max_prio_fee, blob_base_fee, max_blob_prio, execution_gas_used, blobs_count) {
    const GAS_PER_BLOB = 131072;  // Gas per blob

    const total_blob_gas = blobs_count * GAS_PER_BLOB;

    const total_blob_base_fee = total_blob_gas * blob_base_fee;
    const total_blob_prio_fee = total_blob_gas * max_blob_prio;
    
    const total_blob_fee = total_blob_base_fee + total_blob_prio_fee;
    
    if (base_fee + max_prio_fee > max_fee) {
        max_prio_fee = max_fee - base_fee;
    }
    
    const total_combined = execution_gas_used * base_fee + execution_gas_used * max_prio_fee + total_blob_fee;

    const new_max_prio_fee = (total_combined - total_blob_base_fee - execution_gas_used * base_fee) / execution_gas_used;
    return {
        "max_fee_per_gas": (new_max_prio_fee + base_fee),
        "max_priority_fee_per_gas": new_max_prio_fee,
    };
}

function calculateFees() {
    const form = document.getElementById('feeForm');
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => data[key] = parseFloat(value));

    const fees = calculate_transaction_fees(data.base_fee, data.max_fee, data.max_prio_fee, data.blob_base_fee, data.max_blob_prio, data.execution_gas_used, data.blobs_count);
    
    document.getElementById('result').innerText = `Max Fee per Gas: ${fees.max_fee_per_gas.toFixed(2)}, Max Priority Fee per Gas: ${fees.max_priority_fee_per_gas.toFixed(2)}`;
}
