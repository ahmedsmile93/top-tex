export interface Product {
  id: string;
  name: string;
  brand: string;
  small_description: string;
  code: string;
  in_stock: boolean;
  price: number;
  link: string;
  family: string;
}

export type ChatEntry = {
  question: string;
  answer: string;
  products: Product[];
  customizations?: Customization[];
  selectedCustomizationId?: string;
  showUploadLogo?: boolean;
  logoUploaded?: boolean;
  selectedProductId?: string;
  selectedFamily?: string;
  isSelectionLocked?: boolean;
  hidden: boolean
};

export interface Customization {
  id: string;
  name: string;
  description: string;
  delay: string;
  price: string;
}

export interface ApiResponse {
  user_id: string;
  session_id: string;
  title?: string;
  answer: string;
  products: Product[];
  customizations?: Customization[];
  show_upload_placeholder?: boolean;
}

export interface ChatRequestPayload {
  user_id: string;
  message: string;
  session_id?: string;
}
