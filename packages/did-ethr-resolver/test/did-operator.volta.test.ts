// eslint-disable-next-line import/no-extraneous-dependencies
import { Keys } from '@ew-did-registry/keys';
import {
  ProviderTypes,
  ProviderSettings,
} from '@ew-did-registry/did-resolver-interface';
import { Methods } from '@ew-did-registry/did';
import { utils, Wallet, providers } from 'ethers';
import { Operator, ethrReg, VoltaAddress1056 } from '../src';
import { EwPrivateKeySigner, IdentityOwner } from '../src/implementations';

/**
 * This test takes a long time and has external depency on Volta RPC and a funded account.
 * It is useful though because it tests an actual tx execution.
 * I.e. does a given version of ethers work with the Volta RPC.
 * But it is not so reliable to finish quickly, so it is skipped by default
 */
describe.skip('[RESOLVER PACKAGE]: DID-OPERATOR VOLTA', function didOperatorTests() {
  this.timeout('25s'); // Long timeout is necessary because executing actual tx against Volta

  const rpcUrl = 'https://volta-rpc.energyweb.org';
  const faucetWallet = new Wallet('f86ce072924c23598c3d93df4f9cef9deec6261e62c86f0405729655014092e6', new providers.JsonRpcProvider(rpcUrl)); // 0xc6e301182CEb796Eb598c9209E1852215434c9ad
  const keys = new Keys(); // Creating a new account so that can test fresh addition of DID Doc
  const providerSettings: ProviderSettings = {
    type: ProviderTypes.HTTP,
    uriOrInfo: rpcUrl,
  };
  const owner = IdentityOwner.fromPrivateKeySigner(
    new EwPrivateKeySigner(keys.privateKey, providerSettings),
  );
  const operator = new Operator(
    owner,
    { method: Methods.Erc1056, abi: ethrReg.abi, address: VoltaAddress1056 },
  );

  beforeEach(async () => {
    // The new account must be funded with VT in order to execute transactions on Volta
    // It is exepected therefore that the fundingWallet has sufficient volta token
    const txResponse = await faucetWallet.sendTransaction({
      from: faucetWallet.address,
      to: keys.getAddress(),
      value: utils.parseEther('0.05'),
    });
    await txResponse.wait();
  });

  it('operator should be able to create did doc', async () => {
    await operator.create();
  });
});
