import hashlib


def hash_password(password: str, algorithm: str) -> str:
    if algorithm == "md5":
        return hashlib.md5(password.encode()).hexdigest()
    elif algorithm == "sha256":
        return hashlib.sha256(password.encode()).hexdigest()
    else:
        raise ValueError("Unsupported algorithm")


def verify_password(password: str, stored_hash: str, algorithm: str) -> bool:
    return hash_password(password, algorithm) == stored_hash
