import * as yup from 'yup';

// Schéma de validation pour la connexion
export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Veuillez entrer une adresse email valide')
    .required('L\'email est requis'),
  password: yup
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .required('Le mot de passe est requis')
});

// Schéma de validation pour l'inscription
export const registerSchema = yup.object({
  first_name: yup
    .string()
    .trim()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s-]+$/, 'Le prénom ne peut contenir que des lettres, espaces et tirets')
    .required('Le prénom est requis'),
  last_name: yup
    .string()
    .trim()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s-]+$/, 'Le nom ne peut contenir que des lettres, espaces et tirets')
    .required('Le nom est requis'),
  email: yup
    .string()
    .email('Veuillez entrer une adresse email valide')
    .required('L\'email est requis'),
  phone_country: yup
    .string()
    .required('L\'indicatif pays est requis'),
  phone_number: yup
    .string()
    .trim()
    .matches(/^\d{8,12}$/, 'Le numéro doit contenir entre 8 et 12 chiffres sans espaces')
    .required('Le numéro de téléphone est requis'),
  department: yup
    .string()
    .trim()
    .min(2, 'Le département doit contenir au moins 2 caractères')
    .max(100, 'Le département ne peut pas dépasser 100 caractères')
    .required('Le département est requis'),
  password: yup
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'
    )
    .required('Le mot de passe est requis'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Les mots de passe ne correspondent pas')
    .required('La confirmation du mot de passe est requise')
});

// Schéma de validation pour le profil utilisateur
export const profileSchema = yup.object({
  first_name: yup
    .string()
    .trim()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s-]+$/, 'Le prénom ne peut contenir que des lettres, espaces et tirets')
    .required('Le prénom est requis'),
  last_name: yup
    .string()
    .trim()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s-]+$/, 'Le nom ne peut contenir que des lettres, espaces et tirets')
    .required('Le nom est requis'),
  email: yup
    .string()
    .email('Veuillez entrer une adresse email valide')
    .required('L\'email est requis'),
  phone_country: yup
    .string()
    .required('L\'indicatif pays est requis'),
  phone_number: yup
    .string()
    .trim()
    .matches(/^\d{8,12}$/, 'Le numéro doit contenir entre 8 et 12 chiffres sans espaces')
    .required('Le numéro de téléphone est requis'),
  department: yup
    .string()
    .trim()
    .min(2, 'Le département doit contenir au moins 2 caractères')
    .max(100, 'Le département ne peut pas dépasser 100 caractères')
    .required('Le département est requis')
});

// Schéma de validation pour le changement de mot de passe
export const changePasswordSchema = yup.object({
  currentPassword: yup
    .string()
    .required('Le mot de passe actuel est requis'),
  newPassword: yup
    .string()
    .min(8, 'Le nouveau mot de passe doit contenir au moins 8 caractères')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'
    )
    .required('Le nouveau mot de passe est requis'),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Les mots de passe ne correspondent pas')
    .required('La confirmation du nouveau mot de passe est requise')
});

// Types TypeScript pour les schémas
export type LoginFormData = yup.InferType<typeof loginSchema>;
export type RegisterFormData = yup.InferType<typeof registerSchema>;
export type ProfileFormData = yup.InferType<typeof profileSchema>;
export type ChangePasswordFormData = yup.InferType<typeof changePasswordSchema>;
