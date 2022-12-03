/* eslint-disable import/no-extraneous-dependencies */
import {
  // OnTransactionHandler,
  OnRpcRequestHandler,
} from '@metamask/snap-types';
import { hasProperty, isObject, remove0x } from '@metamask/utils';

// import {  } from '@metamask/snap-types';

/**
 * Get a message from the origin. For demonstration purposes only.
 *
 * @param originString - The origin string.
 * @returns A message based on the origin.
 */
export const getMessage = (originString: string): string =>
  `Hello, ${originString}!`;

// /**
//  * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
//  *
//  * @param args - The request handler args as object.
//  * @param args.origin - The origin of the request, e.g., the website that
//  * invoked the snap.
//  * @param args.request - A validated JSON-RPC request object.
//  * @returns `null` if the request succeeded.
//  * @throws If the request method is not valid for this snap.
//  * @throws If the `snap_confirm` call failed.
//  */
export const onRpcRequest: OnRpcRequestHandler = ({ origin, request }) => {
  switch (request.method) {
    case 'hello':
      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: getMessage(origin),
            description:
              'This custom confirmation is just for display purposes.',
            textAreaContent:
              'But you can edit the snap source code to make it do something, if you want to!',
          },
        ],
      });
    default:
      throw new Error('Method not found.');
  }
};

export const onTransaction: any = async (
  transaction: Record<string, unknown>,
) => {
  console.log('superman', transaction);

  // const insights: { type: string; params?: Json } = {
  //   type: 'Unkown transaction',
  // };

  // if (!isObject(transaction) || !hasProperty(transaction, 'data') || typeof transaction.data !== 'string') {
  //   console.log('Unknown transaction type');
  //   return { insights };
  // }
  if (
    !isObject(transaction) ||
    !hasProperty(transaction, 'data') ||
    typeof transaction.data !== 'string'
  ) {
    return {
      type: 'Unknown transaction',
    };
  }

  const data = remove0x(transaction.data);

  const transactionData = data.split('0x')[1];
  const functionSignature = transactionData.slice(0, 8);

  console.log(transactionData, functionSignature);

  // let info = '';

  const info = await fetch(
    `http://sin3point14.net:8000/description?contract_addr=${transactionData}&four_byte=${functionSignature}`,
  );
  console.log(info);

  const result = await info.json();
  console.log(result);
  return {
    insights: result,
  };
};
