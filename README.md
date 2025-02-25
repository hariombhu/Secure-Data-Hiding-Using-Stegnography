Secure Data Hiding Using Stegnography

##  Overview
This project implements **image steganography** to securely hide and retrieve **AES-encrypted messages** within images using the **Least Significant Bit (LSB) technique**. It ensures **confidential communication** by combining encryption and steganography for a dual-layer security approach.

##  Features

###  **Advanced Security**
- AES encryption before data embedding
- Password-protected encoding/decoding
- Multi-layer confidentiality for secure communication

###  **User-Friendly Interface**
- Clean, modern UI built with **React & Tailwind CSS**
- Real-time image preview and drag-and-drop support
- Intuitive workflow with clear feedback messages

### **Technical Innovation**
- LSB-based steganography for minimal image distortion
- Smart capacity checking and automatic message length encoding
- Client-side processing for maximum privacy

### **Modern Tech Stack**
- Frontend:** React.js (TypeScript), Tailwind CSS, Lucide React
- Cryptography:** Crypto-JS (AES encryption), HTML5 Canvas API
- Build Tools:** Vite, ESLint, Node.js, npm
- Fully Client-Side Execution** – No server required

## Installation & Setup

### 1️ Clone the Repository
```bash
git clone https://github.com/yourusername/steganography-project.git
cd steganography-project
```

### 2️ Install Dependencies
```bash
npm install
```

### 3️ Run the Application
```bash
npm run dev
```

The application will be available at `http://localhost:5173/` (default Vite port).

##  Usage

### Encoding a Message
1. Upload an image.
2. Enter your secret message and encryption password.
3. Click **Encode** to hide the encrypted message in the image.
4. Download the steganographic image.

### Decoding a Message
1. Upload the steganographic image.
2. Enter the correct decryption password.
3. Click **Decode** to retrieve the hidden message.

## Target Users
- Privacy-Conscious Individuals** – Secure communication
- Business Professionals** – Confidential document sharing
- Security Experts** – Cybersecurity & digital forensics
- Students & Educators** – Cryptography & data hiding concepts
- Creative Professionals** – Protecting intellectual property

## Future Enhancements
- Support for additional file formats (e.g., PNG, GIF, BMP)
- Advanced steganography techniques for higher security
- Cloud-based or PWA version for enhanced accessibility
