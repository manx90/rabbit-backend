export interface OptosCreate {
  business: number;
  business_address: number;
  // Consignee
  consignee_name: string;
  consignee_phone: string;
  consignee_city: number;
  consignee_area: number;
  consignee_address: string;
  // Shipment info
  shipment_types: number;
  quantity: number;
  items_description: string;
  is_cod: boolean;
  cod_amount: number;
  has_return: boolean;
  return_notes: string;
  notes: string;
}
