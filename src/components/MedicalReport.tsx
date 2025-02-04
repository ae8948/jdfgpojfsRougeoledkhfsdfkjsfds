import { QRCodeSVG } from "qrcode.react";
import { Card } from "@/components/ui/card";
import headerImage from "/lovable-uploads/5c145378-66b7-4993-80e0-bdb7500e4349.png";

interface MedicalReportProps {
  record: {
    code: string;
    name: string;
    identification?: string;
    birthdate: string;
    gender: string;
    address: string;
    phone: string;
    symptoms: Record<string, boolean>;
    medical_notes?: string;
    investigation_date: string;
    investigator: string;
    location: string;
    result?: string;
    specimen_type?: string;
    collection_date?: string;
    lab_reception_date?: string;
  };
}

const MedicalReport = ({ record }: MedicalReportProps) => {
  const qrData = JSON.stringify({
    code: record.code,
    name: record.name,
    identification: record.identification,
    phone: record.phone,
  });

  // Filter only selected symptoms
  const selectedSymptoms = Object.entries(record.symptoms)
    .filter(([_, value]) => value === true)
    .map(([key]) => key);

  return (
    <Card className="p-6 max-w-4xl mx-auto bg-white shadow-lg print:shadow-none print:mt-4">
      {/* Header */}
      <div className="mb-4">
        <img 
          src={headerImage} 
          alt="Hospital Header" 
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Report Title */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-primary">Rapport Médical</h1>
        <p className="text-muted-foreground text-sm">Date d'investigation: {new Date(record.investigation_date).toLocaleDateString()}</p>
        <p className="text-muted-foreground text-sm mt-0.5">Document généré le {new Date().toLocaleDateString()}</p>
      </div>

      {/* Patient Info and QR Code */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
        {/* Patient Info */}
        <div className="space-y-2 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="text-left">
              <h3 className="font-semibold text-primary text-sm">Code Provincial</h3>
              <p className="text-sm">{record.code}</p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-primary text-sm">Nom Complet</h3>
              <p className="text-sm">{record.name}</p>
            </div>
            {record.identification && (
              <div className="text-left">
                <h3 className="font-semibold text-primary text-sm">CNI/Passeport</h3>
                <p className="text-sm">{record.identification}</p>
              </div>
            )}
            <div className="text-left">
              <h3 className="font-semibold text-primary text-sm">Date de Naissance</h3>
              <p className="text-sm">{new Date(record.birthdate).toLocaleDateString()}</p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-primary text-sm">Sexe</h3>
              <p className="text-sm">{record.gender === 'M' ? 'Masculin' : 'Féminin'}</p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-primary text-sm">Téléphone</h3>
              <p className="text-sm">{record.phone}</p>
            </div>
            <div className="text-left col-span-2">
              <h3 className="font-semibold text-primary text-sm">Adresse</h3>
              <p className="text-sm">{record.address}</p>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="w-full md:w-auto flex justify-center">
          <QRCodeSVG 
            value={qrData}
            size={150}
            level="H"
            includeMargin
            className="border p-2 bg-white"
          />
        </div>
      </div>

      {/* Selected Symptoms */}
      {selectedSymptoms.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold text-primary text-sm mb-2 text-left">Symptômes</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {selectedSymptoms.map((symptom) => (
              <div key={symptom} className="flex items-center space-x-2 text-left">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="capitalize text-sm">{symptom}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Medical Notes */}
      {record.medical_notes && (
        <div className="mb-4">
          <h3 className="font-semibold text-primary text-sm mb-2 text-left">Notes Médicales</h3>
          <p className="whitespace-pre-wrap border rounded-md p-2 bg-muted/10 text-left text-sm">
            {record.medical_notes}
          </p>
        </div>
      )}

      {/* Laboratory Information */}
      {(record.specimen_type || record.collection_date || record.lab_reception_date) && (
        <div className="mb-4">
          <h3 className="font-semibold text-primary text-sm mb-2 text-left">Informations de Laboratoire</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {record.specimen_type && (
              <div className="text-left">
                <h4 className="font-medium text-sm">Type de Spécimen</h4>
                <p className="text-sm">{record.specimen_type}</p>
              </div>
            )}
            {record.collection_date && (
              <div className="text-left">
                <h4 className="font-medium text-sm">Date de Collecte</h4>
                <p className="text-sm">{new Date(record.collection_date).toLocaleDateString()}</p>
              </div>
            )}
            {record.lab_reception_date && (
              <div className="text-left">
                <h4 className="font-medium text-sm">Date de Réception</h4>
                <p className="text-sm">{new Date(record.lab_reception_date).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Signature Section */}
      <div className="mt-8 flex justify-between items-center">
        <div className="text-left">
          <p className="font-semibold text-sm">Investigateur:</p>
          <p className="text-sm">{record.investigator}</p>
          <p className="text-xs text-muted-foreground">{record.location}</p>
        </div>
        <div className="text-center border-t border-dashed pt-2 w-48">
          <p className="text-xs text-muted-foreground mb-[140px]">Signature et Cachet</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-2 border-t text-center text-xs text-muted-foreground">
        <p>Centre Hospitalier Provincial ASSA-ZAG</p>
      </div>
    </Card>
  );
};

export default MedicalReport;
