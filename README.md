# ⚡ Pakt — Decentralized IP Licensing on Story Protocol

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs)
![Story Protocol](https://img.shields.io/badge/Story%20SDK-purple?style=for-the-badge)
![Viem](https://img.shields.io/badge/viem-333?style=for-the-badge)

Pakt is a **Next.js + Story SDK** implementation for **permissionless IP registration and licensing** on the **Aeneid testnet**.  
The system converts creative works into on-chain IP Assets, applies **PIL-compliant licenses**, and mints the resulting NFTs—fully verifiable through Story Explorer and Story Scan.

---

## ⚙️ Architecture Overview

Pakt orchestrates a multi-stage flow integrating:
- **IPFS storage** for metadata and media assets  
- **Story SDK** for IP registration, licensing term construction, and minting  
- **Viem** for blockchain interactions and transaction management  
- **Aeneid Story Explorer** for IP Asset visualization  
- **Story Scan** for transaction tracing and validation  

All metadata (IP metadata, NFT metadata, licensing information, creator share data) follows **Story Protocol’s structured schema** for deterministic on-chain ingestion.

---

## 🔄 Flow Summary

### **Stage 1 — Metadata Construction**
- Upload asset + image → IPFS CIDs  
- Collect descriptive fields: title, description, category, tags  
- Define creator records: name, address, social links, contribution percentage  
- Assemble **IP metadata JSON** for registration

### **Stage 2 — License Specification**
- Select license template: `Commercial Remix`, `Commercial Use`, `Non-Commercial Remix`, `CC Attribution`  
- Flags & parameters:  
  - `enableLicensing`  
  - `requireAttribution`  
  - `royaltyPercent (0–50%)`  
  - `mintingFee (0–100 $IP)`  
- Embed licensing configuration inside **License Terms Metadata**, also stored on IPFS

### **Stage 3 — Register & Mint**
- Register IP Asset via Story SDK (`registerIpAsset`)  
- Attach license configuration (`registerLicenseTerms`)  
- Mint NFT referencing **NFT metadata URI**  
- Return:
  - **IP Asset link:** `https://aeneid.explorer.story.foundation/ipa/{ipId}`  
  - **Transaction link:** `https://aeneid.storyscan.io/tx/{txHash}`  

---

## 🧱 Tech Stack

- **Next.js 15**
- **Story Protocol SDK**
- **Viem**
- **IPFS (web3.storage or compatible pinning service)**
- **Aeneid Testnet**

---

## 📦 Project Features

- On-chain IP asset creation  
- PIL-compliant license generation  
- NFT minting tied to IP metadata  
- Automated royalty + attribution rule encoding  
- Full transaction + IP introspection via Story Explorer and Story Scan  

---

## 📜 License

MIT  
