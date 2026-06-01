def rail_fence_encrypt(text: str, rails: int) -> dict:
    """
    Encrypt text using Rail Fence cipher with visualization

    Args:
        text: The plaintext to encrypt
        rails: Number of rails (2-10) (capping it to 10)

    Returns:
        Dictionary containing encrypted_text, rail matrix and visualization step
    """
    rails = max(rails, 2)
    rails = min(rails, 10)

    # Create empty rail matrix
    rail_matrix = [["" for _ in range(len(text))] for _ in range(rails)]

    # Simulate zigzag movement
    row, direction = 0, 1  # 1 = down, -1 = up
    positions = []  # Track positions of each character

    for i, char in enumerate(text):
        rail_matrix[row][i] = char
        positions.append(
            {
                "char": char,
                "rail": row,
                "position": i,
                "direction": "down" if direction == 1 else "up",
            }
        )

        # Move to next rail
        if row == 0:
            direction = 1
        elif row == rails - 1:
            direction = -1
        row += direction

    # Read encrypted text row by row
    encrypted_chars = []
    visualization = []

    for rail_num in range(rails):
        for col_num, char in enumerate(rail_matrix[rail_num]):
            if char:  # Only process non-empty cells
                encrypted_chars.append(char)
                visualization.append(
                    {
                        "original_char": char,
                        "original_position": None,
                        "rail": rail_num,
                        "column": col_num,
                        "new_char": char,
                        "formula": f"Moved to rail {rail_num}, column {col_num}",
                    }
                )
    encrypted_text = "".join(encrypted_chars)

    # Create visual rail representation for frontend
    visual_rails = []
    for rail_num in range(rails):
        rail_content = []
        for col_num, char in enumerate(rail_matrix[rail_num]):
            if char:
                rail_content.append({"char": char, "column": col_num})
            else:
                rail_content.append({"char": ".", "column": col_num})

        visual_rails.append({"rail_number": rail_num, "content": rail_content})

    return {
        "encrypted_text": encrypted_text,
        "visualization": visualization,
        "rail_matrix": rail_matrix,
        "visual_rails": visual_rails,
        "positions": positions,
    }


def rail_fence_decrypt(ciphertext: str, rails: int) -> dict:
    """
    Decrypt text using Rail Fence cipher.

    Args:
        ciphertext: The encrypted text
        rails: Number of rails used for encryption

    Returns:
        Dictionary containing decrypted text and visualization
    """
    rails = max(rails, 2)
    rails = min(rails, 10)

    length = len(ciphertext)

    # Create empty rail matrix
    rail_matrix = [["" for _ in range(length)] for _ in range(rails)]

    # Mark positions where characters should go
    row, direction = 0, 1
    for i in range(length):
        rail_matrix[row][i] = "*"
        if row == 0:
            direction = 1
        elif row == rails - 1:
            direction = -1
        row += direction

    # Fill the matrix with ciphertext
    index = 0
    for rail_num in range(rails):
        for col_num in range(length):
            if rail_matrix[rail_num][col_num] == "*" and index < length:
                rail_matrix[rail_num][col_num] = ciphertext[index]
                index += 1

    # Read in zigzag order to get plain text
    decrypted_chars = []
    visualization = []
    row, direction = 0, 1

    for i in range(length):
        char = rail_matrix[row][i]
        decrypted_chars.append(char)
        visualization.append(
            {
                "original_char": char,
                "rail": row,
                "coloumn": i,
                "formula": f"Read from rail {row}, column {i}",
            }
        )

        if row == 0:
            direction = 1
        elif row == rails - 1:
            direction = -1
        row += direction

    decrypted_text = "".join(decrypted_chars)

    # Create visual representation
    visual_rails = []
    for rail_num in range(rails):
        rail_content = []
        for col_num, char in enumerate(rail_matrix[rail_num]):
            if char and char != "*":
                rail_content.append({"char": char, "column": col_num})
            else:
                rail_content.append({"char": ".", "column": col_num})
        visual_rails.append({"rail_number": rail_num, "content": rail_content})

    return {
        "decrypted_text": decrypted_text,
        "visualization": visualization,
        "visual_rails": visual_rails,
    }

    def rail_fence_visualize(text: str, rails: int, operation: str = "encrypt") -> dict:
        """
        Generate detailed visualization of rail fence process.
        """
        if operation == "encrypt":
            result = rail_fence_encrypt(text, rails)
            return {
                "operation": "encrypt",
                "original_text": text,
                "result_text": result["encrypted_text"],
                "rails": rails,
                "visual_rails": result["visual_rails"],
                "positions": result["positions"],
            }
        else:
            result = rail_fence_decrypt(text, rails)
            return {
                "operation": "decrypt",
                "original_text": text,
                "result_text": result["decrypted_text"],
                "rails": rails,
                "visual_rails": result["visual_rails"],
            }
