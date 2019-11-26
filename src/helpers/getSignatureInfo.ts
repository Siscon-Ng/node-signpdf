import { asn1, pkcs12, pki, util } from 'node-forge';
import { ERROR_VERIFY_SIGNATURE, SignPdfError } from '../SignPdfError';

export function getSignatureInfo(buffer: Buffer, password?: string) {
  try {
    const p12Buffer = buffer.toString('base64');
    const p12Der = util.decode64(p12Buffer);
    const p12Asn1 = asn1.fromDer(p12Der);
    const p12 = pkcs12.pkcs12FromAsn1(p12Asn1, password || '');
    const bagkey = pki.oids.pkcs8ShroudedKeyBag;
    const pkcs8Bags2 = p12.getBags({ bagType: bagkey }) as { [bagkey: string]: pkcs12.Bag[] };
    const keyObject = pkcs8Bags2[bagkey][0].key as pki.PrivateKey;
    const localKeyId = pkcs8Bags2[bagkey][0].attributes.localKeyId;
    const key = pki.privateKeyToPem(keyObject);
    const certBags = p12.getBags({
      bagType: pki.oids.certBag, localKeyId: localKeyId[0]
    }) as { localKeyId: pkcs12.Bag[] };
    const cert = certBags.localKeyId[0].cert;
    return cert?.subject.getField('CN').value;
  } catch (e) {
    throw new SignPdfError(e.message, ERROR_VERIFY_SIGNATURE)
  }
}
