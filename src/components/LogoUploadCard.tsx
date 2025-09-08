import { JSX, useState } from "react";
import { FaDownload, FaCheckCircle, FaTrash } from "react-icons/fa";
import { BsFiletypePdf, BsFiletypePng, BsFiletypeJpg } from "react-icons/bs";

const getFileTypeLabel = (mime: string): string => {
  if (mime.includes("pdf")) return "PDF";
  if (mime.includes("png")) return "PNG";
  if (mime.includes("jpeg") || mime.includes("jpg")) return "JPEG";
  return "Autre";
};

const fileIcons: Record<string, JSX.Element> = {
  PDF: <BsFiletypePdf size={24} color="red" />,
  PNG: <BsFiletypePng size={24} color="red" />,
  JPEG: <BsFiletypeJpg size={24} color="red" />,
};

type Props = {
  onUpload: () => void;
};

export default function LogoUploadCard({ onUpload }: Props) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    type: string;
    size: string;
    date: string;
  } | null>(null);

  const fileIcon = fileInfo?.type && fileIcons[fileInfo.type];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 60000) {
      setErrorMessage("Fichier trop grand. Max: 60 KB.");
      return;
    }

    setErrorMessage("");

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
      const fileType = getFileTypeLabel(file.type);

      const date = new Date();
      const formattedDate = `${date.getDate().toString().padStart(2, "0")}.${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}.${date.getFullYear()}`;

      setFileInfo({
        name: file.name,
        type: fileType,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        date: formattedDate,
      });

      onUpload();
    };

    reader.readAsDataURL(file);
  };

  const handleReset = () => {};

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 p-6 my-4 text-center">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <FaDownload className="text-blue-800 text-lg cursor-pointer transition-colors hover:text-blue-900" />
        <h3 className="text-lg font-bold text-gray-900 m-0">
          Logo de votre club
        </h3>
      </div>

      {/* Preview or Upload Area */}
      {logoPreview ? (
        fileInfo?.type === "PDF" ? (
          <div className="bg-gray-100 rounded-md p-4 text-gray-500 italic text-center">
            Prévisualisation non disponible pour les fichiers PDF.
          </div>
        ) : (
          <img
            src={logoPreview}
            alt="Prévisualisation du logo"
            className="max-w-full max-h-52 object-contain mx-auto block"
          />
        )
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-md p-8 max-w-sm bg-white mx-auto relative">
          <p className="font-bold text-black">
            Importez votre document au format
          </p>
          <p className="text-sm text-gray-500 mt-2">
            JPEG, PNG, PDF (moins de 60KB)
          </p>
        </div>
      )}

      {/* File Details */}
      {logoPreview ? (
        <div className="flex flex-wrap items-center justify-between bg-gray-100 rounded-md p-4 gap-4 mt-4 text-sm">
          <div className="font-bold text-gray-600 min-w-12 mt-0.5">
            {fileIcon}
          </div>

          <div className="flex-1 flex flex-col gap-1">
            <div className="font-semibold text-gray-900 flex">
              {fileInfo?.name}
            </div>
            <div className="text-xs text-gray-600 flex gap-1">
              Téléchargé le {fileInfo?.date}
            </div>
            <div className="text-xs text-gray-600 flex gap-1 items-center">
              {fileInfo?.size}
              <FaCheckCircle
                className="text-green-600 mt-0.5"
                title="Fichier validé"
              />
              <span className="text-gray-900">Validé</span>
            </div>
          </div>

          <button
            onClick={handleReset}
            title="Supprimer le fichier"
            className="bg-none border-none text-blue-800 text-xl cursor-pointer mt-0.5 hover:text-red-700"
          >
            <FaTrash />
          </button>
        </div>
      ) : (
        <label className="inline-flex items-center gap-2 mt-6 text-blue-800 font-semibold cursor-pointer">
          Importer le document{" "}
          <span className="bg-blue-800 text-white rounded-full px-3 py-1 text-base">
            +
          </span>
          <input
            type="file"
            accept="image/jpeg, image/png, application/pdf"
            onChange={handleFileChange}
            hidden
          />
        </label>
      )}

      {/* Error message */}
      {!logoPreview && errorMessage && (
        <p className="text-red-600 mt-2 text-sm font-bold text-center">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
