import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "@/integrations/supabase/client";
import { Edit, Sparkles, UserRound, Calendar, Phone, MapPin, Stethoscope, FlaskConical, ClipboardCheck } from "lucide-react";

interface MedicalRecordFormProps {
  initialData?: any;
  mode?: 'create' | 'edit';
}

const MedicalRecordForm = ({ initialData, mode = 'create' }: MedicalRecordFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    identification: "",
    birthdate: "",
    gender: "",
    address: "",
    phone: "",
    symptoms: {
      fever: false,
      cough: false,
      rash: false,
      coryza: false,
      conjunctivitis: false,
      soreThroat: false,
      headache: false,
      malaise: false,
    },
    medicalNotes: "",
    investigationDate: new Date().toISOString().split('T')[0],
    investigator: "",
    location: "CHP ASSA-ZAG",
    result: "",
    specimenType: "",
    collectionDate: new Date().toISOString().split('T')[0],
    labReceptionDate: "",
  });

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        ...initialData,
        birthdate: initialData.birthdate || "",
        investigationDate: initialData.investigation_date || new Date().toISOString().split('T')[0],
        medicalNotes: initialData.medical_notes || "",
        specimenType: initialData.specimen_type || "",
        collectionDate: initialData.collection_date || new Date().toISOString().split('T')[0],
        labReceptionDate: initialData.lab_reception_date || "",
        location: initialData.location || "CHP ASSA-ZAG",
      });
    }
  }, [initialData, mode]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      symptoms: {
        ...prev.symptoms,
        [symptom]: checked,
      },
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      'name',
      'birthdate',
      'phone',
      'investigator',
      'investigationDate',
      'collectionDate',
      'identification'  // Added identification to required fields
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Champs requis manquants",
        description: `Veuillez remplir les champs suivants : ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return false;
    }

    // Check if at least one symptom is selected
    const hasSymptoms = Object.values(formData.symptoms).some(value => value === true);
    if (!hasSymptoms) {
      toast({
        title: "Symptômes requis",
        description: "Veuillez sélectionner au moins un symptôme.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) return;

      const transformedData = {
        code: formData.code,
        name: formData.name,
        identification: formData.identification, // Added identification to transformed data
        birthdate: formData.birthdate || null,
        gender: formData.gender,
        address: formData.address,
        phone: formData.phone,
        symptoms: formData.symptoms,
        medical_notes: formData.medicalNotes || null,
        investigation_date: formData.investigationDate,
        investigator: formData.investigator,
        location: formData.location,
        result: formData.result || null,
        specimen_type: formData.specimenType || null,
        collection_date: formData.collectionDate || null,
        lab_reception_date: formData.labReceptionDate || null,
      };

      if (!transformedData.collection_date) delete transformedData.collection_date;
      if (!transformedData.lab_reception_date) delete transformedData.lab_reception_date;

      let error;

      if (mode === 'edit' && initialData?.id) {
        const { error: updateError } = await supabase
          .from('medical_records')
          .update(transformedData)
          .eq('id', initialData.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('medical_records')
          .insert(transformedData);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: mode === 'edit' ? "Mise à jour réussie" : "Enregistrement réussi",
        description: mode === 'edit' 
          ? "Le dossier médical a été mis à jour avec succès."
          : "Le nouveau dossier médical a été créé avec succès.",
        variant: "default",
      });
      
      navigate("/");
    } catch (error) {
      console.error('Error saving record:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du dossier.",
        variant: "destructive",
      });
    }
  };

  const SectionTitle = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <div className="flex items-start gap-2 mb-4">
      <Icon className="w-6 h-6 text-primary animate-pulse" />
      <h3 className="text-xl font-bold text-primary">{title}</h3>
    </div>
  );

  return (
    <>
      <Toaster />
      <Card className="p-8 space-y-8 shadow-lg animate-fade-in print-form">
        <div className="space-y-2">
          <div className="flex justify-start">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-primary text-left">Dossier Médical</h2>
          <p className="text-sm text-muted-foreground text-left">
            Remplissez soigneusement les informations du patient ci-dessous.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <SectionTitle icon={UserRound} title="Information du Patient" />
            
            <div className="space-y-4">
              <div className="space-y-2 text-left">
                <Label htmlFor="code" className="text-left block">Code Provincial</Label>
                <div className="relative">
                  <Input 
                    id="code" 
                    placeholder="Entrez le code..." 
                    value={formData.code}
                    onChange={(e) => handleInputChange("code", e.target.value)}
                    className="pl-10 transition-all hover:border-primary focus:ring-2"
                  />
                  <ClipboardCheck className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <Label htmlFor="name" className="text-left block">Nom Complet</Label>
                <div className="relative">
                  <Input 
                    id="name" 
                    placeholder="Entrez le nom du patient..." 
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="pl-10 transition-all hover:border-primary focus:ring-2"
                  />
                  <UserRound className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <Label htmlFor="identification" className="text-left block">CNI / Passeport</Label>
                <div className="relative">
                  <Input 
                    id="identification" 
                    placeholder="Entrez le numéro CNI ou Passeport..." 
                    value={formData.identification}
                    onChange={(e) => handleInputChange("identification", e.target.value)}
                    className="pl-10 transition-all hover:border-primary focus:ring-2"
                  />
                  <ClipboardCheck className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <Label htmlFor="birthdate" className="text-left block">Date de Naissance</Label>
                <div className="relative">
                  <Input 
                    id="birthdate" 
                    type="date" 
                    value={formData.birthdate}
                    onChange={(e) => handleInputChange("birthdate", e.target.value)}
                    className="pl-10 transition-all hover:border-primary focus:ring-2"
                  />
                  <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <Label htmlFor="gender" className="text-left block">Sexe</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                  <SelectTrigger className="transition-all hover:border-primary focus:ring-2">
                    <SelectValue placeholder="Sélectionnez le sexe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculin</SelectItem>
                    <SelectItem value="F">Féminin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 text-left">
                <Label htmlFor="address" className="text-left block">Adresse</Label>
                <div className="relative">
                  <Input 
                    id="address" 
                    placeholder="Entrez l'adresse..." 
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="pl-10 transition-all hover:border-primary focus:ring-2"
                  />
                  <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <Label htmlFor="phone" className="text-left block">Numéro de Téléphone</Label>
                <div className="relative">
                  <Input 
                    id="phone" 
                    placeholder="Entrez le numéro de téléphone..." 
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="pl-10 transition-all hover:border-primary focus:ring-2"
                  />
                  <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <SectionTitle icon={Stethoscope} title="Information Médicale" />
            
            <div className="space-y-4">
              <div className="space-y-2 text-left">
                <Label htmlFor="investigationDate" className="text-left block">Date d'Investigation</Label>
                <div className="relative">
                  <Input 
                    id="investigationDate" 
                    type="date" 
                    value={formData.investigationDate}
                    onChange={(e) => handleInputChange("investigationDate", e.target.value)}
                    className="pl-10 transition-all hover:border-primary focus:ring-2"
                  />
                  <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <Label htmlFor="investigator" className="text-left block">Investigateur</Label>
                <div className="relative">
                  <Input 
                    id="investigator" 
                    placeholder="Nom de l'investigateur..." 
                    value={formData.investigator}
                    onChange={(e) => handleInputChange("investigator", e.target.value)}
                    className="pl-10 transition-all hover:border-primary focus:ring-2"
                  />
                  <UserRound className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <Label htmlFor="location" className="text-left block">Lieu</Label>
                <div className="relative">
                  <Input 
                    id="location" 
                    placeholder="Lieu de l'investigation..." 
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="pl-10 transition-all hover:border-primary focus:ring-2"
                  />
                  <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <Label htmlFor="specimenType" className="text-left block">Type de Spécimen</Label>
                <Select value={formData.specimenType} onValueChange={(value) => handleInputChange("specimenType", value)}>
                  <SelectTrigger className="transition-all hover:border-primary focus:ring-2">
                    <SelectValue placeholder="Sélectionnez le type de spécimen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sanguin">Sanguin</SelectItem>
                    <SelectItem value="Salivaire">Salivaire</SelectItem>
                    <SelectItem value="Urinaire">Urinaire</SelectItem>
                    <SelectItem value="Pharyngé">Pharyngé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 text-left">
                <Label htmlFor="collectionDate" className="text-left block">Date de Collecte</Label>
                <div className="relative">
                  <Input 
                    id="collectionDate" 
                    type="date" 
                    value={formData.collectionDate}
                    onChange={(e) => handleInputChange("collectionDate", e.target.value)}
                    className="pl-10 transition-all hover:border-primary focus:ring-2"
                  />
                  <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <Label htmlFor="labReceptionDate" className="text-left block">Date de Réception au Laboratoire</Label>
                <div className="relative">
                  <Input 
                    id="labReceptionDate" 
                    type="date" 
                    value={formData.labReceptionDate}
                    onChange={(e) => handleInputChange("labReceptionDate", e.target.value)}
                    className="pl-10 transition-all hover:border-primary focus:ring-2"
                  />
                  <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <SectionTitle icon={ClipboardCheck} title="Symptômes Cliniques" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(formData.symptoms).map(([symptom, checked]) => (
              <div key={symptom} className="flex items-center space-x-2 group">
                <Checkbox 
                  id={symptom} 
                  checked={checked as boolean}
                  onCheckedChange={(checked) => handleSymptomChange(symptom, checked as boolean)}
                  className="transition-all data-[state=checked]:animate-pulse"
                />
                <Label 
                  htmlFor={symptom} 
                  className="group-hover:text-primary transition-colors"
                >
                  {symptom.charAt(0).toUpperCase() + symptom.slice(1)}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <SectionTitle icon={Edit} title="Notes Médicales" />
          <Textarea 
            placeholder="Entrez des notes médicales ou observations supplémentaires..."
            className="min-h-[100px] transition-all hover:border-primary focus:ring-2"
            value={formData.medicalNotes}
            onChange={(e) => handleInputChange("medicalNotes", e.target.value)}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="transition-all hover:bg-destructive hover:text-destructive-foreground"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit}
            className="transition-all hover:scale-105"
          >
            {mode === 'edit' ? 'Mettre à jour' : 'Enregistrer'}
          </Button>
        </div>
      </Card>
    </>
  );
};

export default MedicalRecordForm;