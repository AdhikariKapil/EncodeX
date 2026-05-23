def caesar_encrypt(text: str, shift: int) -> dict:
    """
    Encrypt text using Caesar cipher.

    Args:
        text: The plaintext to encrypt
        shift: Number of position to shift (1-25)

    Return:
        Encrypted ciphertext.
    """

    result_chars = []
    visualization = []
    for char in text:
        if char.isalpha():
            # Determine if uppercase or lowercase
            start = ord("A") if char.isupper() else ord("a")

            # Apply shift and wrap around using modulo 26
            original_pos = ord(char) - start
            new_pos = (original_pos + shift) % 26
            new_char = chr(start + new_pos)

            result_chars.append(new_char)
            visualization.append(
                {
                    "original_char": char,
                    "original_position": original_pos,
                    "shift_amount": shift,
                    "new_position": new_pos,
                    "new_char": new_char,
                    "formula": f"({original_pos} + {shift}) mod 26 = {new_pos}",
                }
            )
        else:
            # Keep non-alphabet character as is
            result_chars.append(char)
            visualization.append(
                {
                    "original_char": char,
                    "original_position": None,
                    "shift_amount": shift,
                    "new_position": None,
                    "new_char": char,
                    "formula": "non-alphabet (unchanged)",
                }
            )

    return {"ciphered_text": "".join(result_chars), "visualization": visualization}


def caesar_decrypt(text: str, shift: int) -> dict:
    """
    Decrypt text using Caesar cipher.

    Args:
        text:  The ciphertext to decrypt
        shift: Number of position to shift back (1-25)

    Return:
        Decrypted plaintext.
    """
    return caesar_encrypt(text, -shift)


def caesar_bruteforce(ciphertext: str) -> list[dict]:
    """
    Try all 25 possible shifts to bruteforce Caesar cipher.

    Args:
        ciphertext: The encrypted text.

    Return:
        List of dictionaries with shift and attempted decryption.
    """

    result = []
    for shift in range(1, 26):
        decrypted = caesar_decrypt(ciphertext, shift)
        result.append({"shift": shift, "decrypted_text": decrypted["ciphered_text"]})

    return result
