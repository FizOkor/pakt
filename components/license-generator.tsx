"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import UploadForm from "./upload-form";
import LicenseConfig from "./license-config";
import TransactionStatus from "./transaction-status";
import WalletConnect from "./wallet-connect";
import { uploadJSONToIPFS } from "@/lib/utils";
import { createHash } from "crypto";

type Step = "upload" | "configure" | "confirm" | "complete";

interface IPData {
  title: string;
  description: string;
  createdAt: string;
  ipType: string;
  image: string;
  imageHash: string;
  mediaHash: string;
  mediaUrl: string;
  mediaType: string;
  tags: string[];
  creators: string[];
}

interface NFTData {
  title: string;
  description: string;
  image: string;
  external_url?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
    display_type?: "number" | "boost_number" | "boost_percentage" | "date";
  }>;
  background_color?: string;
  animation_url?: string;
  youtube_url?: string;
}

export default function LicenseGenerator() {
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [IPData, setIPData] = useState<IPData | null>(null);
  const [NFTData, setNFTData] = useState<NFTData | null>(null);
  const [licenseData, setLicenseData] = useState({});
  const { isConnected } = useAccount();
  const [IPMetadata, setIPMetadata] = useState({});

  const uploadDataToIPFS = async () => {
    if (!IPData || !NFTData) return;
    console.log("IPData:", IPData);
    console.log("NFTData:", NFTData);

    const ipIpfsHash = await uploadJSONToIPFS(IPData);
    const ipHash = createHash("sha256")
      .update(JSON.stringify(IPData))
      .digest("hex");
    const nftIpfsHash = await uploadJSONToIPFS(NFTData);
    const nftHash = createHash("sha256")
      .update(JSON.stringify(NFTData))
      .digest("hex");

    setIPMetadata({
      ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
      ipMetadataHash: `0x${ipHash}`,
      nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
      nftMetadataHash: `0x${nftHash}`
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                P
              </span>
            </div>
            <h1 className="text-lg font-bold text-foreground">Pakt</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Step{" "}
              {["upload", "configure", "confirm", "complete"].indexOf(
                currentStep
              ) + 1}{" "}
              of 4
            </div>
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="border-b border-border bg-card/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between gap-4">
            {(["upload", "configure", "confirm", "complete"] as const).map(
              (step, idx) => (
                <div key={step} className="flex items-center gap-2 flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                      ["upload", "configure", "confirm", "complete"].indexOf(
                        currentStep
                      ) >= idx
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span className="text-sm text-muted-foreground hidden sm:inline capitalize">
                    {step}
                  </span>
                  {idx < 3 && <div className="flex-1 h-1 bg-muted mx-2" />}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {currentStep === "upload" && (
          <UploadForm
            setNFTData={setNFTData}
            onNext={(data) => {
              setIPData(data);
              setCurrentStep("configure");
            }}
          />
        )}
        {currentStep === "configure" && IPData && (
          <LicenseConfig
            onNext={() => {
              if (!isConnected) {
                alert("Please connect your wallet first");
                return;
              }
              uploadDataToIPFS().then(() => {
                setCurrentStep("confirm");
              });
              //
              // setCurrentStep("confirm");
            }}
            IPData={IPData}
            onUpdate={(updates) =>
              setLicenseData({ ...licenseData, ...updates })
            }
          />
        )}
        {currentStep === "confirm" && IPData && (
          <TransactionStatus
            IPMetadata={IPMetadata}
            licenseData={licenseData}
            onNext={() => setCurrentStep("complete")}
          />
        )}
        {currentStep === "complete" && (
          <div className="text-center space-y-6 py-12">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              License Created
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your IP has been successfully registered on Story Protocol. You
              can now mint and manage licenses on-chain.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Create Another License
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
