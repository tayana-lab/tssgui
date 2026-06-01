import forge from 'node-forge';

const encryptPayload = async (params, serverPublicKeyPem) => {
  try {

    const aesKey = forge.random.getBytesSync(16);

    const iv = forge.random.getBytesSync(16);

    const cipher = forge.cipher.createCipher('AES-CBC', aesKey);
    cipher.start({ iv });
    cipher.update(
      forge.util.createBuffer(JSON.stringify(params), 'utf8')
    );
    cipher.finish();

    const encryptedPayload = forge.util.encode64(
      cipher.output.getBytes()
    );

    const publicKey = forge.pki.publicKeyFromPem(serverPublicKeyPem);

    const encryptedKey = forge.util.encode64(
      publicKey.encrypt(aesKey, 'RSA-OAEP', {
        md: forge.md.sha256.create(),
        mgf1: {
          md: forge.md.sha256.create(),
        },
      })
    );

    return {
      encryptedKey,
      encryptedPayload,
      iv: forge.util.encode64(iv),
    };

  } catch (error) {
    console.error('Encryption Error:', error);
    throw error;
  }
};

export default encryptPayload;
