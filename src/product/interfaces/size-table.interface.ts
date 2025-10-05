export interface SizeField {
  fieldName: string;
  fieldValue: string;
}

export interface SizeDimension {
  sizeName: string;
  fields: SizeField[];
}

export interface SizeTableData {
  tableName: string;
  dimensions: SizeDimension[];
}
