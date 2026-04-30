import React from 'react'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

const PayPalButton = ({ onSuccess, onError, amount }) => {
    const formattedAmount = Number(amount).toFixed(2);

    return (
        <PayPalScriptProvider options={{ 
            clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID, 
        }}>
            <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [
                            {
                                amount: {
                                    value: formattedAmount,
                                },
                            },
                        ],
                    });
                }}
                onApprove={(data, actions) => {
                    return actions.order.capture().then(onSuccess);
                }}
                onError={onError}
            />
        </PayPalScriptProvider>
    )
}

export default PayPalButton
