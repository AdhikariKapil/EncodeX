import base64

from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding, rsa


def generate_rsa_keypair(key_size: int = 2048):
    private_key = rsa.generate_private_key(
        public_exponent=65537, key_size=key_size, backend=default_backend()
    )
    public_key = private_key.public_key()

    private_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption(),
    )
    public_pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo,
    )

    return {
        "private_key": private_pem.decode("utf-8"),
        "public_key": public_pem.decode("utf-8"),
    }


def rsa_encrypt(plaintext: str, public_key_pem: str) -> str:
    # Load the public key
    public_key = serialization.load_pem_public_key(
        public_key_pem.encode("utf-8"), backend=default_backend()
    )

    # Ensure it's an RSA public key
    if not isinstance(public_key, rsa.RSAPublicKey):
        raise TypeError("Provided key is not an RSA public key")

    # Encrypt using OAEP padding
    ciphertext = public_key.encrypt(
        plaintext.encode("utf-8"),
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None,
        ),
    )
    return base64.b64encode(ciphertext).decode("utf-8")


def rsa_decrypt(ciphertext_b64: str, private_key_pem: str) -> str:
    # Load the private key
    private_key = serialization.load_pem_private_key(
        private_key_pem.encode("utf-8"), password=None, backend=default_backend()
    )

    # Ensure it's an RSA private key
    if not isinstance(private_key, rsa.RSAPrivateKey):
        raise TypeError("Provided key is not an RSA private key")

    # Decode base64
    ciphertext = base64.b64decode(ciphertext_b64)

    # Decrypt using OAEP padding
    plaintext = private_key.decrypt(
        ciphertext,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None,
        ),
    )
    return plaintext.decode("utf-8")


def rsa_visualize(plaintext: str, public_key_pem: str):
    # Load the public key
    public_key = serialization.load_pem_public_key(
        public_key_pem.encode("utf-8"), backend=default_backend()
    )

    # Ensure it's an RSA public key
    if not isinstance(public_key, rsa.RSAPublicKey):
        raise TypeError("Provided key is not an RSA public key")

    # Extract public numbers
    pub_numbers = public_key.public_numbers()
    n = pub_numbers.n
    e = pub_numbers.e

    # Convert plaintext to integer (simplified, no padding)
    plaintext_bytes = plaintext.encode("utf-8")
    plaintext_int = int.from_bytes(plaintext_bytes, "big")

    # Encrypt math: c = m^e mod n
    ciphertext_int = pow(plaintext_int, e, n)

    n_bits = n.bit_length()

    # Build visualization steps
    steps = [
        {
            "step": 1,
            "title": "Plaintext to Integer",
            "description": f"Convert '{plaintext}' to bytes and then to an integer.",
            "details": {
                "plaintext": plaintext,
                "bytes": list(plaintext_bytes),
                "integer": plaintext_int,
            },
        },
        {
            "step": 2,
            "title": "Public Key Components",
            "description": "Extract modulus (n) and public exponent (e) from the key.",
            "details": {"n": n, "e": e, "n_bits": n_bits},
        },
        {
            "step": 3,
            "title": "Encryption Formula",
            "description": f"c = m^e mod n",
            "details": {
                "formula": f"c = {plaintext_int}^{e} mod {n}",
                "ciphertext_integer": ciphertext_int,
            },
        },
        {
            "step": 4,
            "title": "Ciphertext",
            "description": "Convert the resulting integer to base64 for transmission.",
            "details": {
                "ciphertext_integer": ciphertext_int,
                "ciphertext_base64": base64.b64encode(
                    ciphertext_int.to_bytes(
                        (ciphertext_int.bit_length() + 7) // 8, "big"
                    )
                ).decode("utf-8"),
            },
        },
    ]

    return {
        "plaintext": plaintext,
        "ciphertext": base64.b64encode(
            ciphertext_int.to_bytes((ciphertext_int.bit_length() + 7) // 8, "big")
        ).decode("utf-8"),
        "steps": steps,
        "public_key_info": {"n": n, "e": e, "bit_length": n_bits},
    }
