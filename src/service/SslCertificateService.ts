import fs from 'fs';
import forge from 'node-forge';
import path from 'path';

const certAttributes = [
  {
    name: 'commonName',
    value: 'localhost',
  },
  {
    name: 'countryName',
    value: 'UA',
  },
  {
    shortName: 'ST',
    value: 'KH',
  },
  {
    name: 'localityName',
    value: 'Kharkiv',
  },
  {
    name: 'organizationName',
    value: 'Arystoteles',
  },
  {
    shortName: 'OU',
    value: 'Test',
  },
];

namespace SslCertificateService {
  export function generateCertificate() {
    const pki = forge.pki;
    const keys = pki.rsa.generateKeyPair(2048);

    const cert = pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.serialNumber = '01';
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(
      cert.validity.notBefore.getFullYear() + 1,
    );
    cert.setSubject(certAttributes);
    cert.setIssuer(certAttributes);
    cert.sign(keys.privateKey);

    const pemCertificate = pki.certificateToPem(cert);
    fs.writeFileSync(
      `${__dirname}/../../cert/key.pem`,
      pki.privateKeyToPem(keys.privateKey),
    );
    fs.writeFileSync(
      path.resolve(`${__dirname}/../../cert/cert.pem`),
      pemCertificate,
    );
  }

  export function getPrivateKey() {
    return fs
      .readFileSync(path.resolve(`${__dirname}/../../cert/key.pem`))
      .toString();
  }

  export function getCertificate() {
    return fs
      .readFileSync(path.resolve(`${__dirname}/../../cert/cert.pem`))
      .toString();
  }
}
export default SslCertificateService;
